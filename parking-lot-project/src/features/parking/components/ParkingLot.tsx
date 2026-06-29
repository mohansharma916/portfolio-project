import { Box, Typography } from "@mui/material";
import ParkingGrid from "./ParkingGrid";
import type { ParkingSpot } from "../../../shared/types/ParkingSpotType";
import type { Vehicle } from "./ParkingSimulator";

interface Props {
  parkedCars: Vehicle[];
  onSpotClick: (ticketNumber: string) => void;
  parkingLotData: ParkingSpot[];
}

export default function ParkingLot({ parkedCars, onSpotClick, parkingLotData }: Props) {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography>Click a parked spot to exit</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 2, paddingX: 5 }}>
        {parkingLotData.map((parkingSpot) => {
          // This now works correctly because parkedCars entries reliably
          // carry a real spotNumber (see ParkingSimulator fix) instead of
          // undefined.
          const parkedCar = parkedCars.find(
            (car) => car.spotNumber === parkingSpot.spotNumber,
          );

          return (
            <ParkingGrid
              key={parkingSpot.spotNumber}
              ParkingSpot={parkingSpot}
              parkedCar={parkedCar}
              onSpotClick={onSpotClick}
              occupied={parkingSpot.status === "OCCUPIED"}
            />
          );
        })}
      </Box>
    </Box>
  );
}