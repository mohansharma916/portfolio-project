import {  Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ParkingSpotStatus, VehicleType } from "../../enum/parking-lot.enum";
import { BaseEntity } from "libs/database/base/base.entity";


@Entity("parking_spots")
export class ParkingSpot extends BaseEntity {

    @Column({ unique: true })
    spotNumber!: string;

    @Column({
        type: 'enum',
        enum: VehicleType
    })
    vehicleType!: VehicleType;

    @Column({ type: "enum", enum: ParkingSpotStatus, default: ParkingSpotStatus.AVAILABLE })
    status!: ParkingSpotStatus;
}