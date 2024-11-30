import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import brainstormRoutes from './routes/ai/brainstorm';

const app = express();
const port = process.env.PORT || 3015;

app.use(cors());
app.use(express.json());

// Debug logging
console.log('Initializing server...');

// Health check endpoint
app.get('/health', (_: Request, res: Response) => {
  res.status(200).send('OK');
  console.log('Health check endpoint called');
});

// AI routes
console.log('Mounting brainstorm routes...');
app.use('/v1/ai/brainstorm', brainstormRoutes);
console.log('Brainstorm routes mounted at /v1/ai/brainstorm');

app.listen(port, () => {
  console.log(`AI backend server running on port ${port}`);
});