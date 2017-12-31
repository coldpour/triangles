const svg = require('jssvg');
const animate = require('./animate');

module.exports = function ({one, two, three, dur, color, keyTimes}) {
  let opts={}, children=[];
  const path = {
    d: `M${one.x},${one.y}L${two.x},${two.y}L${three.x},${three.y}z`
  };

  if(Array.isArray(color)) {
    if(color.every((c, i, a) => c === a[0])) {
      opts = {fill: color[0], stroke: color[0]};
    } else {
      opts = {fill: color[color.length - 1]};
      children = ["fill", "stroke"].map(attr => animate(attr, {
        keyTimes,
        dur,
        values: color
      }));
    }
  } else {
    opts = {fill: color};
  }
  return svg.path(Object.assign(opts, path), ...children);
};
