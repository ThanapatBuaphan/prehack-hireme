import { Router } from "express";

import companyAcceptanceRouter from "./modules/companyAcceptance/routers/companyAcceptance.router";
import applyRouter, {
  jobPostRouter,
} from "./modules/easyApplication/routers/easyApplication.router";
import authRoutes from "./routes/auth.routes";
import userRouter from "./modules/Profile/routers/user.router";
import companyRouter from "./modules/Profile/routers/company.router";

const mainRouter = Router();

mainRouter.use("/company-acceptance", companyAcceptanceRouter);
mainRouter.use("/applies", applyRouter);
mainRouter.use("/posts", jobPostRouter);
mainRouter.use("/auth", authRoutes);
mainRouter.use("/api/user", userRouter);
mainRouter.use("/api/company", companyRouter);

export default mainRouter;
