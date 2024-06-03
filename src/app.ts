import express, { Request, Response, NextFunction } from "express";
import createHttpError, { HttpError } from "http-errors";
import { config } from "./config/config";
import globalErrorHandler from "./middleware/globalErrorHandler";
import userRouter from "./user/userRoutes";
import bookRouter from "./book/bookRouter";
import cors from "cors";
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: config.frontentDomain,
  })
);

//routes
app.get("/", (req, res, next) => {
  res.json({
    message: "Welcome to Ebook Apis",
  });

  // const error = createHttpError(400, "something went wrong");
  // throw error;
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

//global error handler   -> it should be in the last

app.use(globalErrorHandler);

export default app;
