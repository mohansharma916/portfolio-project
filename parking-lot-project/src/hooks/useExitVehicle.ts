import { useMutation, useQueryClient } from "@tanstack/react-query";
import { exitVehicleFromParking } from "../api/exitVehicle.api";

export function useExitVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: exitVehicleFromParking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parking-spots"] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}