import { Ticket } from '../models/Ticket';
import { TicketType } from '../enums/TicketType';
import { ITicket } from '../interfaces/ITicket';
import { TicketModel } from '../models/schemas/TicketSchema';

interface TicketPrices {
    VIP: number;
    REGULAR: number;
    ECONOMY: number;
}

export class TicketService {
    async getAvailableTickets(): Promise<ITicket[]> {
        const tickets = await TicketModel.find({ isBooked: false });
        return tickets.map(ticket => new Ticket(ticket.ticketId, ticket.type as TicketType, ticket.price));
    }

    async getAllTickets(): Promise<ITicket[]> {
        const tickets = await TicketModel.find();
        return tickets.map(ticket => new Ticket(ticket.ticketId, ticket.type as TicketType, ticket.price));
    }

    async createTickets(
        rows: number, 
        columns: number, 
        vipRows: number, 
        regularRows: number,
        prices: TicketPrices
    ): Promise<Ticket[]> {
        try {
            const tickets: Ticket[] = [];
            let currentRow = 1;

            currentRow = await this.createTicketsByType(
                TicketType.VIP, 
                currentRow, 
                vipRows, 
                columns, 
                tickets, 
                prices.VIP 
            );
            
            currentRow = await this.createTicketsByType(
                TicketType.REGULAR, 
                currentRow, 
                regularRows, 
                columns, 
                tickets, 
                prices.REGULAR
            );
            
            const economyRows = rows - vipRows - regularRows;
            await this.createTicketsByType(
                TicketType.ECONOMY, 
                currentRow, 
                economyRows, 
                columns, 
                tickets, 
                prices.ECONOMY
            );

            return tickets;
        } catch (error) {
            console.error('TicketService Error:', error);
            throw error;
        }
    }

    private async createTicketsByType(
        type: TicketType, 
        startRow: number, 
        numRows: number, 
        columns: number, 
        tickets: Ticket[],
        price: number
    ): Promise<number> {
        for (let row = startRow; row < startRow + numRows; row++) {
            for (let col = 1; col <= columns; col++) {
                const ticketId = `T${row.toString().padStart(2, '0')}${col.toString().padStart(2, '0')}`;
                const ticket = await TicketModel.create({
                    ticketId,
                    type,
                    price,
                    isBooked: false
                });
                tickets.push(new Ticket(ticket.ticketId, ticket.type as TicketType, price));
            }
        }
        return startRow + numRows;
    }
} 