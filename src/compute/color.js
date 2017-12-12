const clamp = require('./clamp');
const lerp = require('./lerp');
const padColor = require('./padColor');

module.exports = function (maxBrightness, diffusionRadius, distance) {
  const whiteness = lerp(maxBrightness, 0, 100, 0, 255);
  const newValue = Math.round(clamp(0, whiteness, lerp(distance, diffusionRadius, 0, 0, whiteness)));
  const hex = newValue.toString(16);
  return padColor(hex);
};
