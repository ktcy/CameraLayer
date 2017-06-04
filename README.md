CameraLayer
===========

Framer layer displaying image from a camera device.

<br>

Requirements
------------

- [Framer](https://framer.com/) — This is optional if you are coding with [Framer Library](https://github.com/koenbok/Framer).
- [Google Chrome](https://www.google.com/chrome) — CameraLayer works only with the desktop or Android version of Google Chrome. Other web browsers and platforms are not supported.

<br>

Getting started
---------------

### 1. Install

Download **[CameraLayer.coffee](https://raw.githubusercontent.com/ktcy/CameraLayer/master/src/CameraLayer.coffee)**, and put it into the **modules** folder in your Framer prototype. ([Learn more about the modules](https://framer.com/docs/#modules.modules))

### 2. Code

Write the following code with Framer.

```coffee
# Load CameraLayer
CameraLayer = require "CameraLayer"

# Create a CameraLayer
camera = new CameraLayer()

# Start accessing a camera device
camera.start()
```

CameraLayer doesn't display anything in Framer's preview window at this time. You have to use Google Chrome to view your prototype. See the next step.

### 3. View

Open **http://localhost:8000/** with **Google Chrome**. You can see the list of your Framer prototypes, then choose the one which was coded in the step above.

<br>

Capture a still image
---------------------

### `capture()`

CameraLayer captures a still image by `capture()`. After the capturing is done, CameraLayer emits `capture` event with a URL of the captured image. You can use `onCapture` as a shortcut for the event.

```coffee
# Create layers
camera = new CameraLayer()
captureButton = new Layer()
imageView = new Layer()

camera.start()

# Capture an image when the button was clicked
captureButton.onClick ->
  camera.capture()

# Display the captured image when it becomes available
camera.onCapture (imageURL) ->
  imageView.image = imageURL
```

<br>

Record a video
--------------

### `startRecording()`, `stopRecording()`

CameraLayer starts video recording by `startRecording()`, and stops by `stopRecording()`. After the recording is done, CameraLayer emits `record` event with a URL of the recorded video. You can use `onRecord` as a shortcut for the event.

```coffee
# Create layers
camera = new CameraLayer()
recordButton = new Layer()
videoView = new VideoLayer()

camera.start()

# Record a video during pressing the button
recordButton.onTouchStart ->
  camera.startRecording()

recordButton.onTouchEnd ->
  camera.stopRecording()

# Display the recorded video when it becomes available
camera.onRecord (videoURL) ->
  videoView.video = videoURL
```

Size of the recorded video is depending on a camera device. It may not match with CameraLayer's width and height. To show the video with the same size as CameraLayer, set properties of `videoView` appeared in the example above as the following.

```coffee
videoView.clip = true
videoView.player.style.objectFit = 'cover'
```
