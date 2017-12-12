module.exports = function (value, low1, high1, low2, high2) {
  return low2 + (value - low1) * (high2 - low2) / (high1 - low1);
};
