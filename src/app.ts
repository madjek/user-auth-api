import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { initializeDatabase } from './config/database';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { setupSwagger } from './swagger';
import { errorHandler } from './middlewares/error';

export const createApp = async () => {
  await initializeDatabase();

  const app = express();

  // Middleware
  app.use(cors());
  app.use(helmet());
  app.use(morgan('combined'));
  app.use(express.json());

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);

  // Swagger
  setupSwagger(app);

  // Error handling
  app.use(errorHandler);

  return app;
};
