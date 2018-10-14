(function() {
  try {
    const obj = {};
    const result = Object.defineProperty(obj, "a", {
      get() {
        return 1;
      }
    });
    if (result.a !== 1) {
      throw new Error("fail");
    }
  } catch (e) {
    let isIE8 = false;
    try {
      const div = document.createElement("a");
      isIE8 =
        Object.defineProperty(div, "a", {
          value: 1
        }).a === 1;
    } catch (e) {
      // ignore
    }
    const hasDp = "defineProperty" in Object;
    if (!hasDp || isIE8) {
      Object.defineProperty = function(
        object = {},
        property = "property",
        descriptor = {}
      ) {
        if ("value" in descriptor) {
          object[property] = descriptor.value;
        } else if ("get" in descriptor) {
          object[property] = descriptor.get();
        }
        return object;
      };
    } else {
      const oldDp = Object.defineProperty;
      Object.defineProperty = function(object, property, descriptor) {
        let descriptor2Use = descriptor;
        if ("get" in descriptor) {
          const value = descriptor.get();
          delete descriptor.get;
          descriptor2Use = {
            ...descriptor,
            value
          };
        }
        return oldDp(object, property, descriptor2Use);
      };
    }
  }
})();
