const roundPlaces = require('./roundPlaces')

module.exports = function (darkColor, lightColor) {
  return [darkColor, lightColor].map((color) => 
    roundPlaces(10, color/255)
  ).join(' ')
};
