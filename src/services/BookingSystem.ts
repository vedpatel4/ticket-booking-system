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
        // 1. Start a new session (like opening a new tab in your banking app)
        const session = await mongoose.startSession();

        // Wait for 10 seconds to simulate a slow operation
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        try {
            // 2. Start a transaction (like starting a money transfer)
            await session.startTransaction();

            // 3. First operation: Find and mark ticket as booked
            const ticket = await TicketModel.findOneAndUpdate(
                { ticketId, isBooked: false },  // Find available ticket
                { isBooked: true },             // Mark it as booked
                { session, new: true }          // Use this session, return updated doc
            );

            if (!ticket) {
                // 4a. If ticket not found/already booked, cancel everything
                await session.abortTransaction();
                return null;
            }

            // 5. Second operation: Create booking record
            const bookingId = `B-${uuidv4()}`;
            const newBooking = await BookingModel.create([{
                bookingId,
                customerName,
                tickets: [ticket._id],
                totalAmount: ticket.price
            }], { session });  // Use same session

            // 6. If everything is successful, commit the transaction
            await session.commitTransaction();
            
            return new Booking(bookingId, customerName);

        } catch (error) {
            // 4b. If any error occurs, cancel everything
            await session.abortTransaction();
            throw error;
        } finally {
            // 7. Always close the session
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