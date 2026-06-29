import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createParkingTicket } from "../api/createTicket.api";

export function useGenerateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createParkingTicket,
    onSuccess: () => {
      // Both the spot grid (AVAILABLE/OCCUPIED) and the parked-cars list
      // depend on this mutation's result, so both need to be refetched.
    //   queryClient.invalidateQueries({ queryKey: ["parking-spots"] });
      queryClient.invalidateQueries({ queryKey: ["parked-tickets"] });
    },
  });
}