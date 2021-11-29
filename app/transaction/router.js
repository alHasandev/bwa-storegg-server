const express = require("express");
const { index, actionStatus } = require("./controller");
const router = express.Router();
const { isLoginAdmin } = require("../middleware/auth");

// Use middleware
router.use(isLoginAdmin);

/* METHOD url listining */
router.get("/", index);
router.patch("/status/:id", actionStatus);

module.exports = router;
