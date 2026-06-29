import type { ParkingSpot, Ticket } from "../shared/types/ParkingSpotType";
import { post } from "./http";

export function createParkingTicket(data: { vehicleNumber: string; vehicleType: string }) {
    // Ensuring the generic type signatures align cleanly
    return post<Ticket, typeof data>("/tickets/entry", data);
}