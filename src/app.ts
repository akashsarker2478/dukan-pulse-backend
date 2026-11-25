import express, { Application, Request, Response } from "express";
import { authRouter } from "./app/modules/auth/auth.route";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config";
import { notFound } from "./app/middlewares/notFound";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { adminRoutes } from "./app/modules/admin/admin.route";
import { storeRoutes } from "./app/modules/store/store.route";
import { categoryRoutes } from "./app/modules/category/category.route";
import { productRoutes } from "./app/modules/product/product.route";

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
app.use("/api/v1/admin",adminRoutes);
app.use("/api/v1/stores",storeRoutes)
app.use("/api/v1/stores/:storeId/categories", categoryRoutes);
app.use("/api/v1/stores/:storeId/products",productRoutes)

//not found middleware
app.use(notFound)
//global error handler middleware
app.use(globalErrorHandler)

export default app;
