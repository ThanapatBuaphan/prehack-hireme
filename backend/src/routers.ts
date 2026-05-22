import { Router } from "express";
import applyRouter from "./modules/easyApplication/routers/easyApplication.router";

const mainRouter = Router();

mainRouter.use("/applies", applyRouter);

export default mainRouter;