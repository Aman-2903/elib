import { create } from "domain";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  //validation

  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  //check if user already exist in database or not
  try {
    const user = await userModel.findOne({ email });

    if (user) {
      const error = createHttpError(
        400,
        "user already exists with this email."
      );
      return next(error);
    }
  } catch (err) {
    return next(createHttpError(500, "Error while getting user"));
  }

  //after that we have to user into the database
  //for that we have to hashed password

  //   password ---> hash
  const hashedPassword = await bcrypt.hash(password, 10); //2nd parameter is no of salt round

  //add user to database
  let newUser: User;
  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (err) {
    return next(createHttpError(500, "Error while creating user"));
  }

  try {
    //Token generation JWT
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });

    //response
    res.json({
      accessToken: token,
    });
  } catch (err) {
    return next(createHttpError(500, "Error while signing jwt token"));
  }
};

export { createUser };
