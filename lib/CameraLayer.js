(function() {
  var CameraLayer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CameraLayer = (function(_super) {
    __extends(CameraLayer, _super);

    function CameraLayer(options) {
      var baseOptions, customProps, _ref, _ref1, _ref2, _ref3, _ref4;
      if (options == null) {
        options = {};
      }
      customProps = {
        facing: true,
        flipped: true,
        autoFlip: true,
        resolution: true,
        fit: true
      };
      baseOptions = Object.keys(options).filter(function(key) {
        return !customProps[key];
      }).reduce(function(clone, key) {
        clone[key] = options[key];
        return clone;
      }, {});
      CameraLayer.__super__.constructor.call(this, baseOptions);
      this._facing = (_ref = options.facing) != null ? _ref : 'back';
      this._flipped = (_ref1 = options.flipped) != null ? _ref1 : false;
      this._autoFlip = (_ref2 = options.autoFlip) != null ? _ref2 : true;
      this._resolution = (_ref3 = options.resolution) != null ? _ref3 : 480;
      this._started = false;
      this._device = null;
      this._matchedFacing = 'unknown';
      this._stream = null;
      this._scheduledRestart = null;
      this.backgroundColor = 'transparent';
      this.player.src = '';
      this.player.autoplay = true;
      this.player.muted = true;
      this.player.style.objectFit = (_ref4 = options.fit) != null ? _ref4 : 'cover';
    }

    CameraLayer.define('facing', {
      get: function() {
        return this._facing;
      },
      set: function(facing) {
        this._facing = facing === 'front' ? facing : 'back';
        return this._setRestart();
      }
    });

    CameraLayer.define('flipped', {
      get: function() {
        return this._flipped;
      },
      set: function(flipped) {
        this._flipped = flipped;
        return this._setRestart();
      }
    });

    CameraLayer.define('autoFlip', {
      get: function() {
        return this._autoFlip;
      },
      set: function(autoFlip) {
        this._autoFlip = autoFlip;
        return this._setRestart();
      }
    });

    CameraLayer.define('resolution', {
      get: function() {
        return this._resolution;
      },
      set: function(resolution) {
        this._resolution = resolution;
        return this._setRestart();
      }
    });

    CameraLayer.define('fit', {
      get: function() {
        return this.player.style.objectFit;
      },
      set: function(fit) {
        return this.player.style.objectFit = fit;
      }
    });

    CameraLayer.prototype.toggleFacing = function() {
      this._facing = this._facing === 'front' ? 'back' : 'front';
      return this._setRestart();
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
      _ref = this.player, videoWidth = _ref.videoWidth, videoHeight = _ref.videoHeight;
      clipBox = {
        width: context.canvas.width,
        height: context.canvas.height
      };
      layerBox = cover(this.width, this.height, clipBox.width, clipBox.height);
      videoBox = cover(videoWidth, videoHeight, layerBox.width, layerBox.height);
      x = (clipBox.width - videoBox.width) / 2;
      y = (clipBox.height - videoBox.height) / 2;
      return context.drawImage(this.player, x, y, videoBox.width, videoBox.height);
    };

    CameraLayer.prototype.start = function() {
      return this._enumerateDevices().then((function(_this) {
        return function(devices) {
          var device, _i, _len;
          devices = devices.filter(function(device) {
            return device.kind === 'videoinput';
          });
          for (_i = 0, _len = devices.length; _i < _len; _i++) {
            device = devices[_i];
            if (device.label.indexOf(_this._facing) !== -1) {
              _this._matchedFacing = _this._facing;
              return device;
            }
          }
          _this._matchedFacing = 'unknown';
          if (devices.length > 0) {
            return devices[0];
          } else {
            return Promise.reject();
          }
        };
      })(this)).then((function(_this) {
        return function(device) {
          var constraints, _ref;
          if (!device || device.deviceId === ((_ref = _this._device) != null ? _ref.deviceId : void 0)) {
            return;
          }
          _this.stop();
          _this._device = device;
          constraints = {
            video: {
              mandatory: {
                minWidth: _this._resolution,
                minHeight: _this._resolution
              },
              optional: [
                {
                  sourceId: _this._device.deviceId
                }
              ]
            },
            audio: false
          };
          return _this._getUserMedia(constraints).then(function(stream) {
            _this.player.src = URL.createObjectURL(stream);
            _this._started = true;
            _this._stream = stream;
            return _this._flip();
          });
        };
      })(this))["catch"](function(error) {
        return console.error(error);
      });
    };

    CameraLayer.prototype.stop = function() {
      var _ref;
      this._started = false;
      this.player.pause();
      this.player.src = '';
      if ((_ref = this._stream) != null) {
        _ref.getTracks().forEach(function(track) {
          return track.stop();
        });
      }
      this._stream = null;
      this._device = null;
      if (this._scheduledRestart) {
        cancelAnimationFrame(this._scheduledRestart);
        return this._scheduledRestart = null;
      }
    };

    CameraLayer.prototype._setRestart = function() {
      if (!this._started || this._scheduledRestart) {
        return;
      }
      return this._scheduledRestart = requestAnimationFrame((function(_this) {
        return function() {
          _this._scheduledRestart = null;
          return _this.start();
        };
      })(this));
    };

    CameraLayer.prototype._flip = function() {
      var x;
      if (this._autoFlip) {
        this._flipped = this._matchedFacing === 'front';
      }
      x = this._flipped ? -1 : 1;
      return this.player.style.webkitTransform = "scale(" + x + ", 1)";
    };

    CameraLayer.prototype._enumerateDevices = function() {
      try {
        return navigator.mediaDevices.enumerateDevices();
      } catch (_error) {
        return Promise.reject();
      }
    };

    CameraLayer.prototype._getUserMedia = function(constraints) {
      return new Promise(function(resolve, reject) {
        var gum;
        try {
          gum = navigator.getUserMedia || navigator.webkitGetUserMedia;
          return gum.call(navigator, constraints, resolve, reject);
        } catch (_error) {
          return reject();
        }
      });
    };

    return CameraLayer;

  })(VideoLayer);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = CameraLayer;
  }

  Framer.CameraLayer = CameraLayer;

}).call(this);

//# sourceMappingURL=CameraLayer.js.map
