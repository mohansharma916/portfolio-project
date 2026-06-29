import type { AllTicketDataType} from "../shared/types/ParkingSpotType";
import { get } from "./http";

export function getAlreadyParkedTickets(){

    return get<AllTicketDataType[]>("/tickets")

}