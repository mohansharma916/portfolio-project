import { Injectable } from "@nestjs/common";

@Injectable()
export class PricingService {

  calculate(entryTime: Date, exitTime: Date): number {

      const hours =
        Math.ceil(
          (exitTime.getTime() - entryTime.getTime())
          / (1000 * 60 * 60),
        );

      return hours * 20;
  }

  getDurationInMinutes(
      entryTime: Date,
      exitTime: Date,
  ): number {

      return Math.ceil(
        (exitTime.getTime() - entryTime.getTime())
        / (1000 * 60),
      );

  }

}