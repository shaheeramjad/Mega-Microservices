import express from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { validateRequest } from "../middlewares/validate-request";
import { BadRequestError } from "../errors/bad-request-error";
import { User } from "../models/users";
import { Password } from "../services/password";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email")
      .isEmail()
      .withMessage("Please provide a valid email")
      .normalizeEmail(),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Please provide a valid password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }
    const passwordsMatch = await Password.toCompare(
      existingUser.password,
      password,
    );
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    const userJwt = jwt.sign(
      {
        id: existingUser._id.toString(),
        email: existingUser.email,
      },
      process.env.JWT_KEY!,
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  },
);

export { router as signinRouter };
