import { Router } from 'express';
import { BookingController } from '../controllers/BookingController';

const router = Router();
const bookingController = new BookingController();

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     description: Retrieve all bookings from the database
 *     responses:
 *       200:
 *         description: A list of bookings
 *       500:
 *         description: Internal server error
 */
router.get('/', bookingController.getAllBookings);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     description: Retrieve a booking by its ID
 *     responses:
 *       200:
 *         description: A booking
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', bookingController.getBookingById);

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     description: Create a new booking
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       500:
 *         description: Internal server error
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerName:
 *                 type: string
 *                 description: The name of the customer
 *               ticketId:
 *                 type: string
 *                 description: The ID of the ticket to book    
 *             required:
 *               - customerName
 *               - ticketId
 *           example:
 *             customerName: John Doe
 *             ticketId: 1234567890
 */
router.post('/', bookingController.createBooking);


/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Delete a booking by ID
 *     description: Delete a booking by its ID
 *     responses:
 *       204:
 *         description: Booking deleted successfully
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', bookingController.deleteBooking);

export const bookingRoutes = router; 