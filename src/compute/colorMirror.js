module.exports = function (colors) {
  const head = colors.slice(0, -1);
  const reversed = colors.slice().reverse();
  return head.concat(reversed);
};
