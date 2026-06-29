import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port:   5432,
      username: process.env.POSTGRES_USER || 'myuser',
      password: process.env.POSTGRES_PASSWORD || 'mypassword',
      database: process.env.POSTGRES_DB || 'mydatabase',
      autoLoadEntities: true,
      logging: true,
      synchronize: true, // Set to false in production
      })
    })
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
