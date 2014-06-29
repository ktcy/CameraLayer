class CameraLayer extends Layer
    constructor: (options = {}) ->
        super options

        @_video = document.createElement "video"
        @_element.appendChild @_video

        _.extend @_video.style,
            position: "absolute"
            width: "100%"
            height: "100%"
            objectFit: "cover"

        @_video.addEventListener "canplaythrough", =>
            @_video.play()

        @backgroundColor = "rgba(0, 0, 0, 1.0)"
        @flip = options.flip ? false
        @clip = true;

    @define "flip",
        get: -> @_flip
        set: (value) ->
            flip = !!value
            x = if flip then -1 else 1
            @_video.style.webkitTransform = "scale(" + x + ",1)"
            @_flip = flip

    start: ->
        navigator.webkitGetUserMedia?(
            video:
                mandatory:
                    minWidth: 1920
                    minHeight: 1080
            (stream) =>
                @_video.src = URL.createObjectURL stream
            (error) =>
                alert err
        )

    @getCameras: (callback) ->
        MediaStreamTrack.getSources (sources) ->
            cameras = sources.filter (source) ->
                source.kind is "video"
            callback cameras

# CameraLayer.getCameras (cameras) -> console.log cameras

camera = new CameraLayer flip:true
camera.start()

layout = ->
    camera.width = Screen.width
    camera.height = Screen.height
    camera.center()

layout()
Screen.on "resize", layout

camera.states.animationOptions =
    curve: "spring"
    curveOptions:
        tension: 500

camera.states.add
    zoomed: { scale: 1.5 }

camera.on Events.Click, ->
    this.states.next()
