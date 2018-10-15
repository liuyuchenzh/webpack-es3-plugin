# webpack-es3-plugin

As the name suggested

## Intro

Convert emitted Javascript files by webpack to es3 format

## Notice

- Designed for webpack v4
- Set `mode` to `"none"`
- If using `babel-loader`, then set `loose` to `true` and `modules` to `"commonjs"` in your `@babel/env-preset`

```json
{
  "presets": [["@babel/preset-env", { "loose": true, "modules": "commonjs" }]]
}
```

## Installation

```bash
$ npm i -D webpack-es3-plugin
# or
$ yarn add -D webpack-es3-plugin
```

## Usage

```js
// in your webpack.config.js
const ES3Plugin = require("webpack-es3-plugin");
module.exports = {
  plugins: [new ES3Plugin()]
};
```

## Config

No field is needed by default.

### [waitFor=Promise.resolve()]

```ts
type waitFor = number | () => Promise<any>;
```

If passing numbers, then wait for some time to start. Unit is `ms`.

If a function is passed in, then the plugin will wait till the returned Promise resolves.

```js
// wait for 1000ms
new ES3Plugin({
  waitFor: 1000
});

// or function that returns a Promise
const task = () => {
  return new Promise(resolve => {
    // do something
    resolve();
  });
};

new ES3Plugin({
  waitFor: task
});
```

### [onFinish=() => {}]

Called when transformation (compile to ES3 compatible) is done.

```js
new ES3Plugin({
  onFinish() {
    // do something
  }
});
```
