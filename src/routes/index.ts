import { Router } from "express";
import mainRoutes from "./main.routes";
import animeRoutes from "./anime.routes";

const router = Router();

router.use(mainRoutes);
router.use(animeRoutes);

export default router;
