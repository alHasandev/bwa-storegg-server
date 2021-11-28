const Payment = require("./model");
const Bank = require("../bank/model");

module.exports = {
  index: async (req, res) => {
    try {
      const alert = {
        message: req.flash("alertMessage"),
        status: req.flash("alertStatus"),
      };

      console.log("alert", alert);

      const payments = await Payment.find().populate("banks");

      res.render("admin/payment/view_payment", {
        payments,
        alert,
        user: req.session.user,
      });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "warning");
      res.redirect("/payment");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const banks = await Bank.find();
      res.render("admin/payment/create", { banks, user: req.session.user });
    } catch (err) {
      console.log(err);
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { type, banks } = req.body;

      const payment = new Payment({
        type,
        banks,
      });

      await payment.save();

      console.log(payment);

      req.flash("alertMessage", `Berhasil tambah pembayaran`);
      req.flash("alertStatus", "success");
      res.redirect("/payment");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const payment = await Payment.findOne({ _id: req.params.id });
      const banks = await Bank.find();

      console.log(payment);
      res.render("admin/payment/edit", {
        payment,
        banks,
        user: req.session.user,
      });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "warning");
      res.redirect("/payment");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { type, banks } = req.body;
      const payment = await Payment.findOne({ _id: req.params.id });
      payment.type = type;
      payment.banks = banks;

      await payment.save();

      req.flash("alertMessage", `Berhasil ubah pembayaran`);
      req.flash("alertStatus", "success");

      res.redirect("/payment");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },
  actionDelete: async (req, res) => {
    try {
      // Delete payment data by id
      const condition = { _id: req.params.id };
      result = await Payment.deleteOne(condition);

      // Redirect to page with message
      req.flash("alertMessage", `Berhasil hapus pembayaran`);
      req.flash("alertStatus", `success`);
      res.redirect("/payment");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },
  actionStatus: async (req, res) => {
    try {
      // Find payment by id and update it's status
      const payment = await Payment.findOne({ _id: req.params.id });
      payment.status = req.body.status;
      await payment.save();

      // Redirect message to page
      req.flash("alertMessage", `Berhasil ubah status`);
      req.flash("alertStatus", "success");
      res.redirect("/payment");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },
};
