const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

module.exports = {
  rootPath: path.resolve(__dirname, ".."),
  serviceName: process.env.SERVICE_NAME,
  dbURL: process.env.MONGO_URL,
  jwtKey: process.env.SECRET,
};
