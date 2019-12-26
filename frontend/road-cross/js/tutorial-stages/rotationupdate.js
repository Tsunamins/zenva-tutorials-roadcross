// create a new scene
let gameScene = new Phaser.Scene('Game');



// load assets
gameScene.preload = function(){
  // load images
  this.load.image('background', 'assets/background.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('enemy', 'assets/dragon.png');
};

let player;
let enemy1;
let enemy2;


// called once after the preload ends
gameScene.create = function() {
  // create bg sprite -- background must be here before other game elements
  //can console.log each of these sprites/images and see a great deal of propeties availble to each one
  this.add.image(320, 180, 'background');

  // create the player
  //adding .physics have to have physcis defined in config
  player = this.physics.add.sprite(70, 180, 'player'); //params are start location 
        //will appear in order of appearance but can also change depth player.depth = 1 for example would place on top of 0, useful for mutlitple sprites
  // we are reducing the width by 50%, and we are doubling the height
  player.setScale(0.5); //add second parameter to specify x, y

  // create an enemy
  enemy1 = this.physics.add.sprite(250, 180, 'enemy');//initial position
  enemy1.setScale(2);
  

  // create a second enemy
  enemy2 = this.physics.add.sprite(450, 180, 'enemy');
  enemy2.setScale(2);

  //enemy1.angle = 45;
  //enemy1.setAngle(45);

  //this.enemy1.setOrigin(0, 0);
  enemy1.rotation = Math.PI / 4;
  enemy1.setRotation(Math.PI / 4);
  //removed this above and still rotated from update func below

  
};

// this is called up to 60 times per second
gameScene.update = function(){
    //enemy1.x += 1; //this will continue pushing acros x-axis
  
    enemy1.angle += 1; //this will rotate
  
    // check if we've reached scale of 2
    if(player.scaleX < 2) {
      // make the player grow
      player.scaleX += 0.01;
      player.scaleY += 0.01;
    }
  
  };



// set the configuration of the game
let config = {
  type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
  width: 640,
  height: 360,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 0 },
        debug: false
    }
},
  scene: gameScene
};

// create a new game, pass the configuration
let game = new Phaser.Game(config);