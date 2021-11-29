const Player = require("../player/model");
const { uploadImage, deleteFile } = require("../../helpers/file");

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
};
