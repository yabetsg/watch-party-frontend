import Jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { CustomRequest } from "../types";

export const authorize = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers["authorization"];
  if (header) {
    const bearer = header.split(" ");
    const token = bearer[1];
    req.token = token;
    Jwt.verify(token, process.env.SECRET_KEY as string, (err, data) => {
      if (err) {
        res.sendStatus(401);
      } else {
        req.user = data;
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
};
