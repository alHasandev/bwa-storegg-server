const Nominal = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alert = {
        message: req.flash("alertMessage"),
        status: req.flash("alertStatus"),
      };

      console.log("alert", alert);

      const nominals = await Nominal.find();
      res.render("admin/nominal/view_nominal", {
        nominals,
        alert,
        user: req.session.user,
      });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "warning");
      res.redirect("/nominal");
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/nominal/create", { user: req.session.user });
    } catch (err) {
      console.log(err);
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { coinQuantity, coinName, price } = req.body;
      const nominal = await Nominal.create({ coinQuantity, coinName, price });
      console.log(nominal);
      req.flash(
        "alertMessage",
        `Berhasil tambah nominal: ${coinName} x${coinQuantity}`
      );
      req.flash("alertStatus", "success");

      res.redirect("/nominal");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const nominal = await Nominal.findOne({ _id: req.params.id });
      console.log(nominal);

      res.render("admin/nominal/edit", { nominal, user: req.session.user });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "warning");
      res.redirect("/nominal");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { coinQuantity, coinName, price } = req.body;
      const nominal = await Nominal.findOne({ _id: req.params.id });
      const prev = {
        coinQuantity: nominal.coinQuantity,
        coinName: nominal.coinName,
        price: nominal.price,
      };

      nominal.coinQuantity = coinQuantity;
      nominal.coinName = coinName;
      nominal.price = price;
      await nominal.save();

      console.log("edit", nominal);
      req.flash(
        "alertMessage",
        `Berhasil edit nominal: ${prev.coinName} x${prev.coinQuantity} ⇒ ${coinName} x${coinQuantity}`
      );
      req.flash("alertStatus", "success");

      res.redirect("/nominal");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const result = await Nominal.deleteOne({ _id: req.params.id });
      console.log("delete", result);
      req.flash("alertMessage", `Berhasil hapus nominal`);
      req.flash("alertStatus", `success`);

      res.redirect("/nominal");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },
};
