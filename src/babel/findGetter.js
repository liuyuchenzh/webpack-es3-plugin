const { parseSync } = require("@babel/core");
const { default: traverse } = require("@babel/traverse");
const t = require("@babel/types");
const findGetterAssignment = node => {
  try {
    const isTargetObj = node.object.name === "__webpack_require__";
    const isTargetProp = node.property.name === "d";
    return isTargetObj && isTargetProp;
  } catch (e) {
    return false;
  }
};
module.exports = {
  findGetter(code) {
    // get ast first
    const result = parseSync(code);
    const occur = [];
    traverse(result, {
      AssignmentExpression({ node }) {
        if (
          findGetterAssignment(node.left) &&
          t.isFunctionExpression(node.right)
        ) {
          // track down position of occur
          const { start, end } = node;
          occur.push({ start, end });
        }
      }
    });
    return occur;
  }
};
