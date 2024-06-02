import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface authRequest extends Request {
  userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  if (!token) {
    return next(createHttpError(401, "Authorization token is required"));
  }

  const parsedToken = token.split(" ")[1];

  try {
    const decoded = verify(parsedToken, config.jwtSecret as string);

    //   console.log("decoded", decoded);
    const _req = req as authRequest;
    _req.userId = decoded.sub as string;

    next();
  } catch (err) {
    return next(createHttpError(401, "Token Expired."));
  }
};

export default authenticate;
