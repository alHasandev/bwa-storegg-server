const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const voucherSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama game harus diisi"],
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    thumbnail: {
      type: String,
    },
    category: {
      type: ObjectId,
      ref: "category",
    },
    nominals: [
      {
        type: ObjectId,
        ref: "nominal",
      },
    ],
    user: {
      type: ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const Voucher = mongoose.model("voucher", voucherSchema);

module.exports = Voucher;
