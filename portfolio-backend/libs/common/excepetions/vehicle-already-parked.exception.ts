import { ConflictException } from "@nestjs/common";

export class VehicleAlreadyParkedException
extends ConflictException {

    constructor() {

        super(
            "Vehicle is already inside the parking lot.",
        );

    }

}