const path = require("path");
const fs = require("fs");
const config = require("../config");

function deleteFile(path) {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
    return true;
  }

  return false;
}

/**
 *
 * @param {String} dir directory name
 * @param {Blob} file image file
 * @param {Function} cb callback function
 */
function uploadImage(dir, file, cb) {
  try {
    console.log("Upload Image!");
    let tmp_path = file.path;
    let fileNames = file.originalname.split(".");
    let originalExt = fileNames[fileNames.length - 1];
    let filename = file.filename + "." + originalExt;
    let target_path = path.resolve(config.rootPath, `${dir}/${filename}`);

    const src = fs.createReadStream(tmp_path);
    const dest = fs.createWriteStream(target_path);

    src.pipe(dest);
    if (typeof cb === "function") {
      src.on("end", () => cb(filename));
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  deleteFile,
  uploadImage,
};
