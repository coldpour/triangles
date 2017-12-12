module.exports = function (distance, slope) {
  // a*a + b*b = c*c
  // c = distance
  // b = slope * a
  // a*a + slope*a*slope*a = distance*distance
  return Math.sqrt((distance ** 2) / (1 + (slope ** 2)));
};
