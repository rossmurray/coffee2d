(function() {

  window.Component = (function() {

    function Component(x, y, w, h) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      if (w == null) w = 0;
      if (h == null) h = 0;
      this.position = {
        x: x,
        y: y
      };
      this.size = {
        w: w,
        h: h
      };
      this.setSize(w, h);
      this.isMouseOver = false;
      this.children = [];
      this.listeners = [];
      this.keyDownHandlers = [];
      this.zIndex = 0;
      this.addListener('resize', this.onResize.bind(this));
      this.addListener('mouseMoveScene', this.onMouseMove.bind(this));
    }

    Component.prototype.onResize = function() {
      var c, ch, cw, h, w, _i, _len, _ref;
      w = this.size.w;
      h = this.size.h;
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        cw = c.position.x + c.size.w;
        ch = c.position.y + c.size.h;
        if (cw > w) w = cw;
        if (ch > h) h = ch;
      }
      return this.size = {
        w: w,
        h: h
      };
    };

    Array.prototype.remove = function(e) {
      var t, _ref;
      if ((t = this.indexOf(e)) > -1) {
        return ([].splice.apply(this, [t, t - t + 1].concat(_ref = [])), _ref);
      }
    };

    Component.prototype.onMouseMove = function(evt) {
      var newEvt;
      if (!this.isMouseOver && this.containsPoint(evt.x, evt.y)) {
        this.isMouseOver = true;
        newEvt = {
          type: 'mouseOver',
          x: evt.x,
          y: evt.y
        };
        return this.dispatchEvent(newEvt);
      } else if (this.isMouseOver && !this.containsPoint(evt.x, evt.y)) {
        this.isMouseOver = false;
        newEvt = {
          type: 'mouseOut',
          x: evt.x,
          y: evt.y
        };
        return this.dispatchEvent(newEvt);
      }
    };

    Component.prototype.addChild = function(child) {
      return this.children.push(child);
    };

    Component.prototype.removeChild = function(childToRemove) {
      return this.children.remove(childToRemove);
    };

    Component.prototype.addListener = function(type, handler) {
      return this.listeners.push({
        type: type,
        handler: handler
      });
    };

    Component.prototype.dispatchEvent = function(evt) {
      if (!evt.x) evt.x = 0;
      if (!evt.y) evt.y = 0;
      if (!evt.origin) evt.origin = this;
      if (!evt.target) evt.target = this;
      return Event.addToQueue(evt);
    };

    Component.prototype.onKeyDown = function(which, handler) {
      return this.keyDownHandlers.push({
        which: which,
        handler: handler
      });
    };

    Component.prototype.setPosition = function(x, y) {
      this.position.x = x;
      return this.position.y = y;
    };

    Component.prototype.setSize = function(w, h) {
      if (w !== this.size.w || h !== this.size.w) {
        this.dispatchEvent({
          type: 'resize'
        });
      }
      this.size.w = w;
      return this.size.h = h;
    };

    Component.prototype.handle = function(evt) {
      var child, listener, _i, _j, _len, _len2, _ref, _ref2, _results;
      if (Event.isMouseEvent(evt)) {
        if (!this.containsPoint(evt.x, evt.y)) return;
        evt.target = this;
      }
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        evt.x = evt.x - child.position.x;
        evt.y = evt.y - child.position.y;
        child.handle(evt);
        evt.x = evt.x + child.position.x;
        evt.y = evt.y + child.position.y;
      }
      _ref2 = this.listeners;
      _results = [];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        listener = _ref2[_j];
        if (evt.type === listener.type) {
          _results.push(listener.handler(evt));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Component.prototype.containsPoint = function(x, y) {
      var rect;
      rect = new Rect(0, 0, this.size.w, this.size.h);
      return rect.isPointInside(x, y);
    };

    Component.prototype.update = function(dt) {
      var child, k, _i, _j, _len, _len2, _ref, _ref2, _results;
      _ref = this.keyDownHandlers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        k = _ref[_i];
        if (Event.isKeyDown(k.which)) k.handler();
      }
      _ref2 = this.children;
      _results = [];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        child = _ref2[_j];
        _results.push(child.update(dt));
      }
      return _results;
    };

    Component.prototype.draw = function(ctx) {
      var child, _i, _len, _ref;
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        child.draw(ctx);
      }
      return ctx.restore();
    };

    return Component;

  })();

}).call(this);
(function() {

  window.Event = (function() {
    var eventQueue, keyDowns;

    function Event() {}

    eventQueue = [];

    keyDowns = {};

    Event.TYPES = {
      click: 'click',
      dblclick: 'dblClick',
      mousedown: 'mouseDown',
      mousemove: 'mouseMoveScene',
      mouseup: 'mouseUp',
      mouseover: 'mouseOverScene',
      mouseout: 'mouseOutScene',
      keydown: 'keyDown',
      keypress: 'keyPress',
      keyup: 'keyUp'
    };

    Event.MOUSE_EVENT_TYPES = ['click', 'dblClick', 'mouseDown', 'mouseMove', 'mouseUp'];

    Event.addToQueue = function(evt) {
      return eventQueue.splice(0, 0, evt);
    };

    Event.removeFromQueue = function() {
      return eventQueue.pop();
    };

    Event.isEmpty = function() {
      return eventQueue.length === 0;
    };

    Event.dispatchEvent = function(evt) {
      return this.addToQueue(evt);
    };

    Event.isMouseEvent = function(evt) {
      return (this.MOUSE_EVENT_TYPES.indexOf(evt.type)) >= 0;
    };

    Event.keyDown = function(keyCode) {
      return keyDowns[keyCode] = true;
    };

    Event.keyUp = function(keyCode) {
      return delete keyDowns[keyCode];
    };

    Event.isKeyDown = function(keyCode) {
      return keyDowns[keyCode];
    };

    return Event;

  })();

}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Rect = (function(_super) {

    __extends(Rect, _super);

    function Rect(x, y, w, h, color) {
      this.color = color != null ? color : 'black';
      Rect.__super__.constructor.call(this, x, y, w, h);
    }

    Rect.prototype.isPointInside = function(x, y) {
      return x >= this.position.x && x <= this.position.x + this.size.w && y >= this.position.y && y <= this.position.y + this.size.h;
    };

    Rect.prototype.draw = function(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.rect(this.position.x, this.position.y, this.size.w, this.size.h);
      ctx.closePath();
      ctx.fill();
      return Rect.__super__.draw.call(this, ctx);
    };

    return Rect;

  })(Component);

}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Coffee2D || (window.Coffee2D = {});

  window.Coffee2D.Image = (function(_super) {

    __extends(Image, _super);

    function Image(filename) {
      Image.__super__.constructor.call(this);
      console.log('test');
      this.image = new window.Image;
      this.image.src = filename;
      this.image.onload = this.onImageLoaded.bind(this);
      this.loaded = false;
    }

    Image.prototype.onImageLoaded = function() {
      this.loaded = true;
      return this.setSize(this.image.width, this.image.height);
    };

    Image.prototype.draw = function(ctx) {
      Image.__super__.draw.call(this, ctx);
      if (this.loaded) {
        return ctx.drawImage(this.image, this.position.x, this.position.y, this.size.w, this.size.h);
      }
    };

    return Image;

  })(Component);

}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Scene = (function(_super) {

    __extends(Scene, _super);

    function Scene(canvas, bgColor) {
      var bg, type;
      this.canvas = canvas;
      this.bgColor = bgColor != null ? bgColor : 'none';
      Scene.__super__.constructor.call(this);
      this.setPosition(0, 0);
      this.setSize(this.canvas.width, this.canvas.height);
      if (this.bgColor !== 'none') {
        bg = new Rect(this.position.x, this.position.y, this.size.w, this.size.h, this.bgColor);
        this.addChild(bg);
      }
      for (type in Event.TYPES) {
        this.canvas.addEventListener(type, this.onEvent.bind(this));
      }
      this.addListener('mouseMoveScene', (function(evt) {
        evt.type = 'mouseMove';
        return this.dispatchEvent(evt);
      }).bind(this));
      this.addListener('keyDown', function(evt) {
        return Event.keyDown(evt.which);
      });
      this.addListener('keyUp', function(evt) {
        return Event.keyUp(evt.which);
      });
      this.context = this.canvas.getContext('2d');
      this.lastTime = new Date().getTime();
      this.gameLoop();
    }

    Scene.prototype.onEvent = function(evt) {
      var newEvt;
      newEvt = {
        origin: this.canvas,
        type: Event.TYPES[evt.type],
        button: evt.button,
        which: evt.which || evt.keyCode || evt.charCode,
        x: evt.offsetX,
        y: evt.offsetY
      };
      return this.dispatchEvent(newEvt);
    };

    Scene.prototype.gameLoop = function() {
      var curTime, dt, evt;
      requestAnimationFrame(this.gameLoop.bind(this));
      curTime = new Date().getTime();
      dt = curTime - this.lastTime;
      this.lastTime = curTime;
      while (!Event.isEmpty()) {
        evt = Event.removeFromQueue();
        this.handle(evt);
      }
      this.update(dt);
      return this.draw(this.context);
    };

    Scene.prototype.clear = function() {
      return this.context.clearRect(0, 0, this.size.w, this.size.h);
    };

    Scene.prototype.draw = function(ctx) {
      this.clear();
      return Scene.__super__.draw.call(this, ctx);
    };

    return Scene;

  })(Component);

}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Sprite = (function(_super) {

    __extends(Sprite, _super);

    function Sprite(spriteSheet) {
      Sprite.__super__.constructor.call(this);
      this.spriteSheets = {
        "default": spriteSheet
      };
      this.animations = {};
      this.playingAnimation = 'none';
      this.isPlaying = false;
      this.loop = true;
      this.addListener('spriteImageLoaded', this.onSpriteImageLoaded.bind(this));
      this.reset();
    }

    Sprite.prototype.onSpriteImageLoaded = function(evt) {
      var f, found, h, key, spr, val, w, _i, _len, _ref, _ref2, _ref3;
      found = false;
      _ref = this.spriteSheets;
      for (key in _ref) {
        val = _ref[key];
        if (val === evt.target) {
          found = true;
          break;
        }
      }
      if (!found) return;
      w = h = 0;
      _ref2 = this.spriteSheets;
      for (key in _ref2) {
        spr = _ref2[key];
        _ref3 = spr.data;
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          f = _ref3[_i];
          if (f.w > w) w = f.w;
          if (f.h > h) h = f.h;
        }
      }
      return this.setSize(w, h);
    };

    Sprite.prototype.addSpriteSheet = function(id, spriteSheet) {
      return this.spriteSheets[id] = spriteSheet;
    };

    Sprite.prototype.addAnimation = function(a) {
      var data, duration, fps, id, row, spriteSheetId, ss, startFrame;
      if (!a.id) return;
      if (isNaN(a.row && isNaN(a.startFrame))) return;
      if (!a.fps) a.fps = 60;
      if (!a.spriteSheetId) a.spriteSheetId = 'default';
      id = a.id;
      row = a.row;
      startFrame = a.startFrame;
      duration = a.duration;
      fps = a.fps;
      spriteSheetId = a.spriteSheetId;
      ss = this.spriteSheets[spriteSheetId];
      if ((0 <= row && row <= ss.rowData.length)) {
        data = ss.getStartFrameAndDuration(row);
        startFrame = data.startFrame;
        duration = data.duration;
      }
      return this.animations[id] = {
        spriteSheet: spriteSheetId,
        startFrame: startFrame,
        duration: duration,
        frameInterval: 1000 / fps
      };
    };

    Sprite.prototype.reset = function() {
      var anim;
      anim = this.animations[this.playingAnimation];
      if (anim) {
        this.frameIndex = anim.startFrame;
      } else {
        0;
      }
      return this.curInterval = 0;
    };

    Sprite.prototype.playOnce = function(id) {
      if (id && this.playingAnimation !== id) {
        this.playingAnimation = id;
        this.reset();
        this.loop = false;
      }
      return this.isPlaying = true;
    };

    Sprite.prototype.play = function(id) {
      if (id && this.playingAnimation !== id) {
        this.playingAnimation = id;
        this.reset();
        this.loop = true;
      }
      return this.isPlaying = true;
    };

    Sprite.prototype.stop = function() {
      return this.isPlaying = false;
    };

    Sprite.prototype.update = function(dt) {
      var anim, spriteSheet;
      anim = this.animations[this.playingAnimation];
      if (!anim) return;
      spriteSheet = this.spriteSheets[anim.spriteSheet];
      if (spriteSheet && this.isPlaying && spriteSheet.loaded) {
        this.curInterval += dt;
        if (this.curInterval >= anim.frameInterval) {
          this.frameIndex++;
          if ((this.frameIndex >= anim.duration) && !this.loop) this.stop();
          this.frameIndex = anim.startFrame + (this.frameIndex - anim.startFrame) % anim.duration;
          this.curInterval = this.curInterval % anim.frameInterval;
        }
      }
      return Sprite.__super__.update.call(this, dt);
    };

    Sprite.prototype.draw = function(ctx) {
      var anim, dh, dw, f, spriteSheet;
      anim = this.animations[this.playingAnimation];
      if (!anim) return;
      spriteSheet = this.spriteSheets[anim.spriteSheet];
      if (spriteSheet && spriteSheet.loaded) {
        f = spriteSheet.data[this.frameIndex];
        dw = this.size.w === 0 ? f.w : this.size.w;
        dh = this.size.h === 0 ? f.h : this.size.h;
        ctx.drawImage(spriteSheet.image, f.x, f.y, f.w, f.h, this.position.x, this.position.y, dw, dh);
      }
      return Sprite.__super__.draw.call(this, ctx);
    };

    return Sprite;

  })(Component);

}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.SpriteImage = (function(_super) {

    __extends(SpriteImage, _super);

    function SpriteImage(spriteSheet, index) {
      this.spriteSheet = spriteSheet;
      this.index = index;
      SpriteImage.__super__.constructor.call(this);
    }

    SpriteImage.prototype.draw = function(ctx) {
      var f;
      SpriteImage.__super__.draw.call(this, ctx);
      if (this.spriteSheet && this.spriteSheet.loaded) {
        f = this.spriteSheet.data[this.index];
        return ctx.drawImage(this.spriteSheet.image, f.x, f.y, f.w, f.h, this.position.x, this.position.y, f.w, f.h);
      }
    };

    return SpriteImage;

  })(Component);

}).call(this);
(function() {

  window.SpriteSheet = (function() {

    function SpriteSheet(filename, rowData) {
      this.filename = filename;
      this.rowData = rowData;
      this.data = [];
      this.image = new Image;
      this.image.src = this.filename;
      this.image.onload = this.onImageLoaded.bind(this);
      this.loaded = false;
    }

    SpriteSheet.prototype.onImageLoaded = function() {
      var height, i, j, row, _ref, _ref2;
      height = 0;
      for (i = 0, _ref = this.rowData.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        row = this.rowData[i];
        for (j = 0, _ref2 = row.length - 1; 0 <= _ref2 ? j <= _ref2 : j >= _ref2; 0 <= _ref2 ? j++ : j--) {
          this.data.push({
            x: j * row.cellWidth,
            y: height,
            w: row.cellWidth,
            h: row.cellHeight
          });
        }
        height += row.cellHeight;
      }
      this.loaded = true;
      return Event.dispatchEvent({
        type: 'spriteImageLoaded',
        origin: this,
        target: this,
        x: 0,
        y: 0
      });
    };

    SpriteSheet.prototype.getStartFrameAndDuration = function(row) {
      var duration, i, startFrame, _ref;
      startFrame = 0;
      if (row > 0) {
        for (i = 0, _ref = row - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
          startFrame += this.rowData[i].length;
        }
      }
      duration = this.rowData[row].length;
      return {
        startFrame: startFrame,
        duration: duration
      };
    };

    SpriteSheet.prototype.getNumFrames = function() {
      return this.data.length;
    };

    return SpriteSheet;

  })();

}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.IsometricMap = (function(_super) {

    __extends(IsometricMap, _super);

    function IsometricMap(opts) {
      IsometricMap.__super__.constructor.call(this);
      console.log(this);
      this.opts = opts;
      this.spriteSheet = opts.spriteSheet;
      this.map = opts.map;
      this.tileWidth = opts.tileWidth;
      this.tileHeight = opts.tileHeight;
      this.tileXOffset = opts.tileXOffset;
      this.tileYOffset = opts.tileYOffset;
      this.tiles = [];
      this.init();
    }

    IsometricMap.prototype.init = function() {
      var cols, i, ii, j, jj, rows, t, x, xOffset, y, yOffset, _results;
      i = 0;
      j = 0;
      ii = 0;
      jj = 0;
      xOffset = 0;
      yOffset = 0;
      rows = this.map.length;
      cols = this.map[0].length;
      _results = [];
      while (i < rows && j < cols) {
        ii = i;
        jj = j;
        x = xOffset;
        y = yOffset;
        console.log('-----');
        while (ii < rows && jj < cols) {
          if (ii < 0 || ii >= rows || jj < 0 || jj >= cols) break;
          t = this.map[ii][jj];
          t.position = {
            x: x,
            y: y
          };
          this.addChild(t);
          ii -= 1;
          jj += 1;
          x += this.tileWidth;
        }
        if (i + 1 < cols) {
          i++;
          xOffset -= this.tileXOffset;
        } else {
          j++;
          xOffset += this.tileXOffset;
        }
        _results.push(yOffset += this.tileYOffset);
      }
      return _results;
    };

    return IsometricMap;

  })(Component);

}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Tile = (function(_super) {

    __extends(Tile, _super);

    function Tile(spriteSheet, index) {
      var tile, _i, _len, _ref;
      this.spriteSheet = spriteSheet;
      Tile.__super__.constructor.call(this);
      this.heightTiles = [];
      this.baseTiles = [];
      this.baseTiles.push(new SpriteImage(spriteSheet, index));
      _ref = this.baseTiles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tile = _ref[_i];
        this.addChild(tile);
      }
    }

    Tile.prototype.addHeightIndex = function(index) {
      var sprite;
      sprite = new SpriteImage(this.spriteSheet, index);
      sprite.position.y = -this.heightTiles.length * 32;
      console.log(sprite.position.y);
      this.heightTiles.push(sprite);
      return this.addChild(sprite);
    };

    return Tile;

  })(Component);

}).call(this);
/**
 * Provides requestAnimationFrame in a cross browser way.
 * @author paulirish / http://paulirish.com/
 */

if ( !window.requestAnimationFrame ) {

	window.requestAnimationFrame = ( function() {

		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

			window.setTimeout( callback, 1000 / 60 );

		};

	} )();

}