const express = require("express");
const { index } = require("./controller");
const router = express.Router();

/* GET users listing. */
router.get("/", index);

module.exports = router;
