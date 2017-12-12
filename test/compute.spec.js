const paratest = require('paratest');
const expect = require('chai').expect;

const compute = require('../src/compute');

const tests = [
  {
    subject: compute.roundPlaces,
    cases: [
      {
        name: "works with more",
        args: [1, 10.25],
        result: 10.3
      }, {
        name: "works with less",
        args: [2, 10.5],
        result: 10.5
      }, {
        name: "works with ints",
        args: [1, 10],
        result: 10
      }, {
        name: "works with zero",
        args: [0, 10.876],
        result: 11
      }
    ]
  }, {
    subject: compute.clamp,
    cases: [
      {
        name: "works inside",
        args: [0, 10, 5],
        result: 5
      }, {
        name: "works above",
        args: [0, 10, 15],
        result: 10
      }, {
        name: "works below",
        args: [0, 10, -5],
        result: 0
      }
    ]
  }, {
    subject: compute.distance,
    cases: [
      {
        name: "works",
        args: [{x:0, y:0}, {x:0, y:5}],
        result: 5
      }, {
        name: "doesn't return negatives",
        args: [{x:5, y:0}, {x:0, y:0}],
        result: 5
      }
    ]
  }, {
    subject: compute.pointOnLine,
    cases: [
      {
        name: "works",
        args: [{x:0, y:0}, {x:2, y:0}, {x:1, y:1}],
        result: {x:1, y:0}
      }, {
        name: "when point is outside segment",
        args: [{x:0, y:0}, {x:2, y:0}, {x:3, y:1}],
        result: {x:3, y:0}
      }
    ]
  }, {
    subject: compute.color,
    cases: [
      {
        name: "works at no distance",
        args: [100, 700, 0],
        result: "#fff"
      }, {
        name: "works at some distance",
        args: [100, 700, 350],
        result: "#808080"
      }, {
        name: "works with all single digit hex",
        args: [100, 700, 673],
        result: "#0a0a0a"
      }, {
        name: "works at great distance",
        args: [100, 700, 1050],
        result: "#000"
      }
    ]
  }, {
    subject: compute.centroid,
    cases: [
      {
        name: "works",
        args: [{x:15, y:15}, {x:47, y:40}, {x:65,y:20}],
        result: {x:42, y:25}
      }, {
        name: "works still",
        args: [{x:19, y:13}, {x:25, y:42}, {x:-5,y:28}],
        result: {x:13, y:28}
      }
    ]
  }, {
    subject: compute.lerp,
    cases: [
      {
        name: "works",
        args: [50, 0, 100, 0, 16],
        result: 8
      }, {
        name: "rounds appropriately",
        args: [45, 0, 100, 0, 16],
        result: 7.2
      }, {
        name: "lower",
        args: [-10, 0, 100, 0, 16],
        result: -1.6
      }, {
        name: "another",
        args: [600, 700, 0, 0, 15],
        result: 2.142857142857143
      }, {
        name: "higher",
        args: [800, 700, 0, 0, 15],
        result: -2.142857142857143
      }
    ]
  }, {
    subject: compute.padColor,
    cases: [
      {
        name: "works",
        args: ["ff"],
        result: "#fff"
      }, {
        name: "works",
        args: ["f"],
        result: "#0f0f0f"
      }
    ]
  }, {
    subject: compute.timeMirror,
    cases: [
      {
        name: "works",
        args: [[0, 0.2, 0.9, 1]],
        result: [0, 0.1, 0.45, 0.5, 0.55, 0.9, 1]
      }, {
        name: "fewer",
        args: [[0, 0.2, 1]],
        result: [0, 0.1, 0.5, 0.9, 1]
      }, {
        name: "fewer still",
        args: [[0, 1]],
        result: [0, 0.5, 1]
      }, {
        name: "specific case",
        args: [[0, 0.09, 1]],
        result: [0, 0.045, 0.5, 0.955, 1]
      }
    ]
  }, {
    subject: compute.colorMirror,
    cases: [
      {
        name: "works",
        args: [["#000", "#fff", "#111"]],
        result: ["#000", "#fff", "#111", "#fff", "#000"]
      }, {
        name: "with just one",
        args: [["#000"]],
        result: ["#000"]
      }
    ]
  }, {
    subject: compute.allSame,
    cases: [
      {
        name: "right",
        args: ["aaaaaaaaaa"],
        result: true
      }, {
        name: "wrong",
        args: ["#000"],
        result: false
      }
    ]
  }, {
    subject: compute.slope,
    cases: [
      {
        name: "up",
        args: [{x:500, y:0},{x:1000, y:700}],
        result: 1.4
      }, {
        name: "down",
        args: [{x:0, y:700},{x:500, y:0}],
        result: -1.4
      }, {
        name: "vertical up",
        args: [{x:0, y:0},{x:0, y:100}],
        result: Infinity
      }, {
        name: "vertical down",
        args: [{x:0, y:100},{x:0, y:0}],
        result: -Infinity
      }, {
        name: "horizontal right",
        args: [{x:0, y:0},{x:500, y:0}],
        result: 0
      }, {
        name: "horizontal left",
        args: [{x:100, y:0},{x:0, y:0}],
        result: -0
      }
    ]
  }, {
    subject: compute.surroundingPoints,
    cases: [
      {
        name: "works",
        args: [{x:0, y:0}, 5, 4/3],
        result: {
          negative: {
            x: -3,
            y: -4
          },
          positive: {
            x: 3,
            y: 4
          }
        }
      }
    ]
  }, {
    subject: compute.pythagoreanA,
    cases: [
      {
        name: "get A",
        args: [4, 5],
        result: 3
      }, {
        name: "get B",
        args: [3, 5],
        result: 4
      }, {
        name: "C first",
        args: [5, 3],
        result: 4
      }
    ]
  }, {
    subject: compute.rise,
    cases: [
      {
        name: "works",
        args: [5, (4/3)],
        result: 4
      }, {
        name: "works",
        args: [10, 1.0069419071976617],
        result: 7.0954838197844055
      }
    ]
  }, {
    subject: compute.run,
    cases: [
      {
        name: "works",
        args: [5, (4/3)],
        result: 3
      }
    ]
  }
];

paratest(
  "compute",
  tests,
  (expected, actual) => expect(actual).to.deep.equal(expected)
);
