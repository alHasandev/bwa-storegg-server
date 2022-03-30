const express = require("express");
const multer = require("multer");
const os = require("os");
const { signup, signin } = require("./controller");
const router = express.Router();

/* METHOD url listining */
router.post("/signup", multer({ dest: os.tmpdir() }).single("avatar"), signup);
router.post("/signin", signin);

module.exports = router;
