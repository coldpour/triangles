module.exports = function (min, max, value) {
  return Math.min(Math.max(min, value), max);
};
