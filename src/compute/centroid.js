module.exports = function (a, b, c) {
  return {
    x: Math.round((a.x + b.x + c.x) / 3),
    y: Math.round((a.y + b.y + c.y) / 3)
  };
};
