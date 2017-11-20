const fs = require('fs');
const triangleData = require('./src/triangles');
const svg = require('jssvg');
const compute = require('./src/compute');
const draw = require('./src/draw');

function extendLight({start, end, brightness, radius}) {
  const dur = end.time - start.time;
  const distance = compute.distance(start, end);
  const velocity = dur / distance;
  const slope = (end.y - start.y) / (end.x - start.x);
  return {
    start,
    end,
    brightness,
    radius,
    dur,
    distance,
    velocity,
    theta: Math.atan(slope)
  };
}

function timeTransform(time, dur) {
  return compute.roundPlaces(2, compute.clamp(0, 1, time/dur));
}

function distanceTransform(brightness, radius, distance) {
  return compute.color(brightness, radius, compute.roundPlaces(0, compute.clamp(0, radius, distance)));
}

function lightUp({start, end, theta, brightness, radius, distance, dur, velocity}, triangle) {
  const {one, two, three, id} = triangle;
  const centroid = compute.centroid(one, two, three);
  const startDistance = compute.distance(start, centroid);
  const endDistance = compute.distance(end, centroid);

  const brightest = compute.pointOnAndDistanceFromLine(start, end, centroid);
  const illuminationDistance = compute.pythagoreanA(brightest.distance, radius);

  const distanceStartToBrightest = compute.distance(start, brightest.point);
  const distanceFromStartToIlluminationPoint = distanceStartToBrightest - illuminationDistance;
  const distanceFromStartToExtinguishPoint = distanceStartToBrightest + illuminationDistance;
  const illuminationPoint = {x: start.x + (Math.cos(theta) * distanceFromStartToIlluminationPoint), y: start.y + (Math.sin(theta) * distanceFromStartToIlluminationPoint)};
  const extinguishPoint = {x: start.x + (Math.cos(theta) * distanceFromStartToExtinguishPoint), y: start.y + (Math.sin(theta) * distanceFromStartToExtinguishPoint)};

  const points = [start, illuminationPoint, brightest.point, extinguishPoint, end]
        .sort((a, b) => a.y > b.y)
        .filter(p => p.y >= start.y && p.y <= end.y);
  const colors = points
        .map(compute.distance.bind(this, centroid))
        .map(distanceTransform.bind(this, brightness, radius));
  const lastColor = colors[colors.length - 1];
  const times = points.map(p => compute.roundPlaces(2, compute.lerp(compute.distance(start, p), 0, distance, 0, 1)));

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
    brightest,
    illuminationPoint,
    extinguishPoint
  };
}

const {xmin, xmax, ymin, ymax, width, height} = compute.dimensions(triangleData);
const lightPath = {
  start: {
    time: 0,
    x: xmin+(width*.65),
    y: ymin+(height*.15)
  },
  end: {
    time: 60,
    x: xmin+(width),
    y: ymin+(height*.75)
  },
  brightness: 75,
  radius: width*.70
};
const extendedLight = extendLight(lightPath);

function animateTriangles(renderFunc, keyFrameFunc) {
  return triangleData.reduce((acc, triangle) => {
    // if([167].indexOf(triangle.id) === -1) {
    //   return acc;
    // }

    return acc + renderFunc(keyFrameFunc(triangle));
  }, "");
}

const svgStr = svg.svg(
  {
    xmlns:"http://www.w3.org/2000/svg",
    viewBox: [xmin, ymin, width, height].join(" "),
    width,
    height
  },
  draw.light(lightPath),
  draw.line(lightPath.start, lightPath.end, "red"),
  animateTriangles(draw.triangle, lightUp.bind(this, extendedLight))
  , draw.lightCenter(lightPath)
);

fs.writeFile("./gems.svg", svgStr, err => {
  if (err) {
    return console.log(err);
  }
  process.exit();
});
