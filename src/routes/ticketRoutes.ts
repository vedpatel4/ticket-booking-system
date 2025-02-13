import { Router } from 'express';
import { TicketController } from '../controllers/TicketController';

const router = Router();
const ticketController = new TicketController();

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Create tickets based on layout
 *     description: Create tickets based on layout
 *     responses:
 *       400:
 *         description: Bad request
 *       201:
 *         description: Tickets created successfully
 *       500:
 *         description: Internal server error
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:  
 *               rows:
 *                 type: number
 *                 description: The number of rows in the layout
 *                 default: 10
 *               columns:
 *                 type: number
 *                 description: The number of columns in the layout
 *                 default: 10
 *               vipRows:
 *                 type: number
 *                 description: The number of vip rows in the layout
 *                 default: 2
 *               regularRows:
 *                 type: number
 *                 description: The number of regular rows in the layout
 *                 default: 4
 *               prices:
 *                 type: object
 *                 description: The prices for each ticket type
 *                 default: 
 *                   VIP: 100
 *                   REGULAR: 50
 *                   ECONOMY: 25
 *                 properties:
 *                   VIP:
 *                     type: number
 *                     description: The price for a vip ticket
 *                     default: 100
 *                   REGULAR:
 *                     type: number
 *                     description: The price for a regular ticket
 *                     default: 50
 *                   ECONOMY:
 *                     type: number
 *                     description: The price for an economy ticket
 *                     default: 25
 *             required:
 *               - rows
 *               - columns
 *               - vipRows
 *               - regularRows
 *               - prices
 *           example:
 *             rows: 10
 *             columns: 10
 *             vipRows: 2
 *             regularRows: 4
 *             prices:
 *               VIP: 100
 *               REGULAR: 50
 *               ECONOMY: 25
 */
router.post('/', ticketController.createTickets);

/**
 * @swagger
 * /tickets/available:
 *   get:
 *     summary: Get all available tickets
 *     description: Retrieve all available tickets from the database
 *     responses:
 *       200:
 *         description: A list of available tickets
 *       500:
 */
router.get('/available', ticketController.getAvailableTickets);

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Get all tickets
 *     description: Retrieve all tickets from the database
 *     responses:
 *       200:
 *         description: A list of tickets
 *       500:
 *         description: Internal server error
 */
router.get('/', ticketController.getAllTickets);

export const ticketRoutes = router;