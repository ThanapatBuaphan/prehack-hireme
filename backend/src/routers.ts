import { Router } from "express";
import authRoutes from "./routes/auth.routes";
import userRouter from "./modules/Profile/routers/user.router";
import companyRouter from "./modules/Profile/routers/company.router";

const mainRouter = Router();

mainRouter.use("/auth", authRoutes);
mainRouter.use("/api/user", userRouter);
mainRouter.use("/api/company", companyRouter);

export default mainRouter;
