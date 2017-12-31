const svg = require('jssvg');
const animate = require('./animate');

module.exports = function ({start, end}) {
  return ['x', 'y'].map((c) => (
    animate(`c${c}`, {
      values: [start[c], end[c], start[c]],
      begin: start.time,
      dur: end.time - start.time
    })
  ));
};
