import { Module } from "@nestjs/common";
import { TicketNumberGenerator } from "./generators/ticket-number.generator";

@Module({
  providers: [TicketNumberGenerator],
  exports: [TicketNumberGenerator],
})
export class CommonModule {}