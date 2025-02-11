import { ITicket } from './ITicket';

export interface IBooking {
    addTicket(ticket: ITicket): boolean;
    getBookingDetails(): string;
    getBookingId(): string;
    getCustomerName(): string;
    getTotalAmount(): number;
} 