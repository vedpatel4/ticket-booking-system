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

    createTickets = async (req: Request, res: Response) => {
        try {
            const { rows, columns, vipRows, regularRows } = req.body;
            
            // Validate input
            if (!rows || !columns || !vipRows || !regularRows) {
                return res.status(400).json({ 
                    message: 'Total rows, columns, VIP rows, and regular rows are required' 
                });
            }

            // Validate that rows add up correctly
            if (vipRows + regularRows > rows) {
                return res.status(400).json({ 
                    message: 'Sum of VIP and regular rows cannot exceed total rows' 
                });
            }

            const tickets = await this.bookingSystem.createTickets(
                rows, 
                columns, 
                vipRows, 
                regularRows
            );
            
            res.status(201).json(tickets);
        } catch (error) {
            res.status(500).json({ message: 'Error creating tickets', error });
        }
    };
} 