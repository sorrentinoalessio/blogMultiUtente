import express from 'express';
import { PostRoutes } from './PostRoutes.js';
import { UserRoutes } from './UserRoutes.js';

const router = express.Router();

export const  registerRoutes = (app) => {
  new UserRoutes(router);
  new PostRoutes(router);
  app.use('/', router);
}
