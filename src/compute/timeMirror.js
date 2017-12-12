const roundPlaces = require('./roundPlaces');

module.exports = function (times) {
  let init = times.map(t => t/2);

  for(let i=init.length-1; i--; ) {
    const prev = init[i+1];
    const curr = init[i];
    const difference = prev - curr;
    const last = init[init.length-1];
    const added = roundPlaces(3, last + difference);

    init = init.concat(added);
  }
  return init;
};
