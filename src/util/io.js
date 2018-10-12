const fs = require("fs");

const read = file => fs.readFileSync(file, "utf-8");
const write = (file, content) => fs.writeFileSync(file, content);

module.exports = {
  read,
  write
};
