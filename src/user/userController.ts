import { create } from "domain";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  //validation

  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  //check if user already exist in database or not
  const user = await userModel.findOne({ email });

  if (user) {
    const error = createHttpError(400, "user already exists with this email.");
    return next(error);
  }
  //process
  //response

  res.json({
    message: "User Registered",
  });
};

export { createUser };
