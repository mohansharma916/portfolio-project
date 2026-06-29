import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParkingSpotsService } from './parking-spots.service';
import { CreateParkingSpotDto } from './dto/create-parking-spot.dto';
import { UpdateParkingSpotDto } from './dto/update-parking-spot.dto';

@Controller({
  path: 'parking-spots',
})
export class ParkingSpotsController {
  constructor(private readonly parkingSpotsService: ParkingSpotsService) {}
  
  


  @Post()
  create(@Body() createParkingSpotDto: CreateParkingSpotDto) {
    return this.parkingSpotsService.create(createParkingSpotDto);
  }

   @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.parkingSpotsService.findOne(id);
  }

  @Get()
  findAll() {
    return this.parkingSpotsService.findAll();
  }

 

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParkingSpotDto: UpdateParkingSpotDto) {
    return this.parkingSpotsService.update(id, updateParkingSpotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parkingSpotsService.remove(id);
  }
}
