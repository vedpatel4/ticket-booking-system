import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    bookingId: {
        type: String,
        required: true,
        unique: true
    },
    customerName: {
        type: String,
        required: true
    },
    tickets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }],
    totalAmount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

export const BookingModel = mongoose.model('Booking', bookingSchema); 