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

function timeTransform(time, dur) {
  return compute.roundPlaces(2, compute.clamp(0, 1, time/dur));
}

function colorTransform(brightness, radius, centroid, point) {
  const unclampedDistance = compute.distance(centroid, point);
  const unroundedDistance = compute.clamp(0, radius, unclampedDistance);
  const distance = compute.roundPlaces(0, unroundedDistance);
  return compute.color(brightness, radius, distance);
}

function lightUp({start, end, theta, brightness, radius, distance, dur, velocity}, triangle) {
  const {one, two, three, id} = triangle;
  const {illuminationPoint, peak, extinguishPoint, centroid} = compute.keypoints({start, end, radius, theta}, triangle);
  const keyframes = [start, illuminationPoint, peak, extinguishPoint].filter(p => p.y >= start.y && p.y <= end.y);

  const colors = keyframes.map(colorTransform.bind(this, brightness, radius, centroid));
  const lastColor = colors[colors.length - 1];
  const times = keyframes.map(p => compute.roundPlaces(2, compute.lerp(compute.distance(start, p), 0, distance, 0, 1)));

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
  slope = (end.y - start.y) / (end.x - start.x),
) => ({
  brightness: 75,
  radius: width*.70,
  distance,
  dur,
  end,
  start,
  theta: Math.atan(slope),
  velocity: dur / distance
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
