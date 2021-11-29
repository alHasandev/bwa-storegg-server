const Transaction = require("./model");
const { rupiah } = require("../../helpers/number");

module.exports = {
  index: async (req, res) => {
    try {
      const alert = {
        message: req.flash("alertMessage"),
        status: req.flash("alertStatus"),
      };

      console.log("alert", alert);

      const transactions = await Transaction.find().populate("player");
      res.render("admin/transaction/view_transaction", {
        transactions,
        alert,
        user: req.session.user,
        rupiah,
      });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "warning");
      res.redirect("/transaction");
    }
  },
  actionStatus: async (req, res) => {
    try {
      // Update status
      await Transaction.findOneAndUpdate(
        { _id: req.params.id },
        { status: req.body.status }
      );

      // Redirect back to page with message
      req.flash("alertMessage", `Berhasil ubah status`);
      req.flash("alertStatus", `success`);
      res.redirect("/transaction");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/transaction");
    }
  },
};
