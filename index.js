var zeros = require('zeros')
var through = require('through2')
var ops = require('ndarray-ops')
var fill = require('ndarray-fill')

module.exports = audioRms

function audioRms () {
  // supports rms over multiple channels

  function root (audio) {
    ops.sqrteq(audio)
    return audio
  }

  function mean (audio) {
    var meanShape = audio.shape.slice(0, audio.shape.length - 1)
    var sum = zeros(meanShape, audio.dtype)

    fill(sum, function () {
      arguments[arguments.length] = null
      return ops.sum(audio.pick.apply(audio, arguments))
    })

    ops.divseq(sum, audio.shape[audio.shape.length - 1])
    
    return sum
  }

  function square (audio) {
    ops.powseq(audio, 2)
    return audio
  }

  return through.obj(function (audio, enc, cb) {
    cb(null, root(mean(square(audio))))
  })
}
