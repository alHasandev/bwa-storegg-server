const express = require("express");
const { landingPage, detailPage } = require("./controller");
const router = express.Router();

/* METHOD url listining */
router.get("/landing", landingPage);
router.get("/detail/:id", detailPage);

module.exports = router;
