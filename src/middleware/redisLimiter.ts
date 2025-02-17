// import { Request, Response, NextFunction } from "express";
// import redisClient from "../config/redisClient";

// async function redisLimiter(req: Request, res: Response, next: NextFunction) {
//     const MAX_REQUESTS = 2;
//     const IP_ADDRESS = req.ip;
//     const WINDOW_SIZE = 60; // 1 minute in seconds

//     try {
//         await redisClient.connect(); // Ensure the client is connected

//         const count = await redisClient.get();

//     }


// export default redisLimiter;