const express = require("express");
const multer = require("multer");
const os = require("os");

const {
  index,
  viewCreate,
  actionCreate,
  actionDelete,
  viewEdit,
  actionEdit,
  actionStatus,
} = require("./controller");
const router = express.Router();
const { isLoginAdmin } = require("../middleware/auth");

// Use middleware
router.use(isLoginAdmin);

/* METHOD url listining */
router.get("/", index);

router.get("/create", viewCreate);
router.post(
  "/create",
  multer({ dest: os.tmpdir() }).single("thumbnail"),
  actionCreate
);

router.get("/edit/:id", viewEdit);
router.put(
  "/edit/:id",
  multer({ dest: os.tmpdir() }).single("thumbnail"),
  actionEdit
);

router.delete("/delete/:id", actionDelete);
router.patch("/status/:id", actionStatus);

module.exports = router;
