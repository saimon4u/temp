import express from 'express';
import {connectDB} from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';

import dotenv from 'dotenv';
dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});