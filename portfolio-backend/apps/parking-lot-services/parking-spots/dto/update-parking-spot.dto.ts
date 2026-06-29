
import { CreateParkingSpotDto } from './create-parking-spot.dto';
import{PartialType} from '@nestjs/mapped-types';

export class UpdateParkingSpotDto extends PartialType(CreateParkingSpotDto) {}
