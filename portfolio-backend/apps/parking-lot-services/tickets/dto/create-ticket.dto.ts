import { VehicleType } from "apps/parking-lot-services/enum/parking-lot.enum";
import { IsEnum, IsString, Matches } from "class-validator";

export class CreateTicketDto {
  @IsString()
    @Matches(/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/)
    vehicleNumber!: string;

  @IsEnum(VehicleType)
  vehicleType!: VehicleType;
}