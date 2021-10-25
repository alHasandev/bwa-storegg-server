const express = require("express");
const {
  index,
  viewCreate,
  actionCreate,
  actionDelete,
  viewEdit,
  actionEdit,
} = require("./controller");
const router = express.Router();

/* METHOD url listining */
router.get("/", index);

router.get("/create", viewCreate);
router.post("/create", actionCreate);

router.get("/edit/:id", viewEdit);
router.put("/edit/:id", actionEdit);

router.delete("/delete/:id", actionDelete);

module.exports = router;
