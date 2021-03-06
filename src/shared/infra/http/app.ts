import 'reflect-metadata';
import 'dotenv/config';
import { errors } from 'celebrate';
import express, { Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerFile from '../../../swagger.json';

import 'express-async-errors';

import AppError from '../../errors/AppError';
import '../typeorm';
import '../../container';
import routes from './routes';

const app = express();
app.use(express.json());
app.use(routes);
app.use(errors());
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    console.log(`Error: ${error}`);

    return response.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
);

export default app;
