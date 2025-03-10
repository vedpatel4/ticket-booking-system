import { Request, Response } from 'express';
import { BookingSystem } from '../services/BookingSystem';

export class BookingController {
    private bookingSystem: BookingSystem;

    constructor() {
        this.bookingSystem = new BookingSystem();
    }

    getAllBookings = async (req: Request, res: Response) => {
        try {
            const bookings = await this.bookingSystem.getAllBookings();
            res.status(200).json(bookings);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching bookings', error });
        }
    };

    getBookingById = async (req: Request, res: Response) => {
        try {
            const booking = await this.bookingSystem.getBookingById(req.params.id);
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            res.status(200).json(booking);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching booking', error });
        }
    };

    createBooking = async (req: Request, res: Response) => {
        try {
            const { customerName, ticketId } = req.body;
            if (!customerName || !ticketId) {
                return res.status(400).json({ message: 'Customer name and ticket ID are required' });
            }
            const booking = await this.bookingSystem.createBooking(customerName, ticketId);
            res.status(201).json(booking);
        } catch (error) {
            res.status(500).json({ message: 'Error creating booking', error });
        }
    };


    deleteBooking = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const booking = await this.bookingSystem.getBookingById(id);
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            await this.bookingSystem.deleteBooking(id);

            if (booking.getTickets().length > 0) {
                const tickets = booking.getTickets();
                for (const ticket of tickets) {
                    ticket.unbook();
                }
            }
            res.status(204).json({ message: 'Booking deleted successfully' });

        } catch (error) {
            res.status(500).json({ message: 'Error deleting booking', error });
        }
    };
    
} 