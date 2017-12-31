const svg = require('jssvg');

module.exports = function (attributeName, {keyTimes, values, ...rest}) {
  const init = {
    ...rest,

    attributeName,
    repeatCount: "indefinite",
    values: values.join(";")
  };
  const opts = (keyTimes && Array.isArray(keyTimes)) ? {
    keyTimes: keyTimes.join(";")
  } : {};
  return svg.animate(Object.assign(opts, init));
};
