class CameraLayer extends Layer
    constructor: (options = {}) ->
        super options

        @_stream = null
        @_video = document.createElement "video"
        @_element.appendChild @_video

        _.extend @_video.style,
            position: "absolute"
            width: "100%"
            height: "100%"
            objectFit: "cover"

        @_video.addEventListener "canplaythrough", =>
            @_video.play()

        @autoflip = true
        @flipped = options.flip ? false
        @facing = "environment"
        @clip = true;
        @backgroundColor = "rgba(0, 0, 0, 1.0)"

    @define "facing",
        get: -> @_facing
        set: (value) ->
            @_facing = value
            @flipped = @_facing is "user" if @_autoflip
            @_facing

    @define "autoflip",
        get: -> @_autoflip
        set: (value) -> @_autoflip = !!value

    @define "flipped",
        get: -> @_flipped
        set: (value) ->
            flipped = !!value
            x = if flipped then -1 else 1
            @_video.style.webkitTransform = "scale(" + x + ",1)"
            @_flipped = flipped

    start: ->
        @_video.src = null
        @_stream?.stop()

        MediaStreamTrack.getSources (sources) =>
            camera = _.findWhere sources, kind:"video", facing:@_facing
            camera ?= _.findWhere sources, kind:"video"

            navigator.webkitGetUserMedia?(
                video:
                    optional:
                        [sourceId:camera.id]
                    mandatory:
                        minWidth: 1920
                        minHeight: 1080
                (stream) =>
                    @_stream = stream
                    @_video.src = URL.createObjectURL stream
                (error) =>
                    alert err
            )

camera = new CameraLayer
camera.start()

layout = ->
    camera.width = Screen.width
    camera.height = Screen.height
    camera.center()

layout()
Screen.on "resize", layout

camera.on Events.Click, ->
    switch @facing
        when "user" then @facing = "environment"
        when "environment" then @facing = "user"

    @start()

