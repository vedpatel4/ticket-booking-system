import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import { bookingRoutes } from './routes/bookingRoutes';
import { ticketRoutes } from './routes/ticketRoutes';
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');


const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/tickets', ticketRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 