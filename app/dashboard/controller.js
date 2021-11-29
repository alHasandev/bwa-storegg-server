module.exports = {
  index: async (req, res) => {
    try {
      const alert = {
        message: req.flash("alertMessage"),
        status: req.flash("alertStatus"),
      };
      console.log("user session", req.session.user);
      res.render("index", { alert, user: req.session.user });
    } catch (err) {
      console.log(err);
    }
  },
};
