// create a new scene


let gameScene = new Phaser.Scene('Game');

// initiate scene parameters
gameScene.init = function() {
    // player speed
    this.playerSpeed = 3;
  };



// load assets
gameScene.preload = function(){
  // load images
  this.load.image('background', 'assets/background.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('enemy', 'assets/dragon.png');
  this.load.image('goal', 'assets/treasure.png');
};

let player;
let enemy1;
let enemy2;
let goal;
let score = 0;
let scoreText;
let pointer;


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


  goal = this.physics.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'goal'); //this.sys.game.config.width or height, is meant to grab that value in a different manner, or define that value in a diff manner
  goal.setScale(0.6);
    
  scoreText = this.add.text(16, 50, 'score: 0', { fontSize: '32px', fill: '#000' });

  //this.physics.add.collider(player, goal); //this example works better without this feature for now
  //this.physics.add.collider(player, enemy1);

  this.physics.add.overlap(player, goal, collectGoal, null, this);
  //this.physics.add.overlap(player, enemy1, hitEnemy, null, this);

  pointer = this.input.activePointer;
  console.log(pointer);
  
};

// this is called up to 60 times per second
gameScene.update = function(){
   // console.log(pointer.x);
    //console.log(pointer.y);

//ability to move at angles given pointer clicked location, have to define ponter in create
if(this.input.activePointer.isDown){
    player.x += (pointer.x - player.x) * 0.05;
    player.y += (pointer.y - player.y) * 0.05;
    
};


    // check for active input (left click / touch)
//   if(this.input.activePointer.isDown) {
//     // player walks
//     player.x += this.playerSpeed;
//   }
//found different method, ability to move left isn't in game idea of tutorial but added for note
// if (this.input.activePointer.isDown)
// {
//     if (this.input.activePointer.x > player.x)
//     {
//         player.setVelocityX(160);
        
//     }   
//     else if (this.input.activePointer.x < player.x)
//     {
//         player.setVelocityX(-160);
//     }
// } else {
//     player.setVelocityX(0);
    
// };
    
};//end update function

function collectGoal (player, goal)
{
    goal.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);
    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
   

        

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