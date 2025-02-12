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
            const { rows, columns, vipRows, regularRows, prices } = req.body;
            
            if (!rows || !columns || !prices) {
                return res.status(400).json({ 
                    message: 'Rows, columns, and prices are required' 
                });
            }

            if (!prices.VIP || !prices.REGULAR || !prices.ECONOMY) {
                return res.status(400).json({ 
                    message: 'Prices must be specified for all ticket types (VIP, REGULAR, ECONOMY)' 
                });
            }

            if (rows <= 0 || columns <= 0) {
                return res.status(400).json({ 
                    message: 'Rows and columns must be positive numbers' 
                });
            }

            const tickets = await this.bookingSystem.createTickets(
                rows, 
                columns, 
                vipRows || 0, 
                regularRows || 0,
                prices
            );
            
            res.status(201).json(tickets);
        } catch (error) {
            res.status(500).json({ message: 'Error creating tickets', error });
        }
    };
} 