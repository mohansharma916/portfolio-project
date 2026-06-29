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
            // BUG FIX: layoutId was hardcoded to the literal string "pop"
            // for every car everywhere (here AND in ParkingGrid). With a
            // shared layoutId, framer-motion treats every car in the app as
            // the SAME element, so multiple simultaneous cars would morph
            // into and fight each other instead of animating independently.
            // Each car now gets its own stable id (car.id, set once when
            // created in ParkingSimulator) used as both `key` and
            // `layoutId`, and the SAME id is used in ParkingGrid below so
            // framer-motion can smoothly animate this exact car between
            // the gate and its spot.
            <motion.div
              key={car.id}
              layoutId={car.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
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