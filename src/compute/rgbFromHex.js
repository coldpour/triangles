const clamp = require('./clamp');
const lerp = require('./lerp');
// const padColor = require('./padColor');

module.exports = function (hex) {
  hexValues = hex.replace('#', '')
  r = parseInt(hexValues.substring(0,2), 16)
  g = parseInt(hexValues.substring(2,4), 16)
  b = parseInt(hexValues.substring(4,6), 16)
  return { r, g, b  }
  // const whiteness = lerp(maxBrightness, 0, 100, 0, 255);
  // const newValue = Math.round(clamp(0, whiteness, lerp(distance, diffusionRadius, 0, 0, whiteness)));
  // const hex = newValue.toString(16);
  // return padColor(hex);
};
