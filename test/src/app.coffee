CameraLayer = require('CameraLayer')

camera = new CameraLayer(backgroundColor: '#000')
imageView = new Layer()
videoView = new VideoLayer(clip: true)

videoView.player.style.objectFit = 'cover'

createButton = (text) ->
  normalColor = 'rgba(0, 0, 0, 0.5)'
  pressedColor = 'rgba(0, 0, 0, 1.0)'

  layer = new TextLayer
    text: text
    fontSize: 32
    color: normalColor

  layer.onTouchStart -> @color = pressedColor
  layer.onTouchEnd -> @color = normalColor

  layer

startButton = createButton('START')
captureButton = createButton('CAPTURE')
recordButton = createButton('RECORD')

captureButton.onClick ->
  camera.capture()

startButton.onClick ->
  camera.start()

camera.onCapture (imageURL) ->
  imageView.image = imageURL

recordButton.onTouchStart ->
  videoView.player.muted = true
  camera.startRecording()

recordButton.onTouchEnd ->
  videoView.player.muted = false
  camera.stopRecording()

camera.onRecord (videoURL) ->
  videoView.video = videoURL
  videoView.player.play()

layout = ->
  camera.props =
    width: 300, height: 300
    x: 20, y: 20

  imageView.props =
    size: camera.size
    x: camera.x, y: camera.maxY + 20

  videoView.props =
    size: camera.size
    x: imageView.maxX + 20, y: camera.maxY + 20

  startButton.props =
    x: camera.maxX + 40, y: camera.minY + 20

  captureButton.props =
    x: camera.maxX + 40, y: startButton.maxY + 20

  recordButton.props =
    x: camera.maxX + 40, y: captureButton.maxY + 20

layout()
