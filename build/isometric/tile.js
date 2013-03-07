// Generated by CoffeeScript 1.4.0
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.Tile = (function(_super) {

    __extends(Tile, _super);

    function Tile(spriteSheet, index, heightOffset) {
      var tile, _i, _len, _ref;
      this.spriteSheet = spriteSheet;
      this.index = index;
      this.heightOffset = heightOffset != null ? heightOffset : 0;
      Tile.__super__.constructor.call(this);
      this.heightTiles = [];
      this.baseTiles = [];
      this.baseTiles.push(new SpriteImage(spriteSheet, this.index));
      _ref = this.baseTiles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tile = _ref[_i];
        this.addChild(tile);
      }
      this.size = this.baseTiles[0].size;
      this.addListener('mouseMove', (function(evt) {
        var newEvt;
        console.log('move');
        newEvt = {
          type: 'tileMouseOver',
          x: evt.x,
          y: evt.y
        };
        return this.dispatchEvent(newEvt);
      }).bind(this));
    }

    Tile.prototype.hidePoly = function() {
      return this.removeChild(this.boundingPolygon);
    };

    Tile.prototype.showPoly = function() {
      return this.children.splice(1, 0, this.boundingPolygon);
    };

    Tile.prototype.addHeightIndex = function(index) {
      var sprite;
      sprite = new SpriteImage(this.spriteSheet, index);
      sprite.position.y = -this.heightTiles.length * this.heightOffset;
      console.log(sprite.position.y);
      this.heightTiles.push(sprite);
      return this.addChild(sprite);
    };

    return Tile;

  })(Component);

}).call(this);
