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
            // layoutId is keyed by ticketNumber, not spotNumber, so it stays
            // unique to this specific car as it animates between the gate
            // and its spot (and matches the layoutId used in ParkingGate).
            <motion.div
              key={parkedCar.ticketNumber}
              layoutId={"A1"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
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