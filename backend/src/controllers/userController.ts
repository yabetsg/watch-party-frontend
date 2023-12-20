import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { body, validationResult } from "express-validator";
import bycrypt from "bcrypt";
import Jwt from "jsonwebtoken";

export const create_user = [
  body("username", "First name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage("Password must be between 3 and 10 characters long")
    .escape(),
  body("confirm")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password confirmation must not be empty")
    .custom((input, { req }) => input === req.body.password)

    .withMessage("Passwords must match")
    .escape(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          body: req.body,
        });
      }
      const { username, password } = req.body;
      const user = await User.findOne({
        username: username,
      });
      if (user) {
        return res.status(400).json({
          errors: ["User with this userame already exists"],
        });
      } else {
        const hashedPass = await bycrypt.hash(password, 8);
        const newUser = new User({
          username,
          password: hashedPass,
        });
        await newUser.save();
        return res.status(201).json({ message: "User created successfully" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ errors: [err] });
    }
  },
];

export const login_user = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username }).exec();
    
    if (!user) {
      return res.status(400).json({ errors: ["user doesn't exist"] });
    } else {
      const encryptedPass = user.password;
      const isValid = await bycrypt.compare(password, encryptedPass);
      if (isValid) {
        Jwt.sign({ user: user }, process.env.SECRET_KEY as string, (err:{}|null, token:string | undefined) => {
            return res.status(200).json({
              message: "Authentication successful",
              status: "success",
              token: token,
            });
          });
      } else {
        return res.status(400).json({ errors: ["Incorrect password!"] });
      }
    }
  } catch (err) {
    return res.status(500).json({ errors: [err] });
  }
};
