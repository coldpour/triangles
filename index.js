const fs = require('fs');
const triangleData = require('./src/triangles');
const svg = require('jssvg');
const compute = require('./src/compute');
const draw = require('./src/draw');

function animateTriangles(renderFunc, keyFrameFunc) {
  return triangleData.reduce((acc, triangle) => {
    //160, 161, 169 - misbehaving illPt
    //165 - brightest before start
    //149 - misbehaving extPt
    // if([161].indexOf(triangle.id) === -1) {
    //   return acc;
    // }

    return acc + renderFunc(keyFrameFunc(triangle));
  }, "");
}

function colorTransform(brightness, radius, centroid, point) {
  const unclampedDistance = compute.distance(centroid, point);
  const unroundedDistance = compute.clamp(0, radius, unclampedDistance);
  const distance = compute.roundPlaces(0, unroundedDistance);
  return compute.color(brightness, radius, distance);
}

function timeTransform(start, distance, point) {
  const unlerpedDistance = compute.distance(start, point);
  const unroundedTime = compute.lerp(unlerpedDistance, 0, distance, 0, 1);
  return compute.roundPlaces(2, unroundedTime);
}

function lightUp({start, end, slope, brightness, radius, distance, dur}, triangle) {
  const {one, two, three, id} = triangle;
  const centroid = compute.centroid(one, two, three);
  const {point: peak, distance: peakDistance} = compute.pointOnAndDistanceFromLine(start, end, centroid);
  const illuminationDistance = compute.pythagoreanA(peakDistance, radius);
  const {negative: illuminationPoint, positive: extinguishPoint} = compute.surroundingPoints(peak, illuminationDistance, slope);
  const keypoints = [start, illuminationPoint, peak, extinguishPoint, end].filter(p => p.y >= start.y && p.y <= end.y);

  const colors = keypoints.map(colorTransform.bind(this, brightness, radius, centroid));
  const lastColor = colors[colors.length - 1];
  const times = keypoints.map(timeTransform.bind(this, start, distance));

  return {
    start,
    id,
    one,
    two,
    three,
    dur,
    fill: lastColor,
    color: compute.colorMirror(colors),
    keyTimes: compute.timeMirror(times),
    centroid,
    peak,
    illuminationPoint,
    extinguishPoint
  };
}

const {xmin, xmax, ymin, ymax, width, height} = compute.dimensions(triangleData);

const lightPath = ((
  start = {
    time: 0,
    x: xmin+(width*.65),
    y: ymin+(height*.15)
  },
  end = {
    time: 60,
    x: xmin+(width),
    y: ymin+(height*.75)
  },
  dur = end.time - start.time,
  distance = compute.distance(start, end),
) => ({
  brightness: 75,
  radius: width*.70,
  distance,
  dur,
  end,
  start,
  slope: compute.slope(start, end)
}))();

const svgStr = svg.svg(
  {
    xmlns:"http://www.w3.org/2000/svg",
    viewBox: [xmin, ymin, width, height].join(" "),
    width,
    height
  },
  draw.light(lightPath),
  draw.line(lightPath.start, lightPath.end, "red"),
  animateTriangles(draw.triangle, lightUp.bind(this, lightPath))
  , draw.lightCenter(lightPath)
);

fs.writeFile("./gems.svg", svgStr, err => {
  if (err) {
    return console.log(err);
  }
  process.exit();
});
