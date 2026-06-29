import { VehicleType } from "apps/parking-lot-services/enum/parking-lot.enum";

export class ExitTicketResponseDto {
  ticketNumber?: string;

  vehicleNumber?: string;

  vehicleType?: VehicleType;

  parkingSpot?: string;

  entryTime?: Date;

  exitTime?: Date;

  durationInMinutes?: number;

  amount?: number;
}