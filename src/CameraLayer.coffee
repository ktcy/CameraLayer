class CameraLayer extends VideoLayer
  constructor: (options = {}) ->
    customProps =
      facing: true
      flipped: true
      autoFlip: true
      resolution: true
      fit: true

    baseOptions = Object.keys(options)
      .filter (key) -> !customProps[key]
      .reduce (clone, key) ->
        clone[key] = options[key]
        clone
      , { backgroundColor: 'transparent' }

    super(baseOptions)

    @_facing = options.facing ? 'back'
    @_flipped = options.flipped ? false
    @_autoFlip = options.autoFlip ? true
    @_resolution = options.resolution ? 720

    @_started = false
    @_stream = null
    @_scheduledRestart = null
    @_recording = null

    @clip = true

    @player.autoplay = true
    @player.muted = true
    @player.playsinline = true
    @player.style.objectFit = options.fit ? 'cover'

  @define 'facing',
    get: -> @_facing
    set: (facing) ->
      @_facing = if facing == 'front' then 'front' else 'back'
      @_setRestart()

  @define 'flipped',
    get: -> @_flipped
    set: (flipped) ->
      @_flipped = flipped
      @_setRestart()

  @define 'autoFlip',
    get: -> @_autoFlip
    set: (autoFlip) ->
      @_autoFlip = autoFlip
      @_setRestart()

  @define 'resolution',
    get: -> @_resolution
    set: (resolution) ->
      @_resolution = resolution
      @_setRestart()

  @define 'fit',
    get: -> @player.style.objectFit
    set: (fit) -> @player.style.objectFit = fit

  @define 'isRecording',
    get: -> @_recording?.recorder.state == 'recording'

  toggleFacing: ->
    @_facing = if @_facing == 'front' then 'back' else 'front'
    @_setRestart()

  capture: (width = @width, height = @height, ratio = window.devicePixelRatio) ->
    canvas = document.createElement("canvas")
    canvas.width = ratio * width
    canvas.height = ratio * height

    context = canvas.getContext("2d")
    @draw(context)

    url = canvas.toDataURL()
    @emit('capture', url)

    url

  draw: (context) ->
    return unless context

    cover = (srcW, srcH, dstW, dstH) ->
      scaleX = dstW / srcW
      scaleY = dstH / srcH
      scale = if scaleX > scaleY then scaleX else scaleY
      width: srcW * scale, height: srcH * scale

    {videoWidth, videoHeight} = @player

    clipBox = width: context.canvas.width, height: context.canvas.height
    layerBox = cover(@width, @height, clipBox.width, clipBox.height)
    videoBox = cover(videoWidth, videoHeight, layerBox.width, layerBox.height)

    x = (clipBox.width - videoBox.width) / 2
    y = (clipBox.height - videoBox.height) / 2

    context.drawImage(@player, x, y, videoBox.width, videoBox.height)

  start: ->
    constraints =
      video:
        facingMode: {ideal: if @_facing == 'front' then 'user' else 'environment'}
      audio:
        true

    @_getUserMedia(constraints).then (stream) =>
      @player.srcObject = stream
      @_started = true
      @_stream = stream
      @_flip()

    .catch (error) ->
      console.error(error)

  stop: ->
    @_started = false

    @player.pause()
    @player.srcObject = null

    @_stream?.getTracks().forEach (track) -> track.stop()
    @_stream = null

    if @_scheduledRestart
      cancelAnimationFrame(@_scheduledRestart)
      @_scheduledRestart = null

  startRecording: ->
    if @_recording
      @_recording.recorder.stop()
      @_recording = null

    chunks = []

    recorder = new MediaRecorder(@_stream, {mimeType: 'video/webm'})
    recorder.addEventListener 'start', (event) => @emit('startrecording')
    recorder.addEventListener 'dataavailable', (event) -> chunks.push(event.data)
    recorder.addEventListener 'stop', (event) =>
      blob = new Blob(chunks)
      url = window.URL.createObjectURL(blob)
      @emit('stoprecording')
      @emit('record', url)

    recorder.start()

    @_recording = {recorder, chunks}

  stopRecording: ->
    return if !@_recording
    @_recording.recorder.stop()
    @_recording = null

  onCapture: (callback) -> @on('capture', callback)
  onStartRecording: (callback) -> @on('startrecording', callback)
  onStopRecording: (callback) -> @on('stoprecording', callback)
  onRecord: (callback) -> @on('record', callback)

  _setRestart: ->
    return if !@_started || @_scheduledRestart

    @_scheduledRestart = requestAnimationFrame =>
      @_scheduledRestart = null
      @start()

  _flip: ->
    @_flipped = @_facing == 'user' if @_autoFlip
    x = if @_flipped then -1 else 1
    @player.style.webkitTransform = "scale(#{x}, 1)"

  _enumerateDevices: ->
    try
      navigator.mediaDevices.enumerateDevices()
    catch
      Promise.reject()

  _getUserMedia: (constraints) ->
    try
      navigator.mediaDevices.getUserMedia(constraints)
    catch
      Promise.reject()

module.exports = CameraLayer if module?
Framer.CameraLayer = CameraLayer
