import { Box, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import type { Vehicle } from "./ParkingSimulator";

interface Props {
  textPosition?: "top" | "bottom";
  label?: string;
  carAtGate?: Vehicle[];
}

export default function ParkingGate({
  textPosition = "bottom",
  label = "ENTRY",
  carAtGate = [],
}: Props) {



  console.log("CAR AT GATE",carAtGate)
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: 150,
        width: 80,
        ml: 2,
        textAlign: "center",
      }}
    >
      {textPosition === "top" && (
        <Typography sx={{ fontSize: 20, mb: 1, fontWeight: "bold" }}>
          {label}
        </Typography>
      )}
      <Box
        sx={{
          backgroundColor: "#fde3e3",
          width: 80,
          height: 80,
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <AnimatePresence>
          {carAtGate.map((car) => (
            // Each moving car has a unique ticketNumber, so both `key` and
            // `layoutId` use that instead of the old undefined `car.id` /
            // shared `spotNumber`, which caused collisions between
            // simultaneously-entering cars.
            
            <motion.div
              key={car.ticketNumber}
              layoutId={car.ticketNumber}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{
                fontSize: "2rem",
                position: "absolute",
                zIndex: 10,
              }}
            >
              {car.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
      {textPosition === "bottom" && (
        <Typography sx={{ fontSize: 20, mt: 1, fontWeight: "bold" }}>
          {label}
        </Typography>
      )}
    </Box>
  );
}