var through = require('through2')
var audioReadStream = require('read-audio')
var frameHop = require('frame-hop')
var audioRms = require('./')
var Ndarray = require('ndarray')
var terminalBar = require('terminal-bar')

var audio = audioReadStream({
  buffer: 256
})

audio
.pipe(audioRms())
.pipe(through.obj(function (audio, enc, cb) {
  cb(null, audio.data)
}))
.pipe(frameHop({
  frameSize: 128,
  hopSize: 1
}))
.pipe(through.obj(function (data, enc, cb) {
  var arr = [].slice.call(data)
  console.log(terminalBar(arr, {
    width: process.stdout.columns - 1,
    height: process.stdout.rows
  }))
  cb(null)
}))
