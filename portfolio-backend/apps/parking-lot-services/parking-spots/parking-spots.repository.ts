import { Injectable } from '@nestjs/common';
import { CreateParkingSpotDto } from './dto/create-parking-spot.dto';
import { UpdateParkingSpotDto } from './dto/update-parking-spot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ParkingSpot } from './entities/parking-spot.entity';
import { EntityManager, Repository } from 'typeorm';
import { ParkingSpotStatus, VehicleType } from '../enum/parking-lot.enum';
import { BaseRepository } from 'libs/database/base/base.repositry';

@Injectable()
export class ParkingSpotsRepository extends BaseRepository<ParkingSpot> {

  constructor(
    @InjectRepository(ParkingSpot)
    repository: Repository<ParkingSpot>,
  ) {super(repository);}

  findAvailableSpots(vehicleType?: VehicleType) {
  return this.findBy({ vehicleType, status: ParkingSpotStatus.AVAILABLE });
  }

   findBySpotNumber(spotNumber: string) {
    return this.findBy({
      spotNumber,
    });
  }

    async findAvailableForUpdate(
    manager: EntityManager,
    vehicleType: VehicleType,
): Promise<ParkingSpot | null> {

    return manager
        .getRepository(ParkingSpot)
        .createQueryBuilder('spot')

        .where('spot.vehicleType = :vehicleType', {
            vehicleType,
        })
        .andWhere('spot.status = :status', {
            status: ParkingSpotStatus.AVAILABLE,
        })
        .orderBy('spot.spotNumber', 'ASC')
        .setLock('pessimistic_write')
        .getOne();
}


}
