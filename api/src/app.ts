import 'reflect-metadata';
import './core/utils/module-alias';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import v1 from '@/routes/v1';
import { AppController } from '@/controllers/app.controller';
import { actionDispatch } from '@/core/utils/action-dispatcher';
import errorHandler from '@/core/exceptions/errorHandler';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 5 * 1024 * 1024 },
    useTempFiles: false,
  })
);

app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

app.use('/api/v1', v1);
app.use('/', actionDispatch(new AppController().index));

app.use(errorHandler);

export default app;
