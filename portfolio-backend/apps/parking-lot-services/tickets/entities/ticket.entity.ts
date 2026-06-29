// entities/ticket.entity.ts

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { BaseEntity } from 'libs/database/base/base.entity';

import { ParkingSpot } from '../../parking-spots/entities/parking-spot.entity';
import { VehicleType } from '../../enum/parking-lot.enum';
import {TicketStatus} from "../../enum/ticket.enum";

@Entity({
  name: 'tickets',
})
export class Ticket extends BaseEntity {
  @Column({
        unique: true,
        length: 30,
    })
    ticketNumber!: string;

  @Column({
    length: 20,
  })
  vehicleNumber!: string;


@Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
})
amount?: number;

  @Column({
    type: 'enum',
    enum: VehicleType,
  })
  vehicleType!: VehicleType;

  @Column({
    type: 'timestamp',
  })
  entryTime!: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  exitTime?: Date;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.ACTIVE,
  })
  status!: TicketStatus;

  @ManyToOne(
    () => ParkingSpot,
    {
      nullable: false,
      eager: true,
    },
  )
  @JoinColumn({
    name: 'parking_spot_id',
  })
  parkingSpot!: ParkingSpot;
}