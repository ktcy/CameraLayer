class CanvasLayer extends Layer
    constructor: (options = {}) ->
        super options

        @_canvas = document.createElement "canvas"
        context = @_canvas.getContext "2d"
        ratio = window.devicePixelRatio / context.webkitBackingStorePixelRatio

        @_canvas.width = ratio * @width
        @_canvas.height = ratio * @height

        _.extend @_canvas.style,
            position: "absolute"
            width: "100%"
            height: "100%"

        @_element.appendChild @_canvas

    @define "context",
        get: -> @_canvas.getContext "2d"

camera = new CameraLayer
camera.start()

Screen.on "resize", ->
    camera.width = Math.min 640, Screen.width
    camera.height = Math.min 480, Screen.height
    camera.center()
