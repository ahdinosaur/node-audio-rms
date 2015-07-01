var defined = require('defined')
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

  var mean = cwise({
    args: ['shape', 'index', 'array'],
    pre: function (shape) {
      this.length = shape.reduce(shape[0])
      this.sum = zeros([shape[0]])
    },
    body: function (shape, index, array) {
      this.sum.set(index[0], array.get(index[0], index[i]))
    },
    post: function () {
      return this.sum / this.length
    }
  })

  var square = cwise({
    args: ['array'],
    body: function (x) {
      x *= x
    }
  })

  return through.obj(function (audio, enc, cb) {
    cb(null, root(mean(square(audio))))
  })
  /*
    // default last rms
    var rms = zeros(audio.shape, audio.dtype)

    for (let a = 0; a < shape[0]; a++) {
      for (let b = 0; b < shape[1] b++) {
        lastRms = getLastRms(lastRms, [a, b])
        


      }
    }
    
    var rms = audio 


  }*/
}

function mult (x, y) { return x * y }

/*
function getLastRms (lastRms, path) {
  lastRms[path[0]] = lastRms[path[0]] || []
  lastRms[path[0]][path[1]] = lastRms[path[0]][path[1]] || 0
  return lastRms
}
*/
