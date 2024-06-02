import express from "express";
import { createBook } from "./bookController";
const bookRouter = express();

//Routes
bookRouter.post("/", createBook);

export default bookRouter;
