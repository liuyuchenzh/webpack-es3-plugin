const fs = require("fs");
const fse = require("fs-extra");
const { spawnSync } = require("child_process");
const path = require("path");
const { findGetter } = require("./src/babel/findGetter");
const { gatherFile } = require("./src/util/gatherFile");
const { updateGetter } = require("./src/util/updateGetter");
const { read, write } = require("./src/util/io");
const tsConfig = require("./tsconfig.json");
const { name } = require("./package.json");
const es3Dist = path.resolve(__dirname, "temp");
const tsConfigPath = path.resolve(__dirname, "tsconfig.json");

class ES3Plugin {
  /**
   * @param {object=} option
   * @param {number=} option.waitFor
   */
  constructor(option = {}) {
    const { waitFor } = option;
    this.waitFor = waitFor;
  }
  apply(compiler) {
    compiler.hooks.done.tap("ES3Plugin", async ({ compilation }) => {
      const {
        options: {
          output: { path: outputPath }
        }
      } = compilation;
      if (typeof this.waitFor === "number") {
        await new Promise(resolve => {
          setTimeout(resolve, this.waitFor);
        });
      }
      console.log(
        `[${name}]: start to convert js files into es3 compatible...`
      );
      // gather all js files
      const jsFiles = gatherFile(outputPath, "js");
      // check js
      jsFiles.forEach(file => {
        const content = read(file);
        // whether or not use the evil getter
        const occur = findGetter(content);
        if (occur.length) {
          const newContent = updateGetter(content, occur);
          write(file, newContent);
        }
      });
      // use typescript to convert es5 to es3
      // update include
      tsConfig.include = [`${outputPath}/**/*.js`];
      tsConfig.compilerOptions.outDir = es3Dist;
      // update tsconfig.json
      write(tsConfigPath, JSON.stringify(tsConfig, null, 2));
      spawnSync("npx", ["tsc", "-p", tsConfigPath]);
      fse.copySync(es3Dist, outputPath);
      fse.removeSync(es3Dist);
      // delete unneeded fields
      delete tsConfig.compilerOptions.outDir;
      delete tsConfig.include;
      write(tsConfigPath, JSON.stringify(tsConfig, null, 2));
      console.log(`[${name}]: done`);
    });
  }
}

module.exports = ES3Plugin;
