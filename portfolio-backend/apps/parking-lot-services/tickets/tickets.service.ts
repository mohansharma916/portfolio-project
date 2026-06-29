import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketsRepository } from './tickets.repository';
import { TicketStatus } from '../enum/ticket.enum';
import { ParkingSpotsService } from '../parking-spots/parking-spots.service';
import { DataSource } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { VehicleAlreadyParkedException } from 'libs/common/excepetions/vehicle-already-parked.exception';
import {  TicketNumberGenerator } from '@app/common/generators/ticket-number.generator';
import { ExitTicketDto } from './dto/exit-ticket.dto';
import { ExitTicketResponseDto } from './dto/exit-ticket-response.dto';
import { PricingService } from '../pricing/pricing.service';
import { TicketNotFoundException } from 'libs/common/excepetions/ticket-not-found.exception';

@Injectable()
export class TicketsService {
  constructor(private readonly ticketsRepository: TicketsRepository,
    private readonly parkingSpotService: ParkingSpotsService,
    private readonly ticketGenerator: TicketNumberGenerator,
    private readonly pricingService: PricingService,
    private readonly dataSource: DataSource,
){}





  async createEntry(dto: CreateTicketDto) {
    console.log("createTicketDto", dto);

     return this.dataSource.transaction(

        async (manager) => {
            const activeTicket = await this.ticketsRepository
            .findActiveVehicle(dto.vehicleNumber,);

            if (activeTicket) {
                    throw new VehicleAlreadyParkedException();
            }

          const parkingSpot =await this.parkingSpotService.allocateSpot(
          manager,
          dto.vehicleType,
        )
          const ticketNumber =await this.ticketGenerator.generate(manager);
          const ticket =manager.create(Ticket,{
        ticketNumber,
        vehicleNumber:dto.vehicleNumber,
        vehicleType:dto.vehicleType,
        entryTime:new Date(),
        status:TicketStatus.ACTIVE,
        parkingSpot,
    },
);
await this.ticketsRepository
.createTicket(
    manager,
    ticket,
);

return {
    ticketNumber:ticket.ticketNumber,
    vehicleNumber:ticket.vehicleNumber,
    vehicleType:ticket.vehicleType,
    parkingSpot:parkingSpot.spotNumber,
    entryTime:ticket.entryTime,
};




        }

          

    );
  }

  findAll() {
    return this.ticketsRepository.findAll()
  }
  
  async findActiveVehicle(vehicleNumber: string) {
    return await this.ticketsRepository.findBy({vehicleNumber,status:TicketStatus.ACTIVE});
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }

async exitVehicle(
    dto: ExitTicketDto,
): Promise<ExitTicketResponseDto> {

    return this.dataSource.transaction(
      async (manager) => {

        const ticket =
          await this.ticketsRepository
            .findActiveTicketForUpdate(
              manager,
              dto.ticketNumber,
            );

        if (!ticket) {
          throw new TicketNotFoundException();
        }

        const exitTime = new Date();

        const amount =
          this.pricingService.calculate(
            ticket.entryTime,
            exitTime,
          );

        const duration =
          this.pricingService.getDurationInMinutes(
            ticket.entryTime,
            exitTime,
          );

        ticket.exitTime = exitTime;
        ticket.status = TicketStatus.CLOSED;

        // I'd recommend adding this field to the entity
        ticket.amount = amount;

        await this.ticketsRepository.save(
          manager,
          ticket,
        );

        await this.parkingSpotService.releaseSpot(
          manager,
          ticket.parkingSpot,
        );

        return {
          ticketNumber: ticket.ticketNumber,
          vehicleNumber: ticket.vehicleNumber,
          vehicleType: ticket.vehicleType,
          parkingSpot: ticket.parkingSpot.spotNumber,
          entryTime: ticket.entryTime,
          exitTime,
          durationInMinutes: duration,
          amount,
        };
      },
    );
}









}
