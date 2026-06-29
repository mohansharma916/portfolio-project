import { Module } from '@nestjs/common';
import { ParkingSpotsService } from './parking-spots.service';
import { ParkingSpotsController } from './parking-spots.controller';
import { ParkingSpotsRepository } from './parking-spots.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSpot } from './entities/parking-spot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ParkingSpot])
  ],
  controllers: [ParkingSpotsController],
  providers: [ParkingSpotsService, ParkingSpotsRepository],
  exports: [ParkingSpotsService, ParkingSpotsRepository]
})
export class ParkingSpotsModule {}
