import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://ved:vedPassword@authcluster0.onzgp.mongodb.net/');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}; 