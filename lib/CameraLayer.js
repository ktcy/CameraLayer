(function() {
  var CameraLayer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CameraLayer = (function(_super) {
    var _ref;

    __extends(CameraLayer, _super);

    function CameraLayer(options) {
      if (options == null) {
        options = {};
      }
      CameraLayer.__super__.constructor.call(this, options);
      this._camera = null;
      this._stream = null;
      this._video = document.createElement("video");
      this._video.autoplay = true;
      this._video.muted = true;
      _.extend(this._video.style, {
        width: "100%",
        height: "100%",
        objectFit: "cover"
      });
      this._element.appendChild(this._video);
      this.autoflip = true;
      this.facing = "environment";
      this.clip = true;
      this.backgroundColor = "rgba(0, 0, 0, 1.0)";
    }

    CameraLayer.define("facing", {
      get: function() {
        return this._facing;
      },
      set: function(value) {
        if (value === "user" || value === "environment") {
          return this._facing = value;
        }
      }
    });

    CameraLayer.define("autoflip", {
      get: function() {
        return this._autoflip;
      },
      set: function(value) {
        return this._autoflip = !!value;
      }
    });

    CameraLayer.prototype.toggleFacing = function() {
      switch (this.facing) {
        case "user":
          return this.facing = "environment";
        case "environment":
          return this.facing = "user";
      }
    };

    CameraLayer.prototype.capture = function(width, height, ratio) {
      var canvas, context;
      if (width == null) {
        width = this.width;
      }
      if (height == null) {
        height = this.height;
      }
      if (ratio == null) {
        ratio = window.devicePixelRatio;
      }
      canvas = document.createElement("canvas");
      canvas.width = ratio * width;
      canvas.height = ratio * height;
      context = canvas.getContext("2d");
      this.draw(context);
      return canvas.toDataURL("image/png");
    };

    CameraLayer.prototype.draw = function(context) {
      var clipBox, cover, layerBox, videoBox, videoHeight, videoWidth, x, y, _ref;
      if (!context) {
        return;
      }
      cover = function(srcW, srcH, dstW, dstH) {
        var scale, scaleX, scaleY;
        scaleX = dstW / srcW;
        scaleY = dstH / srcH;
        scale = scaleX > scaleY ? scaleX : scaleY;
        return {
          width: srcW * scale,
          height: srcH * scale
        };
      };
      _ref = this._video, videoWidth = _ref.videoWidth, videoHeight = _ref.videoHeight;
      clipBox = {
        width: context.canvas.width,
        height: context.canvas.height
      };
      layerBox = cover(this.width, this.height, clipBox.width, clipBox.height);
      videoBox = cover(videoWidth, videoHeight, layerBox.width, layerBox.height);
      x = (clipBox.width - videoBox.width) / 2;
      y = (clipBox.height - videoBox.height) / 2;
      return context.drawImage(this._video, x, y, videoBox.width, videoBox.height);
    };

    CameraLayer.prototype.start = function() {
      return MediaStreamTrack.getSources((function(_this) {
        return function(sources) {
          var camera, newId, oldId, _ref;
          camera = _.findWhere(sources, {
            kind: "video",
            facing: _this._facing
          });
          if (camera == null) {
            camera = _.findWhere(sources, {
              kind: "video"
            });
          }
          oldId = (_ref = _this._camera) != null ? _ref.id : void 0;
          newId = camera != null ? camera.id : void 0;
          if (newId === oldId) {
            return;
          }
          _this._camera = camera;
          return _this._requestCamera();
        };
      })(this));
    };

    CameraLayer.prototype._requestCamera = function() {
      var _ref;
      this._video.src = '';
      if ((_ref = this._stream) != null) {
        _ref.stop();
      }
      return this._getUserMedia({
        video: true,
        audio: true
      }, (function(_this) {
        return function(stream) {
          _this._stream = stream;
          _this._video.src = URL.createObjectURL(stream);
          return _this._flip();
        };
      })(this), (function(_this) {
        return function(error) {
          return console.error(error);
        };
      })(this));
    };

    CameraLayer.prototype._getUserMedia = ((_ref = navigator.getUserMedia) != null ? _ref : navigator.webkitGetUserMedia).bind(navigator);

    CameraLayer.prototype._flip = function() {
      var x;
      x = this._camera.facing === "user" ? -1 : 1;
      return this._video.style.webkitTransform = "scale(" + x + ",1)";
    };

    CameraLayer.prototype._supportUserMedia = function() {
      var createObjectURL, getUserMedia, _ref1, _ref2;
      getUserMedia = (_ref1 = navigator.getUserMedia) != null ? _ref1 : navigator.webkitGetUserMedia;
      createObjectURL = (_ref2 = window.URL) != null ? _ref2.createObjectURL : void 0;
      return _.isFunction(getUserMedia) && _.isFunction(createObjectURL);
    };

    return CameraLayer;

  })(Layer);

  Framer.CameraLayer = CameraLayer;

}).call(this);

//# sourceMappingURL=CameraLayer.js.map
