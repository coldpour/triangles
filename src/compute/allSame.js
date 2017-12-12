module.exports = function (str) {
  let same = true;
  for(let i=0; same && i<str.length; i++) {
    same = str[i] === str[0];
  }
  return same;
};
