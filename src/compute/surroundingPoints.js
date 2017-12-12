const rise = require('./rise');
const run = require('./run');

module.exports = function ({x, y}, distance, slope) {
  const dx = run(distance, slope);
  const dy = rise(distance, slope);

  return {
    negative: {x: x - dx, y: y - dy},
    positive: {x: x + dx, y: y + dy}
  };
};
