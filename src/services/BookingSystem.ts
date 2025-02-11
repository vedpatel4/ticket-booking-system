import { Ticket } from '../models/Ticket';
import { Booking } from '../models/Booking';
import { TicketType } from '../enums/TicketType';
import { ITicket } from '../interfaces/ITicket';
import { TicketModel } from '../models/schemas/TicketSchema';
import { BookingModel } from '../models/schemas/BookingSchema';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

export class BookingSystem {
    async getAvailableTickets(): Promise<ITicket[]> {
        const tickets = await TicketModel.find({ isBooked: false });
        return tickets.map(ticket => new Ticket(ticket.ticketId, ticket.type as TicketType, ticket.price));
    }

    async getAllTickets(): Promise<ITicket[]> {
        const tickets = await TicketModel.find();
        return tickets.map(ticket => new Ticket(ticket.ticketId, ticket.type as TicketType, ticket.price));
    }

    async createBooking(customerName: string, ticketId: string): Promise<Booking | null> {
        // Quick check first - if ticket is already booked, fail fast
        const isTicketBooked = await TicketModel.exists({ ticketId, isBooked: true });
        if (isTicketBooked) {
            return null; // Fail fast if ticket is already booked
        }

        const session = await mongoose.startSession();
        try {
            await session.startTransaction();

            // Add artificial delay only if ticket might be available
            await new Promise(resolve => setTimeout(resolve, 2000));

            const ticket = await TicketModel.findOneAndUpdate(
                { ticketId, isBooked: false },
                { isBooked: true },
                { session, new: true }
            );

            if (!ticket) {
                await session.abortTransaction();
                return null;
            }

            const bookingId = `B-${uuidv4()}`;
            const newBooking = await BookingModel.create([{
                bookingId,
                customerName,
                tickets: [ticket._id],
                totalAmount: ticket.price
            }], { session });

            await session.commitTransaction();
            
            const booking = new Booking(bookingId, customerName);
            booking.addTicket(new Ticket(ticket.ticketId, ticket.type as TicketType, ticket.price));
            return booking;

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async getAllBookings(): Promise<Booking[]> {
        const bookings = await BookingModel.find().populate<{ tickets: Array<{ ticketId: string; type: string; price: number }> }>('tickets');
        return bookings.map(booking => {
            const newBooking = new Booking(booking.bookingId, booking.customerName);
            booking.tickets.forEach(ticket => {
                const newTicket = new Ticket(ticket.ticketId, ticket.type as TicketType, ticket.price);
                newBooking.addTicket(newTicket);
            });
            return newBooking;
        });
    }

    async getBookingById(bookingId: string): Promise<Booking | null> {
        const booking = await BookingModel.findOne({ bookingId }).populate<{ tickets: Array<{ ticketId: string; type: string; price: number }> }>('tickets');
        if (!booking) return null;

        const newBooking = new Booking(booking.bookingId, booking.customerName);
        booking.tickets.forEach(ticket => {
            const newTicket = new Ticket(ticket.ticketId, ticket.type as TicketType, ticket.price);
            newBooking.addTicket(newTicket);
        });
        return newBooking;
    }

    async createTicket(type: string, price: number): Promise<Ticket> {
        try {
            const ticketId = `T-${uuidv4()}`;
            const ticket = await TicketModel.create({
                ticketId,
                type,
                price,
                isBooked: false
            });
            
            return new Ticket(ticket.ticketId, ticket.type as TicketType, ticket.price);
        } catch (error) {
            console.error('Error creating ticket:', error);
            throw error;
        }
    }
} 