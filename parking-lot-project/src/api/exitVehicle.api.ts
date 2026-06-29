import type { ParkingSpot, Ticket } from "../shared/types/ParkingSpotType";
import { post } from "./http";

export function exitVehicleFromParking(data){

    return post<Ticket,Partial<ParkingSpot>>("/tickets/exit",data)

}