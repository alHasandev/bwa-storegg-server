const Bank = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alert = {
        message: req.flash("alertMessage"),
        status: req.flash("alertStatus"),
      };

      console.log("alert", alert);

      const banks = await Bank.find();

      res.render("admin/bank/view_bank", {
        banks,
        alert,
        user: req.session.user,
      });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "warning");
      res.redirect("/bank");
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/bank/create", { user: req.session.user });
    } catch (err) {
      console.log(err);
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name, bankName, rekeningNumber } = req.body;

      const bank = new Bank({
        name,
        bankName,
        rekeningNumber,
      });

      await bank.save();

      req.flash("alertMessage", `Berhasil tambah rekening bank`);
      req.flash("alertStatus", "success");
      res.redirect("/bank", { user: req.session.user });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const bank = await Bank.findOne({ _id: req.params.id });

      console.log(bank);
      res.render("admin/bank/edit", { bank, user: req.session.user });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "warning");
      res.redirect("/bank");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { name, bankName, rekeningNumber } = req.body;
      const bank = await Bank.findOne({ _id: req.params.id });
      bank.name = name;
      bank.bankName = bankName;
      bank.rekeningNumber = rekeningNumber;

      await bank.save();

      req.flash("alertMessage", `Berhasil ubah rekening bank`);
      req.flash("alertStatus", "success");

      res.redirect("/bank");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },
  actionDelete: async (req, res) => {
    try {
      // Delete bank by id
      const condition = { _id: req.params.id };
      await Bank.deleteOne(condition);

      // Redirect to page with message
      req.flash("alertMessage", `Berhasil hapus rekening`);
      req.flash("alertStatus", `success`);
      res.redirect("/bank");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },
};
