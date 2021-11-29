const Voucher = require("../voucher/model");

module.exports = {
  landingPage: async (req, res) => {
    try {
      const vouchers = await Voucher.find()
        .select("_id name status category thumbnail")
        .populate("category");

      res.status(200).json({ data: vouchers });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message || "Internal server error" });
    }
  },
  detailPage: async (req, res) => {
    try {
      const voucher = await Voucher.findOne({ _id: req.params.id })
        .populate("category")
        .populate("nominals")
        .populate("user", "_id name phoneNumber");

      if (!voucher)
        throw { code: 404, message: "Voucher game tidak ditemukan" };

      res.status(200).json({ data: voucher });
    } catch (err) {
      console.log(err);
      res
        .status(err.code || 500)
        .json({ message: err.message || "Internal server error" });
    }
  },
};
