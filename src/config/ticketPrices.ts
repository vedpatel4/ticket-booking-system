import { TicketType } from '../enums/TicketType';

export const TICKET_PRICES = {
    [TicketType.VIP]: 300,
    [TicketType.REGULAR]: 200,
    [TicketType.ECONOMY]: 100
} as const; 