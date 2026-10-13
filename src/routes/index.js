const express = require("express");
const router = express.Router();

router.use(require("./main.routes"));
router.use(require("./anime.routes"));

module.exports = router;
