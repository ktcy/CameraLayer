CameraLayer
===========

Framer.js layer displaying camera image.

Working with Framer Studio
-----

1. **Download [CameraLayer.coffee](https://raw.githubusercontent.com/ktcy/CameraLayer/master/src/CameraLayer.coffee).**

   Place it into `modules` folder under your Framer Studio project. ([details](http://framerjs.com/docs/#modules.modules))

2. **Write a code.**
  ```coffee
  # Load CameraLayer
  CameraLayer = require "CameraLayer"

  # Create a layer
  camera = new CameraLayer

  # Start accessing to the camera
  camera.start()
  ```
  But nothing happens in Framer Studio. See the next step.

3. **View your prototype with Google Chrome.**

   Framer Studio doesn't support the camera access. You always have to view your prototype with Google Chrome.

   **Instructions:**
   1. Click **Mirror** button in Framer Studio's toolbar.
   2. Click **Copy Link** in the menu.
   3. Paste the copied link into the location bar of Google Chrome, then replace the IP address such like `x.x.x.x:8000` to `localhost:8000` (\*), and press enter.

   \* From version 47, Google Chrome deprecates the camera access from insecure origins. This means that your prototype have to be hosted by HTTPS or localhost.
