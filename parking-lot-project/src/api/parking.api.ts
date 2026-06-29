import type { ParkingSpot } from "../shared/types/ParkingSpotType";
import { get } from "./http";

export function getTotalParkingSpots(){

    return get<ParkingSpot[]>("/parking-spots")

}