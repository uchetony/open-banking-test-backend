import express from 'express';
import cors from 'cors';
import protectedRoutes from './protectedRoutes';
import publicRoutes from './publicRoutes';
import { checkAuth } from './modules/auth';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', publicRoutes);
app.use('/api', checkAuth, protectedRoutes);

export default app;