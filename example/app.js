var camera = new Framer.CameraLayer();
camera.start();

Screen.on("resize", layout);
layout();

function layout() {
    camera.width = Math.min(640, Screen.width);
    camera.height = Math.min(480, Screen.height);
    camera.center();
}
