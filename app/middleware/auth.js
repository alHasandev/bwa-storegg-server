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
};
