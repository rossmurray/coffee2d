// Generated by CoffeeScript 1.3.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.SpriteImage = (function(_super) {

    __extends(SpriteImage, _super);

    function SpriteImage(filename) {
      SpriteImage.__super__.constructor.call(this);
      this.image = new Image;
      this.image.src = filename;
      this.image.onload = this.onImageLoaded.bind(this);
      this.loaded = false;
    }

    SpriteImage.prototype.onImageLoaded = function() {
      this.loaded = true;
      return this.setSize(this.image.width, this.image.height);
    };

    SpriteImage.prototype.draw = function(ctx) {
      SpriteImage.__super__.draw.call(this, ctx);
      if (this.loaded) {
        return ctx.drawImage(this.image, this.position.x, this.position.y, this.size.w, this.size.h);
      }
    };

    return SpriteImage;

  })(Component);

}).call(this);