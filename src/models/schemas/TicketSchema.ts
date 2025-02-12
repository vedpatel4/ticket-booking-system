import mongoose from 'mongoose';
import { TicketType } from '../../enums/TicketType';
import { TICKET_PRICES } from '../../config/ticketPrices';

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
        required: true,
        default: 0
    },
    isBooked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Change to pre-validate middleware
ticketSchema.pre('validate', function(next) {
    this.price = TICKET_PRICES[this.type] || 0;
    next();
});

export const TicketModel = mongoose.model('Ticket', ticketSchema); 