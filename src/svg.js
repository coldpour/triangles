function spreadAttrs(attrs) {
  return Object.keys(attrs).map(key => {
    const str = `${key}="${attrs[key]}"`;
    return str;
  }).join(" ");
}

function tag(name) {
  return function(attrs, ...children) {
    return `<${name} ${spreadAttrs(attrs)}`
      + (children && children.length > 0
         ? `>${children.join("")}</${name}>`
         : '/>');
  };
}

module.exports = {
  animate: tag("animate"),
  circle: tag("circle"),
  path: tag("path"),
  svg: tag("svg"),
  symbol: tag("symbol")
};
