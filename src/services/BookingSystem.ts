import { Ticket } from '../models/Ticket';
import { Booking } from '../models/Booking';
import { TicketType } from '../enums/TicketType';
import { ITicket } from '../interfaces/ITicket';
import { TicketModel } from '../models/schemas/TicketSchema';
import { BookingModel } from '../models/schemas/BookingSchema';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { setTimeout } from 'timers/promises';

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
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            // First find and mark the ticket
            const ticket = await TicketModel.findOneAndUpdate(
                { ticketId, isBooked: false },
                { isBooked: true },
                { session, new: true }
            );

            if (!ticket) {
                await session.abortTransaction();
                return null;
            }

            // Add delay here to simulate user taking time
            await setTimeout(10000);  // 10 seconds delay

            // Continue with booking creation
            const bookingId = `B-${uuidv4()}`;
            await BookingModel.create([{
                bookingId,
                customerName,
                tickets: [ticket._id],
                totalAmount: ticket.price
            }], { session });

            await session.commitTransaction();
            return new Booking(bookingId, customerName);

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

    async createTicket(type: string): Promise<Ticket> {
        try {
            const ticketId = `T-${uuidv4()}`;
            console.log('Creating ticket with:', { ticketId, type });
            
            const ticket = await TicketModel.create({
                ticketId,
                type,
                isBooked: false
            });
            
            console.log('Ticket created:', ticket);
            return new Ticket(ticket.ticketId, ticket.type as TicketType, ticket.price);
        } catch (error) {
            console.error('BookingSystem Error:', error);
            throw error;
        }
    }
} 