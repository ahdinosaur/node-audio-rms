var zeros = require('zeros')
var through = require('through2')
var cwise = require('cwise')

module.exports = audioRms

function audioRms () {
  // supports rms over multiple channels

  var rootOp = cwise({
    args: ['array'],
    body: function (x) {
      x = Math.sqrt(x)
    }
  })

  function root (audio) {
    rootOp(audio)
    return audio
  }

  var sumOp = cwise({
    args: ['array', 'array'],
    body: function (sum, val) {
      sum += val
    }
  })
  
  var divOp = cwise({
    args: ['array', 'scalar'],
    body: function (a, s) {
      a /= s
    }
  })

  function mean (audio) {
    var meanShape = audio.shape.slice(0, audio.shape.length - 1)
    var sum = zeros(meanShape, audio.dtype)

    sumOp(sum, audio)
    divOp(sum, audio.shape[audio.shape.length - 1])
    
    return sum
  }

  var squareOp = cwise({
    args: ['array'],
    body: function (x) {
      x = Math.pow(x, 2)
    }
  })

  function square (audio) {
    squareOp(audio)
    return audio
  }

  return through.obj(function (audio, enc, cb) {
    cb(null, root(mean(square(audio))))
  })
}

function mult (x, y) { return x * y }
