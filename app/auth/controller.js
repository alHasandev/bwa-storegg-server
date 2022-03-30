const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Player = require("../player/model");
const { uploadImage, deleteFile } = require("../../helpers/file");
const config = require("../../config");

module.exports = {
  signup: async (req, res) => {
    try {
      // Get payload data
      const payload = req.body;

      // Handle image file
      if (req.file) {
        payload.avatar = await uploadImage("public/uploads", req.file);
        res.image = payload.avatar;
      }

      // Set player data
      const player = new Player(payload);

      // Save data
      await player.save();

      // Exlude password from response
      delete player._doc.password;

      // Return result
      res.status(201).json({
        data: player,
      });
    } catch (err) {
      console.log("error validasi", err);

      // Delete image if uploaded
      if (res.image) {
        deleteFile("public/uploads", res.image);
      }

      if (err && err.name === "ValidationError")
        return res.status(422).json({
          error: 1,
          message: err.message,
          fields: err.errors,
        });
    }
  },
  signin: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Check email
      const player = await Player.findOne({ email: email });
      if (!player) throw { code: 401, message: "Email atau password salah" };

      // Check password
      const checkPassword = await bcrypt.compare(password, player.password);
      if (!checkPassword)
        throw { code: 401, message: "Email atau password salah" };

      // Save token
      const token = jwt.sign(
        {
          player: {
            id: player.id,
            username: player.username,
            email: player.email,
            name: player.name,
            phoneNumber: player.phoneNumber,
            avatar: player.avatar,
          },
        },
        config.jwtKey
      );

      res.status(200).json({
        data: { token },
      });
    } catch (error) {
      res.status(error.code || 500).json({
        message: error.message || `Internal server error`,
      });
    }
  },
};
