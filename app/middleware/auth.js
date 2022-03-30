const jwt = require("jsonwebtoken");

const config = require("../../config");
const Player = require("../player/model");

module.exports = {
  isLoginAdmin: (req, res, next) => {
    if (!req.session.user) {
      req.flash(
        "alertMessage",
        `Mohon maaf session anda telah habis, silahkan login kembali`
      );
      req.flash("alertStatus", "warning");
      res.redirect("/");
    } else {
      next();
    }
  },
  isNotLoginAdmin: (req, res, next) => {
    if (req.session.user) {
      req.flash(
        "alertMessage",
        `Mohon maaf anda telah login, silahkan lakukan logout jika anda ingin login kembali`
      );
      req.flash("alertStatus", "warning");
      res.redirect("/dashboard");
    } else {
      next();
    }
  },
  isLoginPlayer: async (req, res, next) => {
    try {
      const token =
        req.headers.authorization &&
        req.headers.authorization.replace("Bearer ", "");
      // console.log("token", token);
      if (!token) throw { message: "Authorized token not found" };

      const data = jwt.verify(token, config.jwtKey);
      const player = await Player.findOne({ _id: data.player.id });
      if (!player) throw { message: "Not authorized to access resources" };

      req.player = player;
      req.token = token;

      next();
    } catch (error) {
      return res.status(401).json({
        error: error.message,
      });
    }
  },
};
