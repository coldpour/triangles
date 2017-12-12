const allSame = require('./allSame');

module.exports = function (str) {
  let out = "";
  const padded = 1 === str.length ? `0${str}` : str;

  while(out.length < 6) {
    out += padded;
  }

  return `#${allSame(out) ? out.substr(0,3) : out}`;
};
