import { TicketType } from '../enums/TicketType';

export interface ITicket {
    getId(): string;
    getType(): TicketType;
    getPrice(): number;
    isAvailable(): boolean;
    book(): boolean;
}