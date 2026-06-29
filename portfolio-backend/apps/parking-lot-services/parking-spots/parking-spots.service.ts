import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateParkingSpotDto } from './dto/create-parking-spot.dto';
import { UpdateParkingSpotDto } from './dto/update-parking-spot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ParkingSpot } from './entities/parking-spot.entity';
import { ParkingSpotsRepository } from './parking-spots.repository';
import { ParkingSpotStatus, VehicleType } from '../enum/parking-lot.enum';
import { ParkingFullException } from 'libs/common/excepetions/parking-full.exception';

@Injectable()
export class ParkingSpotsService {
  constructor(    private readonly parkingSpotsRepository: ParkingSpotsRepository){
  }

  async create(createParkingSpotDto: CreateParkingSpotDto) {


    const existParkingSpot=await this.parkingSpotsRepository.findBySpotNumber(createParkingSpotDto.spotNumber);
    if (existParkingSpot) {
      throw new ConflictException(`Parking spot with number ${createParkingSpotDto.spotNumber} already exists.`); 
    }

    return this.parkingSpotsRepository.create(createParkingSpotDto);
  }

  findAll() {
    return this.parkingSpotsRepository.findAll({order: { spotNumber: 'ASC' }});
  }

  async findOne(id) {
          console.log("READY")
      const spot=await this.parkingSpotsRepository.findBy({id})
      console.log("SPOT",spot)


 if(!spot){
  throw new NotFoundException(`Parking spot with id ${id} not found.`); 
 }



    return await this.parkingSpotsRepository.findOne(id);
  }

  async update(id: string, updateParkingSpotDto: UpdateParkingSpotDto) {

const spot=await this.parkingSpotsRepository.findBy({id})
if(!spot){
  throw new NotFoundException(`Parking spot with id ${id} not found.`); 
}
if(spot.status===ParkingSpotStatus.OCCUPIED){
  throw new BadRequestException(`Parking spot with id ${id} is currently occupied and cannot be updated.`); 
}


    return await this.parkingSpotsRepository.update(id, updateParkingSpotDto);
  }

  async remove(id: string) {
    const spot=await this.parkingSpotsRepository.findBy({id})
      if(!spot){
              throw new NotFoundException(`Parking spot with id ${id} not found.`); 
              }
      if(spot.status===ParkingSpotStatus.OCCUPIED){
                throw new BadRequestException(`Parking spot with id ${id} is currently occupied and cannot be updated.`); 
            }
    
          return await   this.parkingSpotsRepository.remove(id);
  }

  async findAvailableSpots(vehicleType: VehicleType) {

  return await this.parkingSpotsRepository.findAvailableSpots(vehicleType);
  }

  async allotSlot(vehicleType: VehicleType) {

    const availableSpots = await this.parkingSpotsRepository.findAvailableSpots(vehicleType);
    if (!availableSpots) {
      throw new Error('No available parking spots for the specified vehicle type.');
    }
    availableSpots.status = ParkingSpotStatus.OCCUPIED;
    await this.parkingSpotsRepository.update(availableSpots.id, availableSpots);

  

    return availableSpots
  }


  async allocateSpot(
    manager: EntityManager,
    vehicleType: VehicleType,
): Promise<ParkingSpot> {

    const spot =
        await this.parkingSpotsRepository.findAvailableForUpdate(
            manager,
            vehicleType,
        );

    if (!spot) {
        throw new ParkingFullException();
    }

    spot.status =
        ParkingSpotStatus.OCCUPIED;

    await manager.save(spot);

    return spot;
}


async releaseSpot(
    manager: EntityManager,
    parkingSpot: ParkingSpot,
): Promise<void> {

    parkingSpot.status =
        ParkingSpotStatus.AVAILABLE;

    await manager.save(parkingSpot);

}
  
  freeSpot(id: number) {
    return `This action frees a #${id} parkingSpot`;
  }






}
