module.exports = function (b, c) {
  // a*a + b*b = c*c
  return Math.abs(c*c - b*b) ** (1/2);
};
