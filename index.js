const fs = require("fs");
const fse = require("fs-extra");
const { spawnSync } = require("child_process");
const path = require("path");
const tsConfig = require("./tsconfig.json");
const { name } = require("./package.json");
const normalize = location => location.split(path.delimiter).join("/");
const es3Dist = normalize(path.resolve(__dirname, "temp"));
const tsConfigPath = normalize(path.resolve(__dirname, "tsconfig.json"));

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
      // update input setting
      tsConfig.include = [`${outputPath}/**/*.js`];
      tsConfig.compilerOptions.outDir = es3Dist;
      tsConfig.compilerOptions.rootDir = outputPath;
      // update tsconfig.json
      fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
      console.log(
        `[${name}]: start to convert js files into es3 compatible...`
      );
      spawnSync("npx", ["tsc", "-p", tsConfigPath]);
      fse.copySync(es3Dist, outputPath);
      fse.removeSync(es3Dist);
      // delete unneeded fields
      delete tsConfig.compilerOptions.outDir;
      delete tsConfig.compilerOptions.rootDir;
      delete tsConfig.include;
      fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
      console.log(`[${name}]: done`);
    });
  }
}

module.exports = ES3Plugin;
