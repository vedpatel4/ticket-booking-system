import { Request, Response } from 'express';
import { BookingSystem } from '../services/BookingSystem';
import { TicketType } from '../enums/TicketType';

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
            const { type } = req.body;
            if (!type) {
                return res.status(400).json({ message: 'Ticket type is required' });
            }
            
            if (!Object.values(TicketType).includes(type)) {
                return res.status(400).json({ 
                    message: `Invalid ticket type. Must be one of: ${Object.values(TicketType).join(', ')}`
                });
            }

            const ticket = await this.bookingSystem.createTicket(type);
            res.status(201).json(ticket);
        } catch (error) {
            console.error('Controller Error:', error);
            res.status(500).json({ 
                message: 'Error creating ticket',
                error: (error as Error).message
            });
        }
    };
} 