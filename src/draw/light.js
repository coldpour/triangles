const svg = require('jssvg');
const animateCircle = require('./animateCircle');

module.exports = function (lightPath) {
  return svg.circle(
    {
      cx: lightPath.end.x,
      cy: lightPath.end.y,
      r: lightPath.radius,
      fill: "yellow",
      opacity: "0.5"
    },
    ...animateCircle(lightPath));
};
