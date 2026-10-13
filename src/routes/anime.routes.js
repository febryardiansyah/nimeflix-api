const express = require("express");
const router = express.Router();
const AnimeController = require("../controllers/anime.controller");

router.get("/anime/:id", AnimeController.detailAnime);
router.get("/batch/:id", AnimeController.batchAnime);
router.get("/eps/:id", AnimeController.epsAnime);
router.post("/eps/:animeId/mirror/", AnimeController.epsMirror);

module.exports = router;
