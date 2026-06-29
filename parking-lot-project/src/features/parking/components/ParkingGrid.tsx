import { Box, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import type { Vehicle } from "./ParkingSimulator";
import type { ParkingSpot } from "../../../shared/types/ParkingSpotType";

interface Props {
  ParkingSpot: ParkingSpot;
  parkedCar?: Vehicle;
  onSpotClick: (ticketNumber: string) => void;
  occupied: boolean;
}

export default function ParkingGrid({ ParkingSpot, parkedCar, onSpotClick, occupied }: Props) {
  const handleExitTheCar = () => {
    if (parkedCar?.ticketNumber) {
      onSpotClick(parkedCar.ticketNumber);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          width: 100,
          height: 30,
          border: "2px dotted",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          cursor: parkedCar ? "pointer" : "default",
        }}
        onClick={handleExitTheCar}
      >
        <AnimatePresence>
          {parkedCar && (
            // BUG FIX: layoutId/key keyed by car.id (stable per-car id set
            // in ParkingSimulator), matching the same id used in
            // ParkingGate. This is what lets framer-motion treat the car
            // at the gate and the car in this spot as ONE continuous
            // element and animate it smoothly between the two, instead of
            // every car sharing the literal id "pop" and clobbering each
            // other.
            <motion.div
              key={parkedCar.id}
              layoutId={parkedCar.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ fontSize: "2rem", position: "absolute" }}
            >
              {parkedCar.emoji}
            </motion.div>
          )}
        </AnimatePresence>
        {ParkingSpot.spotNumber}
      </Box>
      <Typography>{ParkingSpot.status}</Typography>
    </Box>
  );
}