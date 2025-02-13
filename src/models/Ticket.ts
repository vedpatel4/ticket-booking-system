import { TicketType } from '../enums/TicketType';
import { ITicket } from '../interfaces/ITicket';

export class Ticket implements ITicket {
    private id: string;
    private type: TicketType;
    private price: number;
    private isBooked: boolean;

    constructor(id: string, type: TicketType, price: number) {
        this.id = id;
        this.type = type;
        this.price = price;
        this.isBooked = false;
    }

    getId(): string {
        return this.id;
    }

    getType(): TicketType {
        return this.type;
    }

    getPrice(): number {
        return this.price;
    }

    isAvailable(): boolean {
        return !this.isBooked;
    }

    book(): boolean {
        if (!this.isBooked) {
            this.isBooked = true;
            return true;
        }
        return false;
    }

    unbook(): boolean {
        if (this.isBooked) {
            this.isBooked = false;
            return true;
        }
        return false;
    }
} 