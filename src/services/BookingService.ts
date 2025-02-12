import { Booking } from '../models/Booking';
import { Ticket } from '../models/Ticket';
import { TicketType } from '../enums/TicketType';
import { TicketModel } from '../models/schemas/TicketSchema';
import { BookingModel } from '../models/schemas/BookingSchema';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { setTimeout } from 'timers/promises';

export class BookingService {
    async createBooking(customerName: string, ticketId: string): Promise<Booking | null> {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const ticket = await TicketModel.findOneAndUpdate(
                { ticketId, isBooked: false },
                { isBooked: true },
                { session, new: true }
            );

            if (!ticket) {
                await session.abortTransaction();
                return null;
            }

            await setTimeout(10000);  // 10 seconds delay

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
        const bookings = await BookingModel.find()
            .populate<{ tickets: Array<{ ticketId: string; type: string; price: number }> }>('tickets');
        return this.mapBookings(bookings);
    }

    async getBookingById(bookingId: string): Promise<Booking | null> {
        const booking = await BookingModel.findOne({ bookingId })
            .populate<{ tickets: Array<{ ticketId: string; type: string; price: number }> }>('tickets');
        if (!booking) return null;
        return this.mapBooking(booking);
    }

    private mapBooking(booking: any): Booking {
        const newBooking = new Booking(booking.bookingId, booking.customerName);
        booking.tickets.forEach((ticket: any) => {
            const newTicket = new Ticket(ticket.ticketId, ticket.type as TicketType, ticket.price);
            newBooking.addTicket(newTicket);
        });
        return newBooking;
    }

    private mapBookings(bookings: any[]): Booking[] {
        return bookings.map(booking => this.mapBooking(booking));
    }
} 