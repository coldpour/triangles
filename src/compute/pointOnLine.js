const roundOff = require('./roundPlaces').bind(this, 2);

module.exports = function ({x:x1, y:y1}, {x: x2, y: y2}, {x: x3, y:y3}) {
  const a = x2-x1,
        b = y2-y1,
        cSquared = a*a + b*b,
        u = ((x3 - x1) * a + (y3 - y1) * b) / cSquared,
        x4 = x1 + u * a,
        y4 = y1 + u * b;

  return {
    x: roundOff(x4),
    y: roundOff(y4)
  };
};
