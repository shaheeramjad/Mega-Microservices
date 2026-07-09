import express from 'express';
import {json} from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import {signinRouter} from './routes/signin';
const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.use(signinRouter);


app.listen(3000, () => {
  console.log('Server is running on port 3000!!!');
});