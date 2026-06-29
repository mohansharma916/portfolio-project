import { ConflictException } from "@nestjs/common";

export class TicketNotFoundException extends ConflictException {

    constructor() {

        super("Ticket not found.");

    }

}