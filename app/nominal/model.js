const mongoose = require("mongoose");

const nominalSchema = mongoose.Schema(
  {
    coinQuantity: {
      type: Number,
      default: 0,
    },
    coinName: {
      type: String,
      required: [true, "Nama koin harus diisi"],
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Nominal = mongoose.model("nominal", nominalSchema);

module.exports = Nominal;
