module.exports = function (distance, slope) {
  // a*a + b*b = c*c
  // c = distance
  // a = b/slope
  // b/slope*b/slope + b*b = distance*distance
  return Math.sqrt((distance ** 2) / ((1 / (slope ** 2)) + 1));
};
