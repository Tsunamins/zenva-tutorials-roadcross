// create a new scene


let gameScene = new Phaser.Scene('Game');

// initiate scene parameters
gameScene.init = function() {
    // player speed
    this.playerSpeed = 3;

    //enemy additions
    //speed
    this.enemyMinSpeed = 2;
    this.enemyMaxSpeed = 4.5;

    //boundaries
    this.enemyMinY = 80;
    this.enemyMaxY = 280;
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
let enemy;

let goal;
let score = 0;
let scoreText;
let pointer;

let dir;
let speed;
let conditionUp;
let conditionDown;


// called once after the preload ends
gameScene.create = function() {
 
  this.add.image(320, 180, 'background');

  // create the player
  //adding .physics have to have physcis defined in config
  player = this.physics.add.sprite(70, 180, 'player');
  
  player.setScale(0.5);

  //start adding enemies here
    enemy = this.physics.add.sprite(200, this.sys.game.config.height / 2, 'enemy');
    enemy.flipX = true;
    enemy.setScale(0.6);


  goal = this.physics.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'goal'); //this.sys.game.config.width or height, is meant to grab that value in a different manner, or define that value in a diff manner
  goal.setScale(0.6);

  //score box
  scoreText = this.add.text(16, 50, 'score: 0', { fontSize: '32px', fill: '#000' });


  //enemy speed
     dir = Math.random() < 0.5 ? 1 : -1;
     speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
     enemy.speed = dir * speed;

    
     this.physics.add.overlap(player, goal, collectGoal, null, this);
  //this.physics.add.overlap(player, enemy1, hitEnemy, null, this);

  pointer = this.input.activePointer;
  
  
};

// this is called up to 60 times per second
gameScene.update = function(){  

    //ability to move at angles given pointer clicked location, have to define ponter in create, other examples available
    if(this.input.activePointer.isDown){
        player.x += (pointer.x - player.x) * 0.05;
        player.y += (pointer.y - player.y) * 0.05;
        
        };//end if
    
    //enemy movement
    enemy.y += enemy.speed;
    conditionUp = enemy.speed < 0 && enemy.y <= this.enemyMinY;
    conditionDown = enemy.speed > 0 && enemy.y >= this.enemyMaxY;
    if(conditionUp || conditionDown) {
        enemy.speed *= -1;
    }
    

};//end update

function collectGoal (player, goal)
{
    goal.disableBody(true, true); //remove from screen

    //Add a score feature for data purposes
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