import mongoose from 'mongoose';
import config from '../config/index.js';


export default async function connectDB() {
const uri = config.mongoUri;
if (!uri) throw new Error('MONGO_URI not set');
await mongoose.connect(uri);
console.log('MongoDB connected');
}