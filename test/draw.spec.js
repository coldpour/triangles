const paratest = require('paratest');
const expect = require('chai').expect;

const draw = require('../src/draw');

const tests = [
  {
    subject: draw.light,
    cases: [
      {
        name: "works",
        args: [{start:{time:0,x:1,y:2},end:{time:3,x:4,y:5},radius:6}],
        result: '<circle cx="4" cy="5" r="6" fill="yellow" opacity="0.5"><animate begin="0" dur="3" attributeName="cx" repeatCount="indefinite" values="1;4;1"/><animate begin="0" dur="3" attributeName="cy" repeatCount="indefinite" values="2;5;2"/></circle>'
      }
    ]
  }, {
    subject: draw.lightCenter,
    cases: [
      {
        name: "works",
        args: [{start:{time:0,x:1,y:2},end:{time:3,x:4,y:5},radius:6}],
        result: '<circle cx="4" cy="5" fill="blue" r="5"><animate begin="0" dur="3" attributeName="cx" repeatCount="indefinite" values="1;4;1"/><animate begin="0" dur="3" attributeName="cy" repeatCount="indefinite" values="2;5;2"/></circle>'
      }
    ]
  }, {
    subject: draw.animateCircle,
    cases: [
      {
        name: "works",
        args: [{start:{time:0,x:1,y:2},end:{time:3,x:4,y:5}}],
        result: [
          '<animate begin="0" dur="3" attributeName="cx" repeatCount="indefinite" values="1;4;1"/>',
          '<animate begin="0" dur="3" attributeName="cy" repeatCount="indefinite" values="2;5;2"/>'
        ]
      }
    ]
  }
];

paratest(
  "draw",
  tests,
  (expected, actual) => expect(actual).to.deep.equal(expected)
);
