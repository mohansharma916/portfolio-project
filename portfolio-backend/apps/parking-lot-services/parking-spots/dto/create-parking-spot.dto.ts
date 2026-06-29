import { VehicleType } from "../../enum/parking-lot.enum";
import { IsEnum, IsString } from "class-validator";

export class CreateParkingSpotDto {

@IsString()
spotNumber!: string;


@IsEnum(VehicleType)
vehicleType!: VehicleType;

}
