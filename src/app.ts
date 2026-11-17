import express, { Application, Request, Response } from "express";
import { authRouter } from "./app/modules/auth/auth.route";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config";

const app: Application = express();

//middleware
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Dukan Pulse API is running");
});

//routes
app.use("/api/v1/auth", authRouter);

export default app;
