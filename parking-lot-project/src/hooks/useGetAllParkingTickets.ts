import { useQuery } from "@tanstack/react-query";
import { getAlreadyParkedTickets } from "../api/getAlreadyParkedTicket.api";

export function useGetAllParkedTickets(){
    return useQuery({
        queryKey:["tickets"],
        queryFn:getAlreadyParkedTickets,
    })
}