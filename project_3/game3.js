/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var gameWidth = 600;
var gameHeight = 400;
var GAME_SCALE = 2;
var gameport = document.getElementById("gameport");
var tilesize = 16;
var renderer = new PIXI.autoDetectRenderer(gameWidth, gameHeight, {backgroundColor: 0x333333});
gameport.appendChild(renderer.view);

// var HORIZON_Y = gameHeight/GAME_SCALE/2;
var smalltextSettings = {
    font: '12px georgia'};
var normaltextSettings = {
    font: '16px georgia'};


var isRunning = false;

// All the Screens
var stage = new PIXI.Container();
var gameScreen = new PIXI.Container();
var endScreen = new PIXI.Container();
//var creditsScreen = new PIXI.Container();
var menuScreen = new PIXI.Container();
var instructionsScreen = new PIXI.Container();
var currentScreen = menuScreen;

// all global variables required for the game
var player;
var bubbles = [];
var spaceship;
var gameOver;
var titlePic;
var menuSong;
var gameSong;
var gotoMainMenu;
var maxBubbles = 6;
var currentBubbles = 0;
// var toggleMenuMusic;
// var toggleGameMusic;
// Scene objects get loaded in the ready function
var world;
var playerObject;

var entity_layer;

var instructionsScreenText = new PIXI.Text('Having tickled all the aliens, they have ran off, leaving you stranded on Mars!\nYou must find fuel for bubble-powered ship.\nYour ship must receive the fuel in the correct order, or you must start over.', textSettings)

//var credits = new PIXI.Text("Created by:  John Bassler", textSettings);
var background = new PIXI.Texture.fromFrame("background.png");

stage.addChild(background);
endScreen.addChild(background);
menuScreen.addChild(background);
instructionsScreen.addChild(background);
//creditsScreen.addChild(background);

PIXI.loader
  .add('map_json', 'mapmedium.json')
  .add('tileset', 'tileset.png')
  .add('gameplaysong.mp3')
  .add('menusong.mp3')
  .add('bubblepickup.mp3')
  .add('assets3.json')
  .load(ready);

function ready() {
    menuSong = PIXI.audioManager.getAudio("menusong.mp3");
    menuSong.loop = true;
    menuSong.volume = 0.5;

    gameSong = PIXI.audioManager.getAudio("gameplaysong.mp3");
    gameSong.loop = true;
    gameSong.volume = 0.5;

    for (var i = 0; i < maxBubbles; i++) {
        bubbles[i] = new PIXI.Sprite(PIXI.Texture.fromFrame("bubble"+i+".png"));

    playButton = new PIXI.Sprite(PIXI.Texture.fromFrame("playButton.png"));
    instructionsButton = new PIXI.Sprite(PIXI.Texture.fromFrame("instructionsButton.png"));
    player = new PIXI.Sprite(PIXI.Texture.fromFrame("astronaut.png"));
    gameOver = new PIXI.Sprite(PIXI.Texture.fromFrame("gameOver.png"));

    var tileUtil = new TileUtilities(PIXI);
    world = tileUtil.makeTiledWorld("map_json", "map1.png", "map2.png");        // two map tiles, so include them both
    gameScreen.addChild(world);
    titlePic = new PIXI.Sprite(PIXI.Texture.fromFrame("titlePic.png"));
    // Find the entity layer
    gameLayer = world.getObject("Entities");
    gameLayer.addChild(player);
    gameLayer.addChild(spaceship);
    player.direction = MOVE_NONE;
    player.moving = false; 

    stage.addChild(gameScreen);     
    currentScreen = new mainMenu();
    animate();
    }
}

// allow music to be turned on and off
function toggleGameSong() {
  if (gameSong.playing === true) {
    gameSong.stop();
  }
  else {
    gameSong.play();
  }
}

function toggleMenuSong() {
    if (menuSong.playing === true) {
        menuSong.stop();
    }
    else {
        menuSong.play();
    }
}

// Character movement constants:
var MOVE_LEFT = 1;
var MOVE_RIGHT = 2;
var MOVE_UP = 3;
var MOVE_DOWN = 4;
var MOVE_NONE = 0;

