const svg = require('jssvg');

function animate(attributeName, {keyTimes, values, ...rest}) {
  let opts = {};
  let init = {
    ...rest,

    attributeName,
    repeatCount: "indefinite",
    values: values.join(";")
  };
  if(keyTimes && Array.isArray(keyTimes)) {
    opts = {
      keyTimes: keyTimes.join(";")
    };
  }
  const str =  svg.animate(Object.assign(opts, init));
  return str;
}

function line(one, two, color) {
  return svg.path(
    {
      d: `M${one.x},${one.y}L${two.x},${two.y}z`,
      stroke: color
    }
  );
}

function triangle({start, fill, id, one, two, three, dur, color, keyTimes, centroid, brightest, illuminationPoint, extinguishPoint}) {
  let opts={}, children=[];
  const path = {
    fill,
    d: `M${one.x},${one.y}L${two.x},${two.y}L${three.x},${three.y}z`
  };

  if(Array.isArray(color)) {
    if(color.every((c, i, a) => c === a[0])) {
      opts = {fill: color[0], stroke: color[0]};
    } else {
      children = [
        animate("stroke", {
          keyTimes,
          dur,
          values: color
        }),
        animate("fill", {
          keyTimes,
          dur,
          values: color
        })
      ];
    }
  } else {
    opts = {fill: color};
  }
  const tri = svg.path(Object.assign(opts, path), ...children);
  const ill = line(centroid, illuminationPoint, "green");
  const ext = line(centroid, extinguishPoint, "cyan");
  const proj = line(centroid, brightest.point, "orange");
  const dist = line(start, brightest.point, "purple");
  return [tri, ill, ext, proj, dist].join("");
  // return tri;
}

function animateCircle({start, end}) {
  return ['x', 'y'].map((c) => (
    animate(`c${c}`, {
      values: [start[c], end[c], start[c]],
      begin: start.time,
      dur: end.time - start.time
    })
  ));
}

function light(lightPath) {
  return svg.circle(
    {
      cx: lightPath.end.x,
      cy: lightPath.end.y,
      r: lightPath.radius,
      fill: "yellow",
      opacity: "0.5"
    },
    ...animateCircle(lightPath));
}

function lightCenter(lightPath) {
  return svg.circle(
    {
      cx: lightPath.end.x,
      cy: lightPath.end.y,
      fill: "blue",
      r: 5
    },
    ...animateCircle(lightPath));
}

module.exports = {
  animate,
  animateCircle,
  light,
  lightCenter,
  line,
  triangle
};
