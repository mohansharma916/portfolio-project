import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import { DatabaseModule } from '@app/database/database.module';
import { ParkingSpotsModule } from 'apps/parking-lot-services/parking-spots/parking-spots.module';
import { TicketsModule } from 'apps/parking-lot-services/tickets/tickets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ParkingSpotsModule,
    TicketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
