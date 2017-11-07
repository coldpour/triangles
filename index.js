const fs = require('fs');
const triangleData = require('./src/triangles');
const svg = require('./src/svg');
const compute = require('./src/compute');
const draw = require('./src/draw');

function log(props) {
  console.log(props);
  return props;
}

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
    slope,
    theta: Math.atan(slope)
  };
}

function timeTransform(time, dur) {
  return compute.roundPlaces(2, compute.clamp(0, 1, time/dur));
}

function distanceTransform(brightness, radius, distance) {
  return compute.color(brightness, radius, compute.roundPlaces(0, compute.clamp(0, radius, distance)));
}

function translateByReference(point, reference) {
  return {x: point.x - reference.x, y: point.y - reference.y};
}

function lightUp({start, end, theta, brightness, radius, distance, dur, velocity, slope}, triangle) {
  const {one, two, three, id} = triangle;
  const centroid = compute.centroid(one, two, three);
  const origin = {x: 0, y: 0};
  const startDistance = compute.distance(start, centroid);
  const endDistance = compute.distance(end, centroid);

  const brightest = compute.pointOnAndDistanceFromLine(start, end, centroid);
  const illuminationDistance = compute.pythagoreanA(brightest.distance, radius);

  const translatedCentroid = translateByReference(centroid, start);
  const distanceStartToBrightest = compute.distance(start, brightest.point);
  const distanceFromIlluminationToOrigin = distanceStartToBrightest - illuminationDistance;
  const distanceFromExtinguishToOrigin = distanceStartToBrightest + illuminationDistance;
  const illuminationPoint = {x: start.x + (Math.cos(theta) * distanceFromIlluminationToOrigin), y: start.y + (Math.sin(theta) * distanceFromIlluminationToOrigin)};
  const extinguishPoint = {x: start.x + (Math.cos(theta) * distanceFromExtinguishToOrigin), y: start.y + (Math.sin(theta) * distanceFromExtinguishToOrigin)};
  const illuminatedDistance = compute.distance(illuminationPoint, extinguishPoint);

  const points = [start, illuminationPoint, brightest.point, extinguishPoint, end]
        .sort((a, b) => a.y > b.y)
        .filter(p => p.y >= start.y && p.y <= end.y);
  const color = compute.colorMirror(points.map(compute.distance.bind(this, centroid))
        .map(distanceTransform.bind(this, brightness, radius)));
  const keyTimes = compute.timeMirror(points.map(p => compute.roundPlaces(2, compute.lerp(compute.distance(start, p), 0, distance, 0, 1))));

  return {
    start,
    id,
    one,
    two,
    three,
    dur,
    color,
    keyTimes,
    centroid,
    brightest,
    illuminationPoint,
    extinguishPoint
  };
}

function selectTrianglesReducer(acc, triangle) {
  if([165].indexOf(triangle.id) !== -1) {
    return acc.concat(triangle);
  }
  return acc;
}

const {xmin, xmax, ymin, ymax, width, height} = compute.dimensions(triangleData);
const lightPath = {
  start: {
    time: 0,
    x: xmax-(width*.25),
    y: ymin+(height*.25)
  },
  end: {
    time: 60,
    x: xmax-(width*.1),
    y: ymax
  },
  brightness: 75,
  radius: width*.70
};
const triangles = triangleData
      // .reduce(selectTrianglesReducer, [])
      // .map(log)
      .map(lightUp.bind(this, extendLight(lightPath)))
      // .map(log)
      .map(draw.triangle)
      .join("");
const light = svg.circle(
  {
    cx: lightPath.end.x,
    cy: lightPath.end.y,
    r: lightPath.radius,
    fill: "yellow",
    opacity: "0.5"
  },
  draw.animate("cx", {values:[lightPath.start.x, lightPath.end.x], begin:lightPath.start.time, dur:lightPath.end.time}),
  draw.animate("cy", {values:[lightPath.start.y, lightPath.end.y], begin:lightPath.start.time, dur:lightPath.end.time}));
const lightCenter = svg.circle(
  {
    cx: lightPath.end.x,
    cy: lightPath.end.y,
    fill: "blue",
    r: 5
  },
  draw.animate("cx", {values:[lightPath.start.x, lightPath.end.x], begin:lightPath.start.time, dur:lightPath.end.time}),
  draw.animate("cy", {values:[lightPath.start.y, lightPath.end.y], begin:lightPath.start.time, dur:lightPath.end.time}));
const svgStr = svg.svg(
  {
    xmlns:"http://www.w3.org/2000/svg",
    viewBox: [xmin, ymin, width, height].join(" "),
    width: "100%"
  },
  // light,
  // draw.line(lightPath.start, lightPath.end, "red"),
  // svg.symbol(
  //   {
  //     id: "triangles"
  //   },
    triangles
  // ),
  // lightCenter
);

fs.writeFile("./gems.svg", svgStr, err => {
  if (err) {
    return console.log(err);
  }
  process.exit();
});