// The move function starts or continues movement
function move() {
  if (player.direction == MOVE_NONE) {
    player.moving = false;
    console.log(player.y);
    return;
  }
  player.moving = true;
  console.log("move");
  
  if (player.direction == MOVE_LEFT) {
    createjs.Tween.get(player).to({x: player.x - 32}, 250).call(move);
  }
  if (player.direction == MOVE_RIGHT)
    createjs.Tween.get(player).to({x: player.x + 32}, 250).call(move);

  if (player.direction == MOVE_UP)
    createjs.Tween.get(player).to({y: player.y - 32}, 250).call(move);
  
  if (player.direction == MOVE_DOWN)
    createjs.Tween.get(player).to({y: player.y + 32}, 250).call(move);
}

// Keydown events start movement
window.addEventListener("keydown", function (e) {
  e.preventDefault();
  if (!player) return;
  if (player.moving) return;
  if (e.repeat == true) return;
  
  player.direction = MOVE_NONE;

  if (e.keyCode == 87)
    player.direction = MOVE_UP;
  else if (e.keyCode == 83)
    player.direction = MOVE_DOWN;
  else if (e.keyCode == 65)
    player.direction = MOVE_LEFT;
  else if (e.keyCode == 68)
    player.direction = MOVE_RIGHT;

  console.log(e.keyCode);
  move();
});

// Keyup events end movement
window.addEventListener("keyup", function onKeyUp(e) {
  e.preventDefault();
  if (!player) return;
  player.direction = MOVE_NONE;
});

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

var mainMenu = function() {
    menuSong.play();

    title.position.x = renderer.width/2;
    title.position.y = renderer.height/2 - 170;
    playButton.anchor.x = 0.5;
    playButton.anchor.y = 0.5;
    playButton.position.x = renderer.width/2;
    playButton.position.y = renderer.height/2+50;
    instructionsButton.anchor.x = 0.5;
    instructionsButton.anchor.y = 0.5;
    instructionsButton.position.x = renderer.width/2;
    instructionsButton.position.y = renderer.height/2 + 120;

    menuScreen.addChild(titlePic);
    menuScreen.addChild(playButton);
    menuScreen.addChild(instructionsButton);
//    menuScreen.addChild(credits);
    menuScreen.addChild(player);
    // clickable "buttons"
    playButton.interactive = true;
    instructionsButton.interactive = true;
    isRunning = false;

    // add the built menu to the stage
    // tie an action to pressing play, instructions
    stage.addChild(menuScreen);
    playButton.mousedown = function(c) {
        menuScreen.removeChildren();
        stage.removeChild(menuScreen);
        stage.addChild(gameScreen);
        currentScreen = new gameplay();
    };
    instructionsButton.mousedown = function(c) {
        menuScreen.removeChildren();
        stage.removeChild(menuScreen);
        stage.addChild(instructionsScreen);
        currentScreen = new Screen_Instructions();
    };
};

var Screen_End = function() {

    // set game to notrunning, position buttons
    isRunning = false;
    gotoMainMenu.anchor.x = 0.5;
    gotoMainMenu.anchor.y = 0.5;
    gotoMainMenu.position.x = renderer.width/2;
    gotoMainMenu.position.y = renderer.height/2;
    
    gameOver.anchor.x = 0.5;
    gameOver.anchor.y = 0.5;
    gameOver.position.x = renderer.width/2;
    gameOver.position.y = renderer.height/2 - 100;
    
    // remove gamescreen elements, add buttons to endScreen
    gameScreen.removeChildren();
    endScreen.addChild(gotoMainMenu);
    endScreen.addChild(gameOver);
    
    // remove gamescreen, add endscreen. make the button interactive
    stage.removeChild(gameScreen);
    stage.addChild(endScreen);
    gotoMainMenu.interactive = true;

    gotoMainMenu.mousedown = function(c) {
        stage.removeChild(endScreen);
        stage.addChild(menuScreen);
        gameSong.stop();
        currentScreen = new mainMenu();
    }
}

var Screen_Instructions = function() {
    instructionsScreenText.position.x = 50;
    instructionsScreenText.position.y = 15;

    gotoMainMenu.anchor.x = 0.5;
    gotoMainMenu.anchor.y = 0.5;
    gotoMainMenu.position.x = renderer.width/2;
    gotoMainMenu.position.y = renderer.height/2+100;
    
    gotoMainMenu.interactive = true;
    gotoMainMenu.mousedown = function(c) {
        instructionsScreen.removeChildren();
        stage.removeChild(instructionsScreen);
        stage.addChild(menuScreen);
        currentScreen = new mainMenu();
    };
    instructionsScreen.addChild(background);
    instructionsScreen.addChild(instructionsScreenText);
    //instructionsScreen.addChild();
};

