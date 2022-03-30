const User = require("./model");
const bcrypt = require("bcrypt");

module.exports = {
  viewSignIn: async (req, res) => {
    try {
      const alert = {
        message: req.flash("alertMessage"),
        status: req.flash("alertStatus"),
      };

      res.render("admin/user/view_signin", {
        alert,
      });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "warning");
      res.redirect("/nominal");
    }
  },
  actionSignIn: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });

      // Check if user exist
      if (!user) throw { message: `Email atau password salah` };

      // Check if user status is active
      if (user.status !== "Y")
        throw { message: `Mohon maaf status anda belum aktif` };

      // Check if password is match
      const checkPassword = await bcrypt.compare(password, user.password);
      // const checkPassword = true;
      if (!checkPassword) throw { message: `Email atau password salah` };

      // Save user session
      req.session.user = {
        id: user._id,
        email: user.email,
        status: user.status,
        name: user.name,
      };

      // Redirect to dashboard page with message
      req.flash("alertMessage", `Selamat datang kembali ${user.name}`);
      req.flash("alertStatus", "success");
      res.redirect("/dashboard");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },
  actionSignUp: async (req, res) => {
    try {
      const { email, name, password, phoneNumber } = req.body;

      const user = await User.findOne({ email: email });

      // Check if user exist
      if (user) throw { message: `User dengan email ${email} sudah terdaftar` };

      const SALT_ROUNDS = 10;
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const encryptedPassword = await bcrypt.hash(password, salt);

      await new User({
        email,
        name,
        phoneNumber,
        password: encryptedPassword,
      }).save();

      res.json({
        message: "berhasil",
      });
    } catch (error) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "warning");
      res.redirect("/");
    }
  },
  actionLogout: async (req, res) => {
    try {
      req.session.destroy();

      res.redirect("/");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "warning");
      res.redirect("/dashboard");
    }
  },
};
