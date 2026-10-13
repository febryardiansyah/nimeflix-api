import { Router } from "express";
import * as MainController from "../controllers/main.controller";

const router = Router();

router.get("/home", MainController.home);
router.get("/complete", MainController.completeAnimeList);
router.get("/complete/page/:page", MainController.completeAnimeList);
router.get("/ongoing/page/:page", MainController.onGoingAnimeList);
router.get("/schedule", MainController.schedule);
router.get("/genres", MainController.genre);
router.get("/genres/:id/page/:pageNumber", MainController.animeByGenre);
router.get("/search/:query", MainController.search);

export default router;
