const fs = require("fs");
const path = require("path");

const isDir = file => fs.statSync(file).isDirectory();

function gatherFile(dir, type) {
  return fs.readdirSync(dir).reduce((last, file) => {
    const filePath = path.resolve(dir, file);
    if (isDir(filePath)) {
      return last.concat(gatherFile(filePath, type));
    }
    if (typeof type === "string") {
      if (path.extname(file) === `.${type.replace(/^\./, "")}`) {
        last.push(filePath);
      }
    } else {
      last.push(filePath);
    }
    return last;
  }, []);
}

module.exports = {
  gatherFile
};
