import { useQuery } from "@tanstack/react-query";
import { getTotalParkingSpots } from "../api/parking.api";

export function useParkingSpots(){
    return useQuery({
        queryKey:["parking-spots"],
        queryFn:getTotalParkingSpots,
    })
}