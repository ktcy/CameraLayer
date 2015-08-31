CameraLayer
===========

Framer.js layer displaying camera image.


Usage
-----

CameraLayer becomes available under `Framer` namespace by loading the script:
```js
Utils.domLoadScriptSync('./CameraLayer.js');

var camera = new Framer.CameraLayer();
camera.start();
```

CameraLayer also can be loaded as a module:
```js
var CameraLayer = require('./CameraLayer');
var camera = new CameraLayer();
camera.start();
```
