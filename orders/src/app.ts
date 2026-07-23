import express from 'express';
import {json} from 'body-parser';
import cookieSession from 'cookie-session';
import {errorHandler, NotFoundError, currentUser} from '@shaheertickets/common';

import { newOrderRouter } from './routes/new.js';
import { showOrderRouter } from './routes/show.js';
import { indexOrderRouter } from './routes/index.js';
import { deleteOrderRouter } from './routes/delete.js';

const app = express();
app.set('trust proxy', true);
app.use(json());

app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUser);

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.all('/{*splat}', async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
