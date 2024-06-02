import express, { Request, Response, NextFunction } from "express";
import createHttpError, { HttpError } from "http-errors";
import { config } from "./config/config";
import globalErrorHandler from "./middleware/globalErrorHandler";
import userRouter from "./user/userRoutes";

const app = express();

//routes

app.get("/", (req, res, next) => {
  res.json({
    message: "Welcome to Ebook Apis",
  });

  // const error = createHttpError(400, "something went wrong");
  // throw error;
});

app.use("/api/users", userRouter);

//global error handler   -> it should be in the last

app.use(globalErrorHandler);

export default app;
