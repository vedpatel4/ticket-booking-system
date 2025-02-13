import { Router } from 'express';
import { TicketController } from '../controllers/TicketController';

const router = Router();
const ticketController = new TicketController();

// Create tickets based on layout
router.post('/', ticketController.createTickets);

// GET all available tickets
router.get('/available', ticketController.getAvailableTickets);

// GET all tickets
router.get('/', ticketController.getAllTickets);

// Create a single ticket
router.post('/', ticketController.createTicket);

export const ticketRoutes = router; 