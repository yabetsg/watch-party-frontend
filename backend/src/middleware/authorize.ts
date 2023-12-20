import Jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  token?: string;
}

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
        res.json({
          data,
        });
      }
    });
    next();
  } else {
    res.sendStatus(403);
  }
};
