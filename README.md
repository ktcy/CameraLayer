CameraLayer
===========

Framer.js layer displaying camera image.

Working with Framer Studio
-----

1. Download [CameraLayer.coffee](https://raw.githubusercontent.com/ktcy/CameraLayer/master/src/CameraLayer.coffee), and place it into `modules` folder under your Framer Studio project. ([Details about Modules](http://framerjs.com/docs/#modules.modules))
2. Write a code.
  ```coffee
  # Load CameraLayer
  CameraLayer = require "CameraLayer"

  # Create a layer
  camera = new CameraLayer

  # Start accessing to the camera
  camera.start()
  ```
3. View your prototype with Google Chrome.

   **Note:**  
   Framer Studio doesn't support the camera access. You always have to view your prototype with Google Chrome.
   1. Click **Mirror** button in Framer Studio's toolbar.
   2. Click **Copy Link** in the menu.
   3. Paste the copied link into the location bar of Google Chrome.


Usage for non-Framer Studio environment
-----

Download [CameraLayer.js](https://github.com/ktcy/CameraLayer/tree/master/lib), and load it after framer.js.

CameraLayer is available under `Framer` namespace by loading the script:
```js
Utils.domLoadScriptSync('./CameraLayer.js');

var camera = new Framer.CameraLayer();
camera.start();
```

Also it can be loaded as a module:
```js
var CameraLayer = require('./CameraLayer');
var camera = new CameraLayer();
camera.start();
```
