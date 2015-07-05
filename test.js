var test = require('tape')
var generateAudio = require('ndsamples-generate')
var through = require('through2')
var almostEqual = require('almost-equal')
var range = require('lodash.range')
var fract = require('fract')

var audioRms = require('./')

test('rms of generated waves', function (t) {
  var testsPerFixture = 4
  var freq = 440

  // fixtures taken from https://en.wikipedia.org/wiki/Root_mean_square
  var fixtures = [
    [ // constant
      function constant (t) {
        return 1
      },
      1
    ],
    [ // sine wave
      function sine (t) {
        return Math.sin(2 * Math.PI * freq * t)
      },
      1 / Math.sqrt(2)
    ],
    [ // square wave
      function square (t) {
        return fract(freq * t) > 0.5 ? 1 : -1
      },
      1
    ],
    [ // modified square wave
      function modifiedSquare (t) {
        var n = fract(freq * t)
        if (n < 0.25) {
          return 0
        } else if (n < 0.50) {
          return 1
        } else if (n < 0.75) {
          return 0
        } else {
          return 1
        }
      },
      1 / Math.sqrt(2)
    ],
    [ // triangle wave
      function triangle (t) {
        return Math.abs(2 * fract(freq * t) - 1)
      },
      1 / Math.sqrt(3)
    ],
    [ // sawtooth wave
      function sawtooth (t) {
        return 2 * fract(freq * t) - 1
      },
      1 / Math.sqrt(3)
    ]
  ]

  t.plan(fixtures.length * testsPerFixture)

  fixtures.forEach(function (fixture) {
    var seen = 1
    generateAudio({
      fn: fixture[0]
    })
    .pipe(audioRms())
    .pipe(through.obj(function (rms, enc, cb) {
      var actual = rms.data[0]
      var expected = fixture[1]
      t.ok(
        almostEqual(actual, expected, 0.01),
        fixture[0].name + " has expected rms of " + expected
      )
      if (seen < testsPerFixture) {
        seen++
        cb()
      }
    }))
  })
})
