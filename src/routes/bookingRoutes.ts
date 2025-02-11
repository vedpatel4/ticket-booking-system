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


export const bookingRoutes = router; 