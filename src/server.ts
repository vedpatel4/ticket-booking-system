import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import { bookingRoutes } from './routes/bookingRoutes';
import { ticketRoutes } from './routes/ticketRoutes';
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const rateLimiter = require('./middleware/rateLimiter')
import { connectRedis } from './config/redisClient';
// import redisLimiter from './middleware/redisLimiter';



// const cluster = require('cluster');
// const numCPUs = require('os').cpus().length;
// const process = require('process');

// if (cluster.isPrimary) {
//     console.log(`Master ${process.pid} is running`);
//     for (let i = 0; i < numCPUs; i++) {
//         cluster.fork();
//     }
// }
// else {
connectRedis();
const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bookings', rateLimiter, bookingRoutes);
app.use('/api/tickets', rateLimiter, ticketRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// }