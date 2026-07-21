import express from 'express';
import {json} from 'body-parser';
import cookieSession from 'cookie-session';
import {errorHandler, NotFoundError} from '@shaheertickets/common';
import { currentUserRouter } from './routes/current-user';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import {signinRouter} from './routes/signin';
const app = express();
app.set('trust proxy', true);
app.use(json());

app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.use(signinRouter);

app.all('/{*splat}', async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };