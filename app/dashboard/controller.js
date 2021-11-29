const Transaction = require("../transaction/model");
const Voucher = require("../voucher/model");
const Category = require("../category/model");
const Player = require("../player/model");

module.exports = {
  index: async (req, res) => {
    try {
      const transactionCount = await Transaction.countDocuments();
      const voucherCount = await Voucher.countDocuments();
      const categoryCount = await Category.countDocuments();
      const playerCount = await Player.countDocuments();

      const alert = {
        message: req.flash("alertMessage"),
        status: req.flash("alertStatus"),
      };
      console.log("user session", req.session.user);
      res.render("admin/dashboard/view_dashboard", {
        alert,
        user: req.session.user,
        count: {
          transaction: transactionCount,
          voucher: voucherCount,
          cathegory: categoryCount,
          player: playerCount,
        },
      });
    } catch (err) {
      console.log(err);
    }
  },
};
