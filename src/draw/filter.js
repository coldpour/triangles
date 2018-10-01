const svg = require('jssvg');
const {rgbFromHex, tableValues} = require('../compute');

module.exports = function (darkColor, lightColor) {
  return svg.filter({
    id: "duotone_peachypink"
  },
//   svg.feColorMatrix({
//     type: "matrix",
//     result: "grayscale",
//     values="1 -.5 -.5 1 -.5
//   1 -.5 -.5 -.5
//   1 0 0 1 0
//   0 0 0 1 0"
// }, undefined),
  svg.feComponentTransfer({
    'color-interpolation-filters': "sRGB",
    result: "duotone"
  },
  ['r', 'g', 'b'].map(channel => svg[`feFunc${channel.toUpperCase()}`]({
    type: "table",
    tableValues: tableValues(rgbFromHex(darkColor)[channel], rgbFromHex(lightColor)[channel])
  })))
  )
};
