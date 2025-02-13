import { TicketService } from './TicketService';
import { BookingService } from './BookingService';
import { Ticket } from '../models/Ticket';
import { Booking } from '../models/Booking';
import { ITicket } from '../interfaces/ITicket';
import { TicketType } from '../enums/TicketType';

interface TicketPrices {
    VIP: number;
    REGULAR: number;
    ECONOMY: number;
}

export class BookingSystem {
    deleteBooking(id: string) {
        return this.bookingService.deleteBooking(id);
    }
    private ticketService: TicketService;
    private bookingService: BookingService;

    constructor() {
        this.ticketService = new TicketService();
        this.bookingService = new BookingService();
    }

    async getAvailableTickets(): Promise<ITicket[]> {
        return this.ticketService.getAvailableTickets();
    }

    async getAllTickets(): Promise<ITicket[]> {
        return this.ticketService.getAllTickets();
    }

    async createTicket(ticketId: string, type: TicketType, price: number): Promise<Ticket> {
        return this.ticketService.createTicket(ticketId, type, price);
    }

    async getTicketById(ticketId: string): Promise<Ticket | null> {
        return this.ticketService.getTicketById(ticketId);
    }

    async createTickets(
        rows: number, 
        columns: number, 
        vipRows: number, 
        regularRows: number,
        prices: TicketPrices
    ): Promise<Ticket[]> {
        return this.ticketService.createTickets(rows, columns, vipRows, regularRows, prices);
    }

    async createBooking(customerName: string, ticketId: string): Promise<Booking | null> {
        return this.bookingService.createBooking(customerName, ticketId);
    }

    async getAllBookings(): Promise<Booking[]> {
        return this.bookingService.getAllBookings();
    }

    async getBookingById(bookingId: string): Promise<Booking | null> {
        return this.bookingService.getBookingById(bookingId);
    }
} 