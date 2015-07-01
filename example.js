var through = require('through2')
var audioReadStream = require('read-audio')
var frameHop = require('frame-hop')
var audioRms = require('./')
var Ndarray = require('ndarray')

audioReadStream()
/*
.pipe(through.obj(function (audio, enc, cb) {
  cb(null, audio.data)
}))
.pipe(frameHop({
  frameSize: 4096,
  hopSize: 4096
}))
.pipe(through.obj(function (frame, enc, cb) {
  cb(null, Ndarray(frame, [1, frame.length]))
}))
*/
.pipe(audioRms())
.pipe(through.obj(function (rms, enc, cb) {
  console.log(rms.data[0])
  cb(null)
}))
