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

    createTickets = async (req: Request, res: Response) => {
        try {
            const { rows, columns, vipRows = 0, regularRows = 0 } = req.body;
            
            if (!rows || !columns) {
                return res.status(400).json({ 
                    message: 'Both rows and columns are required' 
                });
            }

            if (rows <= 0 || columns <= 0) {
                return res.status(400).json({ 
                    message: 'Rows and columns must be positive numbers' 
                });
            }

            const tickets = await this.bookingSystem.createTickets(rows, columns, vipRows, regularRows);
            res.status(201).json(tickets);
        } catch (error) {
            console.error('Controller Error:', error);
            res.status(500).json({ 
                message: 'Error creating tickets',
                error: (error as Error).message
            });
        }
    };
} 