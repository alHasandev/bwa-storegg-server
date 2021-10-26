const path = require("path");
const fs = require("fs");
const config = require("../../config");

const Voucher = require("./model");
const Category = require("../category/model");
const Nominal = require("../nominal/model");

function uploadImage(dir, file, cb) {
  try {
    console.log("Upload Image!");
    let tmp_path = file.path;
    let fileNames = file.originalname.split(".");
    let originalExt = fileNames[fileNames.length - 1];
    let filename = file.filename + "." + originalExt;
    let target_path = path.resolve(config.rootPath, `${dir}/${filename}`);

    const src = fs.createReadStream(tmp_path);
    const dest = fs.createWriteStream(target_path);

    src.pipe(dest);
    if (typeof cb === "function") {
      src.on("end", () => cb(filename));
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  index: async (req, res) => {
    try {
      const alert = {
        message: req.flash("alertMessage"),
        status: req.flash("alertStatus"),
      };

      console.log("alert", alert);

      const vouchers = await Voucher.find()
        .populate("category")
        .populate("nominals");

      res.render("admin/voucher/view_voucher", {
        vouchers: vouchers,
        alert,
      });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "warning");
      res.redirect("/voucher");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const categories = await Category.find();
      const nominals = await Nominal.find();
      res.render("admin/voucher/create", { categories, nominals });
    } catch (err) {
      console.log(err);
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name, category, nominals } = req.body;

      const voucher = new Voucher({
        name,
        category,
        nominals,
      });

      if (req.file) {
        uploadImage("public/uploads", req.file, async (filename) => {
          console.log("Uploaded Gambar");
          voucher.thumbnail = filename;
          await voucher.save();

          console.log(voucher);

          res.redirect("/voucher");
        });
      } else {
        console.log("Tanpa Gambar");
        await voucher.save();

        console.log(voucher);

        res.redirect("/voucher");
      }

      const { name: categoryName } = await Category.findOne({
        _id: category,
      });
      req.flash(
        "alertMessage",
        `Berhasil tambah voucher: Game ${categoryName}: ${name}`
      );
      req.flash("alertStatus", "success");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const voucher = await Voucher.findOne({ _id: req.params.id });
      const categories = await Category.find();
      const nominals = await Nominal.find();

      console.log(voucher);
      res.render("admin/voucher/edit", { voucher, categories, nominals });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "warning");
      res.redirect("/voucher");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { name, category, nominals } = req.body;
      const voucher = await Voucher.findOne({ _id: req.params.id });
      const { name: categoryName } = await Category.findOne({
        _id: category,
      });
      voucher.name = name;
      voucher.category = category;
      voucher.nominals = nominals;

      if (req.file) {
        uploadImage("public/uploads", req.file, async (filename) => {
          // delete existing image
          let currentImg = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;
          if (fs.existsSync(currentImg)) {
            fs.unlinkSync(currentImg);
          }

          voucher.thumbnail = filename;
          await voucher.save();

          req.flash(
            "alertMessage",
            `Berhasil ubah voucher: Game ${categoryName}: ${name}`
          );
          req.flash("alertStatus", "success");

          res.redirect("/voucher");
        });
      } else {
        await voucher.save();

        req.flash(
          "alertMessage",
          `Berhasil ubah voucher: Game ${categoryName}: ${name}`
        );
        req.flash("alertStatus", "success");

        res.redirect("/voucher");
      }
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const condition = { _id: req.params.id };
      const voucher = await Voucher.findOne(condition);
      // delete existing image
      let currentImg = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;
      if (fs.existsSync(currentImg)) {
        fs.unlinkSync(currentImg);
      }
      result = await Voucher.deleteOne(condition);
      req.flash("alertMessage", `Berhasil hapus voucher`);
      req.flash("alertStatus", `success`);

      res.redirect("/voucher");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
};
