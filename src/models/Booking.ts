import { IBooking } from '../interfaces/IBooking';
import { ITicket } from '../interfaces/ITicket';

export class Booking implements IBooking {
    private bookingId: string;
    private customerName: string;
    private tickets: ITicket[];
    private totalAmount: number;

    constructor(bookingId: string, customerName: string) {
        this.bookingId = bookingId;
        this.customerName = customerName;
        this.tickets = [];
        this.totalAmount = 0;
    }

    addTicket(ticket: ITicket): boolean {
        if (ticket.isAvailable()) {
            if (ticket.book()) {
                this.tickets.push(ticket);
                this.totalAmount += ticket.getPrice();
                return true;
            }
        }
        return false;
    }

    getBookingDetails(): string {
        return `
Booking ID: ${this.bookingId}
Customer: ${this.customerName}
Tickets: ${this.tickets.length}
Total Amount: $${this.totalAmount}
`;
    }

    getBookingId(): string {
        return this.bookingId;
    }

    getCustomerName(): string {
        return this.customerName;
    }

    getTotalAmount(): number {
        return this.totalAmount;
    }

    getTickets(): ITicket[] {
        return this.tickets;
    }
} 