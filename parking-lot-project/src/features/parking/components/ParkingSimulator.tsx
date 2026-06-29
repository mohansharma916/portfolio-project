import { Box, Button, Slider, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import ParkingGate from "./ParkingGate";
import ParkingLot from "./ParkingLot";
import { useParkingSpots } from "../../../hooks/useParkingSpots";
import { useGenerateTicket } from "../../../hooks/useGenerateTicket";
import { useExitVehicle } from "../../../hooks/useExitVehicle";
import { useGetAllParkedTickets } from "../../../hooks/useGetAllParkingTickets";
import { LayoutGroup } from "framer-motion";

const VEHICLES = ["🚗"];

export interface Vehicle {
  id?: string;
  emoji: string;
  state: "ENTERING" | "PARKED" | "EXITING";
  spotNumber?: string;
  ticketNumber?: string;
  status?: string;
  location: string;
}

// How long the car animates at the gate before we consider it "arrived"
const ENTRY_ANIMATION_MS = 2500;
const EXIT_ANIMATION_MS = 2500;

export default function ParkingSimulator() {
  const { data: parkingSpotDetails = [], isLoading } = useParkingSpots();
  const { data: parkedTickets = [] } = useGetAllParkedTickets();

  const generateTicket = useGenerateTicket();
  const exitVehicle = useExitVehicle();
  const [rate, setRate] = useState(20);
  const [movingCars, setMovingCars] = useState<Vehicle[]>([]);
  const [parkingCar,setParkingCar]=useState<Vehicle[]>([])

  if (isLoading) return <>Loading ....</>;

  const availableParkingSpots = parkingSpotDetails.filter(
    (spot) => spot.status === "AVAILABLE",
  );

  const occupiedSpots = parkingSpotDetails.filter(
    (spot) => spot.status === "OCCUPIED",
  ).length;

  const detailsData = [
    { data: "Available", value: availableParkingSpots.length },
    { data: "Occupied", value: occupiedSpots },
    { data: "Revenue", value: `₹${occupiedSpots * rate}` },
  ];

  // Parked cars are derived from server data (the real source of truth),
  // not from local state that nothing ever updates.
  const parkedCars: Vehicle[] = parkedTickets.map((ticket) => ({
    id: ticket.ticketNumber,
    emoji: VEHICLES[0],
    state: "PARKED" as const,
    spotNumber: ticket.parkingSpot ,
    ticketNumber: ticket.ticketNumber,
    location: ticket.parkingSpot
  }));

  const handleDrive = async () => {
    if (!availableParkingSpots.length) {
      alert("Parking Lot is Full");
      return;
    }

    try {
      // const ticket = await generateTicket.mutateAsync({
      //   vehicleNumber: `KA01AB${Math.floor(1000 + Math.random() * 9000)}`,
      //   vehicleType: "CAR",
      // });

      const newCar: Vehicle = {
        // id: ticket.ticketNumber,
        emoji: VEHICLES[0],
        state: "ENTERING",
        location: "ENTRY",
        // ticketNumber: ticket.ticketNumber,
        spotNumber: "A1",
      };

      setMovingCars((prev) => [...prev, newCar]);

      // After the entry animation finishes, drop the car from the moving
      // layer. By then `parkedTickets` (refetched via the ticket mutation's
      // query invalidation) should include it, so ParkingLot will render it
      // as parked in its actual spot.
      setTimeout(() => {
        setMovingCars((prev) =>
          prev.filter((car) => car.spotNumber !== newCar.spotNumber),
        );
      }, ENTRY_ANIMATION_MS);
    } catch (error) {
      console.error(error);
      alert("Unable to create ticket");
    }
  };

  const getCarsAtLocation = (location: string) => {
    return parkingCar.filter((car) => car.location === location);
  };

  const handleExitCar = async (ticketNumber: string) => {
    const parkedCar = parkedCars.find((car) => car.ticketNumber === ticketNumber);
    if (!parkedCar) return;

    // Show the car animating out at the EXIT gate immediately.
    setMovingCars((prev) => [
      ...prev,
      { ...parkedCar, state: "EXITING", location: "EXIT" },
    ]);

    try {
      setTimeout(async () => {
        try {
          await exitVehicle.mutateAsync({ ticketNumber });
        } catch (error) {
          console.error("Failed to exit:", error);
        } finally {
          setMovingCars((prev) =>
            prev.filter((car) => car.ticketNumber !== ticketNumber),
          );
        }
      }, EXIT_ANIMATION_MS);
    } catch (error) {
      console.error("Failed to exit:", error);
    }
  };




  useEffect(()=>{
    setParkingCar(movingCars)

  },[movingCars])

  return (
    <LayoutGroup>
      <Box sx={styles.main}>
        <ParkingGate
          label="ENTRY"
          textPosition="bottom"
          carAtGate={getCarsAtLocation("ENTRY")}
        />
        <ParkingLot
          parkingLotData={parkingSpotDetails}
          parkedCars={parkedCars}
          onSpotClick={handleExitCar}
        />
        <Box sx={styles.parkingGateWrapper}>
          <ParkingGate
            label="EXIT"
            textPosition="top"
            carAtGate={getCarsAtLocation("EXIT")}
          />
        </Box>
        <Box sx={{ borderTop: "3px solid black" }} />
        <Box
          sx={{
            display: "flex",
            gap: 4,
            justifyContent: "center",
            paddingTop: "10px",
          }}
        >
          {detailsData.map((data) => (
            <Box
              key={data.data}
              sx={{
                alignItems: "center",
                textAlign: "center",
                fontSize: "20px",
              }}
            >
              <Box>{data.data}</Box>
              <Box>{data.value}</Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ borderTop: "3px solid black" }} />
        <Box sx={{ display: "flex", flexDirection: "row", mt: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 3, width: 500 }}>
            <Box>Hourly Rate (₹)</Box>
            <Box sx={{ width: 100 }}>
              <Slider
                value={rate}
                min={10}
                max={100}
                step={5}
                onChange={(_, value) => setRate(value as number)}
              />
            </Box>
            <Box sx={{ height: 80, width: 80, ml: 2, textAlign: "center" }}>
              <Box sx={{ backgroundColor: "grey", borderRadius: 1 }}>
                <TextField
                  type="number"
                  onChange={(e) => setRate(Number(e.target.value))}
                  value={rate}
                />
              </Box>
            </Box>
          </Box>
          <Button disabled={generateTicket.isPending} onClick={handleDrive}>
            {generateTicket.isPending ? "Entering..." : "Enter Parking"}
          </Button>
        </Box>
      </Box>
    </LayoutGroup>
  );
}

const styles = {
  main: {
    width: 800,
    height: 800,
    p: 2,
    border: "1px solid black",
  },
  parkingGateWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    mr: 2,
    mt: 4,
  },
};