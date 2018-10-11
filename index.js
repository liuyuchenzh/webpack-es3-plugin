const fs = require("fs");
const fse = require("fs-extra");
const { spawnSync } = require("child_process");
const path = require("path");
const tsConfig = require("./tsconfig.json");
const { name } = require("./package.json");
const es3Dist = path.resolve(__dirname, "temp");
const tsConfigPath = path.resolve(__dirname, "tsconfig.json");

class ES3Plugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap("ES3Plugin", compilation => {
      const {
        options: {
          output: { path: outputPath }
        }
      } = compilation;
      // update include
      tsConfig.include = [`${outputPath}/**/*.js`];
      tsConfig.compilerOptions.outDir = es3Dist;
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
      delete tsConfig.include;
      fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
      console.log(`[${name}]: done`);
    });
  }
}

module.exports = ES3Plugin;
