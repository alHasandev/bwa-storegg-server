const Category = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alert = {
        message: req.flash("alertMessage"),
        status: req.flash("alertStatus"),
      };

      console.log("alert", alert);

      const categories = await Category.find();
      res.render("admin/category/view_category", {
        categories,
        alert,
        user: req.session.user,
      });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "warning");
      res.redirect("/category");
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/category/create", { user: req.session.user });
    } catch (err) {
      console.log(err);
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name } = req.body;
      const category = await Category.create({ name });
      console.log(category);
      req.flash("alertMessage", `Berhasil tambah kategori: ${name}`);
      req.flash("alertStatus", "success");

      res.redirect("/category");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const category = await Category.findOne({ _id: req.params.id });
      console.log(category);

      res.render("admin/category/edit", { category, user: req.session.user });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "warning");
      res.redirect("/category");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { name } = req.body;
      const category = await Category.findOne({ _id: req.params.id });
      const prevName = category.name;
      category.name = name;
      await category.save();

      console.log("edit", category);
      req.flash(
        "alertMessage",
        `Berhasil edit kategori: ${prevName} ⇒ ${name}`
      );
      req.flash("alertStatus", "success");

      res.redirect("/category");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const result = await Category.deleteOne({ _id: req.params.id });
      console.log("delete", result);
      req.flash("alertMessage", `Berhasil hapus kategori`);
      req.flash("alertStatus", `success`);

      res.redirect("/category");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  },
};
