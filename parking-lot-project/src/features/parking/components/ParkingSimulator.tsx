import { Box, Button, Slider, TextField } from "@mui/material";
import {  useState } from "react";
import ParkingGate from "./ParkingGate";
import ParkingLot from "./ParkingLot";
import { useParkingSpots } from "../../../hooks/useParkingSpots";
import { useGenerateTicket } from "../../../hooks/useGenerateTicket";
import { useExitVehicle } from "../../../hooks/useExitVehicle";
import { useGetAllParkedTickets } from "../../../hooks/useGetAllParkingTickets";
import { LayoutGroup } from "framer-motion";

const VEHICLES = ["🚗"];

export interface Vehicle {
  id: string; // unique key, ALWAYS set — used for layoutId/key, never undefined
  emoji: string;
  state: "ENTERING" | "PARKED" | "EXITING";
  spotNumber?: string;
  ticketNumber?: string;
  status?: string;
  location: string; // "ENTRY" | "EXIT" | "LOT"
}

// How long the car animates at the gate before we consider it "arrived"
const ENTRY_ANIMATION_MS = 1200; // time car sits at the gate before driving to its spot
const DRIVE_TO_SPOT_MS = 2000; // time car takes to travel from gate to spot
const EXIT_ANIMATION_MS = 1300; // time car takes to travel from spot to exit gate
const EXIT_GATE_PAUSE_MS = 1000; // time car sits at exit gate before disappearing

export default function ParkingSimulator() {
  const { data: parkingSpotDetails = [], isLoading } = useParkingSpots();
  const { data: parkedTickets = [] } = useGetAllParkedTickets();

  const generateTicket = useGenerateTicket();
  const exitVehicle = useExitVehicle();
  const [rate, setRate] = useState(20);

  // movingCars holds ONLY cars currently mid-animation (entering or exiting).
  // Once a car has arrived at its spot, it's removed from here and rendered
  // purely from server data (parkedCars below) — that's the single source
  // of truth for "settled" parked cars.
  const [movingCars, setMovingCars] = useState<Vehicle[]>([]);

  // Cars we've optimistically hidden from the parked grid because they're
  // mid-exit-animation (so they don't show in two places at once).
  const [exitingTicketNumbers, setExitingTicketNumbers] = useState<string[]>([]);

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

  // Parked cars are derived from server data (the real source of truth).
  // BUG FIX: ticketNumber/spotNumber were commented out, so every parked
  // car had `ticketNumber: undefined` and `spotNumber: undefined`. That
  // broke spot matching in ParkingLot AND broke handleExitCar's lookup
  // (which searched by ticketNumber). Both are restored here.
  const parkedCars: Vehicle[] = parkedTickets
    .filter((ticket) => ticket.status === "ACTIVE")
    .filter((ticket) => !exitingTicketNumbers.includes(ticket.ticketNumber))
    .map((ticket) => ({
      id: ticket.ticketNumber,
      emoji: VEHICLES[0],
      state: "PARKED" as const,
      spotNumber: ticket.parkingSpot.spotNumber,
      ticketNumber: ticket.ticketNumber,
      status: ticket.status,
      location: "LOT",
    }));

  if (isLoading) return <>Loading ....</>;

  const handleDrive = async () => {
    if (availableParkingSpots.length===0) {
      alert("Parking Lot is Full");
      return;
    }

    // Pick the spot up front so we know where this car is headed.
    const targetSpot = availableParkingSpots[0];

    // Give every moving car a real unique id immediately — this is what
    // framer-motion's layoutId/key relies on to animate the SAME element
    // across components instead of conflating multiple cars together.
    const tempId = targetSpot.spotNumber

    const newCar: Vehicle = {
      id: tempId,
      emoji: VEHICLES[0],
      state: "ENTERING",
      location: "ENTRY",
    };

    setMovingCars((prev) => [...prev, newCar]);

    try {
      // BUG FIX: this call was commented out entirely, so no ticket was
      // ever created and the car could never actually become "parked" in
      // the backend's eyes. Restored, and now actually awaited so we know
      // the real ticketNumber before driving the car onward.
      const ticketPromise = generateTicket.mutateAsync({
        vehicleNumber: `KA01AB${Math.floor(1000 + Math.random() * 9000)}`,
        vehicleType: "CAR",
      });

      // Let the car sit at the gate briefly (visual beat), then drive it
      // toward its target spot while the ticket request resolves in
      // parallel.
      setTimeout(() => {
        setMovingCars((prev) =>
          prev.map((car) =>
            car.spotNumber === tempId
              ? { ...car, state: "ENTERING", location: "LOT", spotNumber: targetSpot.spotNumber }
              : car,
          ),
        );
      }, ENTRY_ANIMATION_MS);

      await ticketPromise;

      // Once the car has visually arrived at the spot AND the server
      // confirms the ticket, drop it from movingCars. By now parkedTickets
      // has been refetched (via the mutation's invalidation) and will
      // include this car, so ParkingLot picks it up as a settled PARKED
      // car with no visual gap/flicker.
      setTimeout(() => {
        setMovingCars((prev) => prev.filter((car) => car.spotNumber !== tempId));
      }, ENTRY_ANIMATION_MS + DRIVE_TO_SPOT_MS);
    } catch (error) {
      console.error(error);
      alert("Unable to create ticket");
      setMovingCars((prev) => prev.filter((car) => car.spotNumber !== tempId));
    }
  };

  const getCarsAtLocation = (location: string) => {
    return movingCars.filter((car) => car.location === location);
  };

  const handleExitCar = async (ticketNumber: string) => {
    // BUG FIX: previously searched `parkedCars.find(... ticketNumber)` where
    // ticketNumber was always undefined (see fix above) — find() always
    // failed silently and exit never started.
    const parkedCar = parkedCars.find((car) => car.ticketNumber === ticketNumber);
    if (!parkedCar) return;

    // Hide it from the parked grid immediately and show it animating at
    // its own spot first, then moving to the EXIT gate.
    setExitingTicketNumbers((prev) => [...prev, ticketNumber]);

    const exitingCar: Vehicle = {
      ...parkedCar,
      state: "EXITING",
      location: "LOT", // starts at its spot, we animate it to EXIT below
    };

    setMovingCars((prev) => [...prev, exitingCar]);

    // Drive from spot to the exit gate.
    setTimeout(() => {
      setMovingCars((prev) =>
        prev.map((car) =>
          car.spotNumber === exitingCar.spotNumber ? { ...car, location: "EXIT" } : car,
        ),
      );
    }, 50);

    try {
      // Fire the real exit mutation once the car has had time to reach
      // the gate visually.
      setTimeout(async () => {
        try {
          await exitVehicle.mutateAsync({ ticketNumber });
        } catch (error) {
          console.error("Failed to exit:", error);
        } finally {
          // Let it linger at the gate briefly before vanishing.
          setTimeout(() => {
            setMovingCars((prev) => prev.filter((car) => car.spotNumber !== exitingCar.spotNumber));
            setExitingTicketNumbers((prev) => prev.filter((t) => t !== ticketNumber));
          }, EXIT_GATE_PAUSE_MS);
        }
      }, EXIT_ANIMATION_MS);
    } catch (error) {
      console.error("Failed to exit:", error);
    }
  };

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
          parkedCars={[...parkedCars, ...movingCars.filter((c) => c.location === "LOT")]}
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