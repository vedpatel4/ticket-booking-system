import { Router } from 'express';
import { BookingController } from '../controllers/BookingController';

const router = Router();
const bookingController = new BookingController();

// GET all bookings
router.get('/', bookingController.getAllBookings);

// GET booking by ID
router.get('/:id', bookingController.getBookingById);

// POST create new booking
router.post('/', bookingController.createBooking);

// DELETE booking by ID
router.delete('/:id', bookingController.deleteBooking);

export const bookingRoutes = router; 