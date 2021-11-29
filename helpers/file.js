const path = require("path");
const fs = require("fs");
const config = require("../config");

/**
 *
 * @param {String} path path of file
 * @param {String} filename provide filename or just left it empty if you just want to use path paramater
 * @returns {Boolean} (true) if delete success, (false) if delete fail
 */
function deleteFile(path, filename) {
  if (filename) path = `${path}/${filename}`;
  const fullPath = `${config.rootPath}/${path}`;

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    return true;
  }

  return false;
}

/**
 *
 * @param {String} dir directory name
 * @param {Blob} file image file
 * @param {Function} cb callback function
 * @returns {Promise} resolve(filename), reject(error)
 */
function uploadImage(dir, file, cb) {
  return new Promise((resolve, reject) => {
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
      src.on("end", () => {
        if (typeof cb === "function") cb(filename);
        resolve(filename);
      });

      // resolve(filename);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  deleteFile,
  uploadImage,
};
