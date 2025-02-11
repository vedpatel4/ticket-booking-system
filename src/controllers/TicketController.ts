import { Request, Response } from 'express';
import { BookingSystem } from '../services/BookingSystem';

export class TicketController {
    private bookingSystem: BookingSystem;

    constructor() {
        this.bookingSystem = new BookingSystem();
    }

    getAvailableTickets = async (req: Request, res: Response) => {
        try {
            const tickets = await this.bookingSystem.getAvailableTickets();
            res.status(200).json(tickets);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching available tickets', error });
        }
    };

    getAllTickets = async (req: Request, res: Response) => {
        try {
            const tickets = await this.bookingSystem.getAllTickets();
            res.status(200).json(tickets);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching tickets', error });
        }
    };

    createTicket = async (req: Request, res: Response) => {
        try {
            const { type, price } = req.body;
            if (!type || !price) {
                return res.status(400).json({ message: 'Type and price are required' });
            }
            const ticket = await this.bookingSystem.createTicket(type, price);
            res.status(201).json(ticket);
        } catch (error) {
            res.status(500).json({ message: 'Error creating ticket' });
        }
    };
} 