function animate(timestamp) {
  requestAnimationFrame(animate);
  if(isRunning) {
    currentScreen.updateCamera();
  }
  renderer.render(stage);
}

function update_camera() {
  stage.x = -player.x*GAME_SCALE + gameWidth/2 - player.width/2*GAME_SCALE;
  stage.y = -player.y*GAME_SCALE + gameHeight/2 + player.height/2*GAME_SCALE;
  stage.x = -Math.max(0, Math.min(world.worldWidth*GAME_SCALE - gameWidth, -stage.x));
  stage.y = -Math.max(0, Math.min(world.worldHeight*GAME_SCALE - gameHeight, -stage.y));
}

var gameplay = function() {
    // put the player on the map
    player.anchor.x = 0.5;
    player.anchor.y = 0.5;
    player.position.x = tilesize * 4;
    player.position.y = tilesize * 4;

    gameSong.volume = 0.5;
    gameSong.play();

    // set stage scale before adding 
    stage.scale.x = GAME_SCALE;
    stage.scale.y = GAME_SCALE;

    playerObject = world.getObject("player");

    // manually list all the bubble's positions in terms of the tiles (and scale)
    bubble1.position.x = tilesize * 15;
    bubble1.position.y = tilesize * 20;
    bubble1.scale.x = 0.5;
    bubble1.scale.y = 0.5;
    bubble2.position.x = tilesize * 40;
    bubble2.position.y = tilesize * 10;
    bubble2.scale.x = 0.5;
    bubble2.scale.y = 0.5;
    bubble3.position.x = tilesize * 10;
    bubble3.position.y = tilesize * 30;
    bubble3.scale.x = 0.5;
    bubble3.scale.y = 0.5;
    bubble4.position.x = tilesize * 33;
    bubble4.position.y = tilesize * 13;
    bubble4.scale.x = 0.5;
    bubble4.scale.y = 0.5;
    bubble5.position.x = tilesize * 30;
    bubble5.position.y = tilesize * 44;
    bubble5.scale.x = 0.5;
    bubble5.scale.y = 0.5;
    bubble6.position.x = tilesize * 22;
    bubble6.position.y = tilesize * 22;
    bubble6.scale.x = 0.5;
    bubble6.scale.y = 0.5;

    isRunning = true;

    spaceship.scale.x = 2;
    spaceship.scale.y = 2;
    spaceship.position.x = 50;
    spaceship.position.y = 50

    gameScreen.addChild(player);
    gameScreen.addChild(spaceship);

    // add the elements to gameLayer 
    gameLayer = world.getObject("Entities");
    gameLayer.addChild(player);
    gameLayer.addChild(spaceship);
    gameLayer.addChild(bubble1);
    gameLayer.addChild(bubble2);
    gameLayer.addChild(bubble3);
    gameLayer.addChild(bubble3);
    gameLayer.addChild(bubble4);
    gameLayer.addChild(bubble5);
    gameLayer.addChild(bubble6);

    gameScreen.addChild(world);
    isRunning = true;
}

function Collision1(plyr, b) {
    if (Math.abs(plyr.position.x - b.position.x<16)) {
        if(Math.abs(plyr.position.y - b.position.y<16)) {
            b.visible = false;
            return true;
        }
    } return false;
}

gameplay.prototype.updateCamera = function() {
    stage.x = -player.x*GAME_SCALE + gameWidth/2 - player.width/2*GAME_SCALE;
    stage.y = -player.y*GAME_SCALE + gameHeight/2 + player.height/2*GAME_SCALE;
}

gameplay.prototype.checkBubbles = function() {
    for(var i = 0; i < bubbles.length; i++) {       // check if the player has collided with any of the bubbles
        if (Collision1(player,bubbles[i]) && currentBubbles === i) {
            bubblepickup.play();
            bubbles[i].visible = false;
            currentBubbles++;
            i++;
        }
        if (Collision1(player,bubbles[i] && currentBubbles !== i)) {   // set all bubble to visible, reset counter
            for(var x = 0; i < bubbles.length; i++) {
                bubbles[x].visible = true;
                currentBubbles = 0;
            }
            
        }
    }
}

gameplay.prototype.gameOver = function() {
    isRunning = false;
}

animate();
