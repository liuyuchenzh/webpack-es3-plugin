# webpack-es3-plugin

As the name suggested

## Intro

Convert emitted Javascript files by webpack to es3 format

## Notice

Designed for webpack v4

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

### [waitFor]

Wait for some time to start. Unit is `ms`.

```js
// wait for 1000ms
new ES3Plugin({
  waitFor: 1000
});
```
