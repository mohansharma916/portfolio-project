import { ConflictException } from "@nestjs/common";

export class ParkingFullException extends ConflictException {

    constructor() {

        super("Parking lot is full.");

    }

}