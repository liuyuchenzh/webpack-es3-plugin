const fse = require("fs-extra");
const { spawnSync } = require("child_process");
const path = require("path");
const { read, write } = require("./src/util/io");
const tsConfig = require("./tsconfig.json");
const { name } = require("./package.json");
const normalize = location => location.split(path.delimiter).join("/");
const es3Dist = normalize(path.resolve(__dirname, "temp"));
const tsConfigPath = normalize(path.resolve(__dirname, "tsconfig.json"));
const shim = path.resolve(__dirname, "./src/util/defineProperty.js");
const shimContent = read(shim);

class ES3Plugin {
  /**
   * @param {object=} option
   * @param {number=|function<Promise<*>>} option.waitFor
   */
  constructor(option = {}) {
    const { waitFor = () => Promise.resolve(), onFinish = () => {} } = option;
    this.waitFor = waitFor;
    this.onFinish = onFinish;
  }
  apply(compiler) {
    compiler.hooks.done.tap("ES3Plugin", async ({ compilation }) => {
      const {
        options: {
          output: { path: outputPath },
          optimization: {
            minimize
          } = {}
        },
        assets
      } = compilation;
      if (typeof this.waitFor === "number") {
        await new Promise(resolve => {
          setTimeout(resolve, this.waitFor);
        });
      } else {
        await this.waitFor();
      }
      if (minimize === true) {
        console.warn(
          `[${name}]: WARNING! Using optimization.minimize in webpack config!`
        );
        console.warn(`[${name}]: Switch it to false!`);
        console.warn(`[${name}]: Error will be thrown for future release!`);
      }
      console.log(
        `[${name}]: start to convert js files into es3 compatible...`
      );
      // gather all js files
      const jsFiles = Object.values(assets)
        .map(item => item.existsAt)
        .filter(item => path.extname(item) === ".js");
      // check js
      jsFiles.forEach(file => {
        const content = read(file);
        const newContent = `${shimContent}\n${content}`;
        write(file, newContent);
      });
      // use typescript to convert es5 to es3
      // update include
      // update input setting
      tsConfig.include = [`${outputPath}/**/*.js`];
      tsConfig.compilerOptions.outDir = es3Dist;
      tsConfig.compilerOptions.rootDir = outputPath;
      // update tsconfig.json
      write(tsConfigPath, JSON.stringify(tsConfig, null, 2));
      spawnSync("npx", ["tsc", "-p", tsConfigPath]);
      fse.copySync(es3Dist, outputPath);
      fse.removeSync(es3Dist);
      // delete unneeded fields
      delete tsConfig.compilerOptions.outDir;
      delete tsConfig.compilerOptions.rootDir;
      delete tsConfig.include;
      write(tsConfigPath, JSON.stringify(tsConfig, null, 2));
      console.log(`[${name}]: done`);
      this.onFinish();
    });
  }
}

module.exports = ES3Plugin;
