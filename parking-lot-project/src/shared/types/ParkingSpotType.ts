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
  parkingSpot: string;
  entryTime: Date;
}


export interface AllTicketDataType extends Ticket{}
