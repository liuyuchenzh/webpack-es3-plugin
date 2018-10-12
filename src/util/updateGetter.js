const noGetterCode = `
__webpack_require__.d = function(exports, name, getter) {
  if (!__webpack_require__.o(exports, name)) {
    Object.defineProperty(exports, name, {
      enumerable: true,
      value: getter()
    });
  }
}
`;

const updateGetter = (file, occur) => {
  return occur.reduce((last, { start, end }, index) => {
    const len = end - start;
    const shift = index * (noGetterCode.length - len);
    return `${last.slice(0, start + shift)}${noGetterCode}${last.slice(
      end + shift
    )}`;
  }, file);
};

module.exports = {
  updateGetter
};
