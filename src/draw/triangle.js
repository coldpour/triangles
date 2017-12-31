const svg = require('jssvg');
const animate = require('./animate');

module.exports = function ({one, two, three, dur, color, keyTimes}) {
  let opts={}, children=[];
  const path = {
    d: `M${one.x},${one.y}L${two.x},${two.y}L${three.x},${three.y}z`
  };

  if(Array.isArray(color)) {
    const fill = color[0];
    if(color.every(c => c === fill)) {
      opts = {fill, stroke: fill};
    } else {
      opts = {fill};
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
