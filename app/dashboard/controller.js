module.exports = {
  index: async (req, res) => {
    try {
      console.log("user session", req.session.user);
      res.render("index", { user: req.session.user });
    } catch (err) {
      console.log(err);
    }
  },
};
