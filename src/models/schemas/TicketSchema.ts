import mongoose from 'mongoose';
import { TicketType } from '../../enums/TicketType';

const ticketSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true,
        enum: Object.values(TicketType)
    },
    price: {
        type: Number,
        required: true
    },
    isBooked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export const TicketModel = mongoose.model('Ticket', ticketSchema); 