// dto/request/exit-ticket.dto.ts

import { IsString } from 'class-validator';

export class ExitTicketDto {
  @IsString()
  ticketNumber!: string;
}