import { Router } from "express";
import applyRouter from "./modules/example/routers/apply.router";

const mainRouter = Router();

mainRouter.use("/applies", applyRouter);

export default mainRouter;