import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
@Injectable()
export class TicketNumberGenerator
implements ITicketNumberGenerator
{
    async generate(
        manager: EntityManager,
    ): Promise<string> {

        const result =
        await manager.query(

            `SELECT nextval('ticket_sequence')`

        );

        const sequence =
            result[0].nextval;

        return `PK${sequence
            .toString()
            .padStart(6,"0")}`;

    }
}


export interface ITicketNumberGenerator {

    generate(
        manager: EntityManager,
    ): Promise<string>;

}