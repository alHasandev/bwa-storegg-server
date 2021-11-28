const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const paymentSchema = mongoose.Schema({
  type: {
    type: String,
    required: [true, "Tipe pembayaran harus diisi"],
  },
  status: {
    type: String,
    enum: ["Y", "N"],
    default: "Y",
  },
  banks: {
    type: [ObjectId],
    ref: "bank",
  },
},
{ timestamps: true });

const Payment = mongoose.model("payment", paymentSchema);

module.exports = Payment;
