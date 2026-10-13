import { Router } from "express";
import * as AnimeController from "../controllers/anime.controller";

const router = Router();

router.get("/anime/:id", AnimeController.detailAnime);
router.get("/batch/:id", AnimeController.batchAnime);
router.get("/eps/:id", AnimeController.epsAnime);
router.post("/eps/:animeId/mirror/", AnimeController.epsMirror);

export default router;
