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
            const { rows, columns, vipRows, regularRows, prices } = req.body;
            
            if (!rows || !columns || !vipRows || !regularRows || !prices) {
                return res.status(400).json({ 
                    message: 'Rows, columns, vipRows, regularRows, and prices are required' 
                });
            }

            if (!prices.VIP || !prices.REGULAR || !prices.ECONOMY) {
                return res.status(400).json({ 
                    message: 'Prices must be specified for all ticket types (VIP, REGULAR, ECONOMY)' 
                });
            }

            if (rows <= 0 || columns <= 0 || vipRows < 0 || regularRows < 0) {
                return res.status(400).json({ 
                    message: 'Row and column values must be positive numbers' 
                });
            }

            if (vipRows + regularRows > rows) {
                return res.status(400).json({
                    message: 'Sum of VIP and regular rows cannot exceed total rows'
                });
            }

            const tickets = await this.bookingSystem.createTickets(
                rows, 
                columns, 
                vipRows, 
                regularRows,
                prices
            );
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