import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from '../middleware.ts/logger.middleware';
import { ParkingSpotsModule } from '../parking-spots/parking-spots.module';
import { DatabaseModule } from '@app/database/database.module';
import { TicketsModule } from '../tickets/tickets.module';

@Module({
  imports: [
    DatabaseModule,
    ParkingSpotsModule,
    TicketsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}
