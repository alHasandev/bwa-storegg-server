const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const HASH_ROUND = 10;

const ObjectId = mongoose.Schema.Types.ObjectId;

const playerSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email harus diisi"],
    },
    name: {
      type: String,
      required: [true, "Nama harus diisi"],
      minlength: [3, "Panjang harus antar 3-50 karakter"],
      maxlength: [50, "Panjang harus antar 3-50 karakter"],
    },
    username: {
      type: String,
      required: [true, "Usernama harus diisi"],
      minlength: [3, "Panjang harus antar 3-25 karakter"],
      maxlength: [25, "Panjang harus antar 3-25 karakter"],
    },
    password: {
      type: String,
      required: [true, "Password harus diisi"],
      minlength: [8, "Panjang minimal 8 karakter"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    avatar: {
      type: String,
    },
    fileName: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    phoneNumber: {
      type: String,
      required: [true, "Nomer telepon harus diisi"],
      minlength: [9, "Panjang nomer telepon harus antar 9-15 karakter"],
      maxlength: [15, "Panjang nomer telepon harus antar 9-15 karakter"],
    },
    favorite: {
      type: ObjectId,
      ref: "cathegory",
    },
  },
  { timestamps: true }
);

// Validate: email must unique
playerSchema.path("email").validate(
  async function (value) {
    try {
      const count = await this.model("player").countDocuments({
        email: value,
      });

      return !count;
    } catch (err) {
      throw err;
    }
  },
  (attr) => `${attr.value} sudah terdaftar`
);

// Encrypt password before save
playerSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

const Player = mongoose.model("player", playerSchema);

module.exports = Player;
