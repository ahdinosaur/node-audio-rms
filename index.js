var zeros = require('zeros')
var through = require('through2')
var cwise = require('cwise')

module.exports = audioRms

function audioRms () {
  // supports rms over multiple channels
  
  var root = cwise({
    args: ['array'],
    body: function (x) {
      x = Math.sqrt(x)
    }
  })

  /*
  var mean = cwise({
    args: ['shape', 'index', 'array'],
    pre: function (shape) {
      this.length = shape[0]
      this.sum = zeros([this.length])
    },
    body: function (shape, index, array) {
      this.sum.set(index[0], array.get(index[0], index[i]))
    },
    post: function () {
      return this.sum / this.length
    }
  })
  */

  var mean = function mean (array) {
    var length = array.shape[0]
    var val = zeros([length])
    for (var i = 0; i < length; i++) {
      for (var j = 0; j < array.shape[1]; j++) {
        val.set(i, val.get(i) + array.get(i, j))
      }
      val.set(i, val.get(i) / length)
    }
    return val
  }

  var square = cwise({
    args: ['array'],
    body: function (x) {
      x = Math.pow(x, 2) || 0
    }
  })

  return through.obj(function (audio, enc, cb) {
    //var rms = zeros(audio.shape, audio.stride)
    square(audio)
//    console.log(audio)
    audio = mean(audio)
    root(audio)

    cb(null, audio)
    //root(mean(square(audio))))
  })
}

function mult (x, y) { return x * y }
