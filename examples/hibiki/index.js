(function() {
  var init;

  $(document).ready(function() {
    return init();
  });

  init = function() {
    var bg, canvas, scene, sprite, spriteSheet;
    canvas = $('#canvas')[0];
    scene = new Scene(canvas, 'black');
    bg = new Coffee2D.Image('images/bg.png');
    bg.position.y = 60;
    scene.addChild(bg);
    spriteSheet = new SpriteSheet('images/hibiki.png', [
      {
        length: 25,
        cellWidth: 67,
        cellHeight: 97
      }, {
        length: 12,
        cellWidth: 67,
        cellHeight: 101
      }
    ]);
    sprite = new Sprite(spriteSheet);
    sprite.addAnimation({
      id: 'idle',
      row: 0,
      fps: 24
    });
    sprite.addAnimation({
      id: 'walk',
      row: 1,
      fps: 24
    });
    sprite.play('idle');
    sprite.setPosition(100, 270);
    sprite.addListener('click', function() {
      if (sprite.isPlaying) {
        return sprite.stop();
      } else {
        return sprite.play();
      }
    });
    scene.addChild(sprite);
    scene.onKeyDown(37, function() {
      sprite.position.x -= 1;
      return sprite.play('walk');
    });
    scene.onKeyDown(39, function() {
      sprite.position.x += 1;
      return sprite.play('walk');
    });
    return scene.addListener('keyUp', function() {
      return sprite.play('idle');
    });
  };

}).call(this);