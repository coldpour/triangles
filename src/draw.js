const svg = require('./svg');

function animate(attributeName, {keyTimes, values, ...rest}) {
  let opts = {};
  let init = {
    ...rest,

    attributeName,
    repeatCount: "indefinite",
    values: values.join(";")
  };
  if(keyTimes && Array.isArray(keyTimes)) {
    opts = {
      keyTimes: keyTimes.join(";")
    };
  }
  const str = svg.animate(Object.assign(opts, init));
  return str;
}

function line(one, two, color) {
  return svg.path(
    {
      d: `M${one.x},${one.y}L${two.x},${two.y}z`,
      stroke: color
    }
  );
}

function triangle({id, one, two, three}) {
  return svg.path({
    d: `M${one.x},${one.y}L${two.x},${two.y}L${three.x},${three.y}z`,
    fill: "black",
    id,
    stroke: "white"
  });
}

module.exports = {
  animate,
  line,
  triangle
};
