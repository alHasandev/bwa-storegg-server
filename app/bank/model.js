const mongoose = require("mongoose");

const bankSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama harus diisi"],
    },
    bankName: {
      type: String,
      required: [true, "Nama Bank harus diisi"],
    },
    rekeningNumber: {
      type: String,
      required: [true, "Nama Rekening Bank harus diisi"],
    },
  },
  { timestamps: true }
);

const Bank = mongoose.model("bank", bankSchema);

module.exports = Bank;
