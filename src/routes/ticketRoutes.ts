import { Router } from 'express';
import { TicketController } from '../controllers/TicketController';

const router = Router();
const ticketController = new TicketController();

// Create a new ticket
router.post('/', ticketController.createTicket);

// GET all available tickets
router.get('/available', ticketController.getAvailableTickets);

// GET all tickets
router.get('/', ticketController.getAllTickets);

export const ticketRoutes = router; 