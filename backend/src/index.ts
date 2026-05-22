import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import mainRouter from "./routers";
import { errorHandler } from "./middlewares/error_handler";
 
const app = express();
const PORT = process.env.PORT ?? 3000;
 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.ALLOW_ORIGIN!,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  })
);
 
app.use("", mainRouter);
 
app.use(errorHandler);
 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});