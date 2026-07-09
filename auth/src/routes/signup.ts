import express, {Request, Response} from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.post("/api/users/signup", [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters')
], (req: Request, res: Response) => {      
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  const { email, password } = req.body;

  if(!email || typeof email !== 'string') {
    return res.status(400).send({ error: 'Provide a valid email' });
  }

  if(!password || typeof password !== 'string') {
    return res.status(400).send({ error: 'Provide a valid password' });
  }

  res.send({});
});

export { router as signupRouter };