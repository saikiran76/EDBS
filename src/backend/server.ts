import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import brainstormRoutes from './routes/ai/brainstorm';

const app = express();
const port = process.env.PORT || 3015;
const host = '0.0.0.0';

app.use(cors({
    origin: ['http://localhost:3000', process.env.FRONTEND_URL || 'https://your-vercel-app.vercel.app'],
    methods: ['POST', 'OPTIONS'],
    credentials: true
  }));
app.use(express.json());

console.log('Initializing server...');

app.get('/health', (_: Request, res: Response) => {
  res.status(200).send('OK');
  console.log('Health check endpoint called');
});

console.log('Mounting brainstorm routes...');
app.use('/v1/ai/brainstorm', brainstormRoutes);
console.log('Brainstorm routes mounted at /v1/ai/brainstorm');

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on http://${host}:${port}`);
  });
}

export default app;