const express = require("express");
const { landingPage, detailPage, getCategories } = require("./controller");
const router = express.Router();

/* METHOD url listining */
router.get("/landing", landingPage);
router.get("/detail/:id", detailPage);
router.get("/categories", getCategories);

module.exports = router;
