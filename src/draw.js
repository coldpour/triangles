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
  const str = svg.animate(Object.assign(opts, init));
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

function triangle({one, two, three, dur, color, keyTimes}) {
  let opts={}, children=[];
  const path = {
    d: `M${one.x},${one.y}L${two.x},${two.y}L${three.x},${three.y}z`
  };

  if(Array.isArray(color)) {
    if(color.every((c, i, a) => c === a[0])) {
      opts = {fill: color[0], stroke: color[0]};
    } else {
      opts = {fill: color[color.length - 1]};
      children = ["fill", "stroke"].map(attr => animate(attr, {
          keyTimes,
          dur,
          values: color
        }));
    }
  } else {
    opts = {fill: color};
  }
  return svg.path(Object.assign(opts, path), ...children);
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
