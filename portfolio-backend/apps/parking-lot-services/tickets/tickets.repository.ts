import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { BaseRepository } from 'libs/database/base/base.repositry';
import { Ticket } from './entities/ticket.entity';
import { TicketStatus } from '../enum/ticket.enum';

@Injectable()
export class TicketsRepository extends BaseRepository<Ticket> {

  constructor(
    @InjectRepository(Ticket)
    repository: Repository<Ticket>,
  ) {super(repository);}


  async findActiveVehicle(vehicleNumber: string) {
    return await this.findBy({vehicleNumber,status:TicketStatus.ACTIVE});
  }

  async findByTicketNumber(ticketNumber: string) {
    return await this.findBy({ticketNumber});
  }





async createTicket(
    manager: EntityManager,
    ticket: Ticket,
) {

    return manager.save(ticket);

}

async save(
    manager: EntityManager,
    ticket: Ticket,
): Promise<Ticket> {

    return manager.save(ticket);

}



async findActiveTicketForUpdate(
  manager: EntityManager,
  ticketNumber: string,
): Promise<Ticket | null> {
  const ticket = await manager
    .getRepository(Ticket)
    .createQueryBuilder('ticket')
    .where('ticket.ticketNumber = :ticketNumber', {
      ticketNumber,
    })
    .andWhere('ticket.status = :status', {
      status: TicketStatus.ACTIVE,
    })
    .setLock('pessimistic_write')
    .getOne();

  if (!ticket) {
    return null;
  }

  return manager.getRepository(Ticket).findOne({
    where: {
      id: ticket.id,
    },
    relations: {
      parkingSpot: true,
    },
  });
}


}
