module.exports = function (triangleData) {
  const dimensions = triangleData.reduce(
    ({xmin, ymin, xmax, ymax}, {one, two, three}) => {
      const triangleXs = [one, two, three].map(p => p.x);
      const triangleYs = [one, two, three].map(p => p.y);
      return {
        xmin: Math.min(xmin, ...triangleXs),
        ymin: Math.min(ymin, ...triangleYs),
        xmax: Math.max(xmax, ...triangleXs),
        ymax: Math.max(ymax, ...triangleYs)
      };
    }, {
      xmin: Number.POSITIVE_INFINITY,
      ymin: Number.POSITIVE_INFINITY,
      xmax: Number.NEGATIVE_INFINITY,
      ymax: Number.NEGATIVE_INFINITY
    }
  );
  return {
    width: dimensions.xmax - dimensions.xmin,
    height: dimensions.ymax - dimensions.ymin,
    ...dimensions
  };
};
