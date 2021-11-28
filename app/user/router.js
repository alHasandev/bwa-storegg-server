const express = require("express");
const { viewSignIn, actionSignIn, actionLogout } = require("./controller");
const { isNotLoginAdmin } = require("../middleware/auth");
const router = express.Router();

/* METHOD url listining */
router.get("/", isNotLoginAdmin, viewSignIn);
router.post("/", actionSignIn);
router.get("/logout", actionLogout);

module.exports = router;
