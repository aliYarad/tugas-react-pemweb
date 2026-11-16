import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import { requestLogger } from './middleware/request-logger.js';
import productRouter from './routes/product.routes.js';

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(express.json());
app.use(requestLogger);
app.use('/products', productRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route tidak ditemukan' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const status = (err as Error & { status?: number }).status ?? 500;
  const message = status === 400 ? 'Body request bukan JSON yang valid' : 'Terjadi kesalahan pada server';
  res.status(status).json({ message });
});

export default app;
