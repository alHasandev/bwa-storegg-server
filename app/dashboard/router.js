const express = require("express");
const { index } = require("./controller");
const router = express.Router();
const { isLoginAdmin } = require("../middleware/auth");

// Use middleware
router.use(isLoginAdmin);

/* GET users listing. */
router.get("/", index);

module.exports = router;
