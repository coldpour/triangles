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
  const peak = compute.pointOnLine(start, end, centroid);
  const peakDistance = compute.roundPlaces(2, compute.distance(peak, centroid));
  const illuminationDistance = compute.pythagoreanA(peakDistance, radius);
  const {negative: illuminationPoint, positive: extinguishPoint} = compute.surroundingPoints(peak, illuminationDistance, slope);
  const keypoints = [start, illuminationPoint, peak, extinguishPoint, end].filter(p => p.y >= start.y && p.y <= end.y);

  const colors = keypoints.map(colorTransform.bind(this, brightness, radius, centroid));
  const times = keypoints.map(timeTransform.bind(this, start, distance));

  return {
    one,
    two,
    three,
    dur,
    color: compute.colorMirror(colors),
    keyTimes: compute.timeMirror(times)
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
  radius: width*.60,
  distance,
  dur,
  end,
  start,
  slope: compute.slope(start, end)
}))();

const filter = () => {
  return `<filter id="duotone_peachypink">
    <!-- <feColorMatrix type="matrix" result="grayscale" values="1 0 0 1 0
    1 0 0 1 0
    1 0 0 1 0
    0 0 0 1 0"></feColorMatrix> -->
    <feComponentTransfer color-interpolation-filters="sRGB" result="duotone">
      <!-- siteColor: original homepage ; -->
      <!-- siteColor: orangePunch_hover; #ec4d13; RGBA(236, 77, 19, 1) -->
      <feFuncR type="table" tableValues="0.0470588235 0.9254901961"></feFuncR>
      <feFuncG type="table" tableValues="0.0823529411 0.3019607843"></feFuncG>
      <feFuncB type="table" tableValues="0.1019607843 0.0745098039"></feFuncB>
      <!-- siteColor: original homepage heading; hsl(199,35%,31%); rgba(45, 78, 93, 1); -->
      <!-- siteColor: orangePunch_hover; #ec4d13; RGBA(236, 77, 19, 1) -->
      <!-- <feFuncR type="table" tableValues="0.1764705882 0.9254901961"></feFuncR>
      <feFuncG type="table" tableValues="0.3058823529 0.3019607843"></feFuncG>
      <feFuncB type="table" tableValues="0.3647058824 0.0745098039"></feFuncB> -->
    </feComponentTransfer>
  </filter>`
}

const svgStr = svg.svg(
  {
    xmlns:"http://www.w3.org/2000/svg",
    viewBox: [xmin, ymin, width, height].join(" "),
    width,
    height
  },
  filter(),
  // draw.light(lightPath),
  animateTriangles(draw.triangle, lightUp.bind(this, lightPath)),
  // draw.line(lightPath.start, lightPath.end, "red"),
  // , draw.lightCenter(lightPath)
);

fs.writeFile("./gems.svg", svgStr, err => {
  if (err) {
    return console.log(err);
  }
  process.exit();
});
