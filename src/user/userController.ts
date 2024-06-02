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
    res.status(201).json({
      accessToken: token,
    });
  } catch (err) {
    return next(createHttpError(500, "Error while signing jwt token"));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  //validation
  if (!email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }

  //check user present in database
  let user;
  try {
    user = await userModel.findOne({ email });

    if (!user) {
      return next(createHttpError(404, "User not found."));
    }
  } catch (err) {
    return next(createHttpError(500, "Error while getting user"));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(createHttpError(400, "username and password incorrect"));
  }

  //create accesstoken
  try {
    const token = sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });

    res.json({
      accessToken: token,
    });
  } catch (err) {
    return next(createHttpError(500, "Error while signing the jwt token"));
  }
};

export { createUser, loginUser };
