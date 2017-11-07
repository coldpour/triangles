module.exports = function mesh(num, width, height) {
  const verticies = [],
        area = Math.sqrt(width * height / num / 2);
  console.log(area);

  for (let i=0, row=1; i<num; row++) {
    for (let offset=0; offset<width; i++, offset+=area) {
      const x = offset + Math.random() * area,
            y = row * Math.random() * area,
            v = `${x} ${y}`;
      console.log(v);
      verticies[i] = [x, y];
    }
  }
  return verticies;
};
