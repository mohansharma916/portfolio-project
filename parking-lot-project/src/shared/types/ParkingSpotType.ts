export interface ParkingSpot {
  id: string;
  spotNumber: string;
  vehicleType: string;
  status: string;
}

export interface Ticket {
  ticketNumber: string;
  vehicleNumber: string;
  vehicleType: string;
  parkingSpot: ParkingSpot;
  status:string;
  entryTime: Date;
}


export interface AllTicketDataType extends Ticket{}


export interface Vehicle {
  ticketNumber: string;
  emoji: string;

  state: "ENTERING" | "EXITING";

  from: string;
  to: string;

  spotNumber: string;
}
