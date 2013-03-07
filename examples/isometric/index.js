// Generated by CoffeeScript 1.4.0
(function() {
  var fullSreen, init;

  $(document).ready(function() {
    return init();
  });

  fullSreen = function(canvas) {
    if (canvas.webkitRequestFullScreen) {
      return canvas.webkitRequestFullScreen();
    } else {
      return canvas.mozRequestFullScreen();
    }
  };

  init = function() {
    var canvas, charSpriteSheet, i, isoMap, j, map, poly, scene, sprite, sprite2, sprite3, spriteSheet, _i, _j;
    canvas = $('#canvas')[0];
    $('#fs').on('click', function() {
      return fullSreen(canvas);
    });
    scene = new Scene(canvas, 'black');
    spriteSheet = new SpriteSheet('images/tileset.png', [
      {
        length: 10,
        cellWidth: 64,
        cellHeight: 64
      }, {
        length: 10,
        cellWidth: 64,
        cellHeight: 64
      }, {
        length: 10,
        cellWidth: 64,
        cellHeight: 64
      }, {
        length: 10,
        cellWidth: 64,
        cellHeight: 64
      }, {
        length: 10,
        cellWidth: 64,
        cellHeight: 64
      }, {
        length: 10,
        cellWidth: 64,
        cellHeight: 64
      }, {
        length: 10,
        cellWidth: 64,
        cellHeight: 64
      }, {
        length: 10,
        cellWidth: 64,
        cellHeight: 64
      }, {
        length: 10,
        cellWidth: 64,
        cellHeight: 64
      }, {
        length: 10,
        cellWidth: 64,
        cellHeight: 64
      }, {
        length: 10,
        cellWidth: 64,
        cellHeight: 64
      }, {
        length: 10,
        cellWidth: 64,
        cellHeight: 64
      }, {
        length: 10,
        cellWidth: 64,
        cellHeight: 64
      }
    ]);
    map = [];
    for (i = _i = 0; _i <= 9; i = ++_i) {
      map[i] = [];
      for (j = _j = 0; _j <= 9; j = ++_j) {
        map[i][j] = new Tile(spriteSheet, 1, 32);
      }
    }
    map[7][5].addHeightIndex(54);
    map[6][5].addHeightIndex(55);
    map[6][4].addHeightIndex(54);
    map[5][4].addHeightIndex(55);
    map[6][4].addHeightIndex(120);
    map[5][5].addHeightIndex(54);
    map[5][5].addHeightIndex(54);
    map[5][5].addHeightIndex(51);
    map[8][5].addHeightIndex(51);
    map[8][6].addHeightIndex(50);
    map[7][6].addHeightIndex(55);
    map[7][4].addHeightIndex(53);
    map[4][4].addHeightIndex(54);
    map[4][5].addHeightIndex(62);
    map[4][5].addHeightIndex(61);
    map[4][5].addHeightIndex(63);
    map[6][6].addHeightIndex(114);
    map[5][6].addHeightIndex(115);
    map[4][6].addHeightIndex(91);
    map[4][7].addHeightIndex(94);
    map[8][2].addHeightIndex(120);
    map[1][7].addHeightIndex(121);
    console.log(map);
    poly = new Polygon([[32, 32], [64, 48], [32, 64], [0, 48]]);
    isoMap = new IsometricMap({
      spriteSheet: spriteSheet,
      map: map,
      tileWidth: 64,
      tileHeight: 64,
      tileXOffset: 32,
      tileYOffset: 16,
      tileBoundingPoly: poly
    });
    console.log(isoMap.position, isoMap.size);
    scene.addChild(isoMap);
    charSpriteSheet = new SpriteSheet('images/hibiki.png', [
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
    sprite = new Sprite(charSpriteSheet);
    sprite.addAnimation({
      id: 'idle',
      row: 0,
      fps: 24
    });
    sprite.play('idle');
    sprite.setSize(30, 45);
    isoMap.addObject(sprite, 0, 0);
    sprite2 = new Sprite(charSpriteSheet);
    sprite2.addAnimation({
      id: 'idle',
      row: 0,
      fps: 24
    });
    sprite2.play('idle');
    sprite2.setPosition(160, 120);
    sprite2.setSize(30, 45);
    isoMap.addObject(sprite2, 1, 0);
    sprite3 = new Sprite(charSpriteSheet);
    sprite3.addAnimation({
      id: 'idle',
      row: 0,
      fps: 24
    });
    sprite3.play('idle');
    sprite3.setPosition(285, 53);
    sprite3.setSize(30, 45);
    isoMap.addObject(sprite3, 2, 0);
    return isoMap.position.x += 100;
  };

}).call(this);
