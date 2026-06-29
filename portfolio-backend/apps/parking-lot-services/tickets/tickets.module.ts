import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketsRepository } from './tickets.repository';
import { ParkingSpotsModule } from '../parking-spots/parking-spots.module';
import { CommonModule } from '@app/common/common.moudle';
import { PricingService } from '../pricing/pricing.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]),ParkingSpotsModule,CommonModule,],
  controllers: [TicketsController],
  providers: [TicketsService, TicketsRepository,PricingService],
  exports: [TicketsService]
})
export class TicketsModule {}
