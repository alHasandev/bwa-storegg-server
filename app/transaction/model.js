const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const transactionSchema = mongoose.Schema(
  {
    historyVoucherTopup: {
      gameName: {
        type: String,
        required: [true, "Nama game harus diisi"],
      },
      category: {
        type: String,
        required: [true, "Kategori harus diisi"],
      },
      thumbnail: {
        type: String,
      },
      coinName: {
        type: String,
        required: [true, "Nama koin harus diisi"],
      },
      coinQuantity: {
        type: Number,
        required: [true, "Jumlah koin harus diisi"],
      },
      price: {
        type: Number,
        default: 0,
      },
    },
    historyPayment: {
      name: {
        type: String,
        required: [true, "Nama harus diisi"],
      },
      type: {
        type: String,
        required: [true, "Tipe pembayaran harus diisi"],
      },
      bankName: {
        type: String,
        required: [true, "Nama bank pembayaran harus diisi"],
      },
      noRekening: {
        type: String,
        required: [true, "Nomer rekening harus diisi"],
      },
    },
    name: {
      type: String,
      required: [true, "Nama harus diisi"],
      minlength: [3, "Panjang harus antar 3-255 karakter"],
      maxlength: [255, "Panjang harus antar 3-255 karakter"],
    },
    accountUser: {
      type: String,
      required: [true, "Nama akun harus diisi"],
      minlength: [3, "Panjang harus antar 3-255 karakter"],
      maxlength: [255, "Panjang harus antar 3-255 karakter"],
    },
    tax: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    player: {
      type: ObjectId,
      ref: "player",
    },
    category: {
      type: ObjectId,
      ref: "category",
    },
    historyUser: {
      name: {
        type: String,
        required: [true, "Nama player harus diisi"],
      },
      phoneNumber: {
        type: String,
        required: [true, "Nomer telepon harus diisi"],
        minlength: [9, "Panjang harus antar 9-13 karakter"],
        maxlength: [13, "Panjang harus antar 9-13 karakter"],
      },
    },
    user: {
      type: ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("transaction", transactionSchema);

module.exports = Transaction;
