const expect = require("chai").expect;

module.exports = function test(name, tests) {
  return describe(name, () => {
    tests.forEach(test => {
      describe(test.subject.name, () => {
        test.cases.forEach(c => {
          it(c.name, () => {
            expect(test.subject(...c.args)).to.deep.equal(c.result);
          });
        });
      });
    });
  });
};
