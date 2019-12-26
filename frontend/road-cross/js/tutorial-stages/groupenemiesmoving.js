// create a new scene


let gameScene = new Phaser.Scene('Game');

// initiate scene parameters
gameScene.init = function() { //setting up the game in the first tutorial style does not work well with this initialized this variables, would probably be better to define these in the create section if anything
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
let enemies;

let goal;
let score = 0;
let scoreText;
let pointer;

let dir;
let speed;
let conditionUp;
let conditionDown;

let numEnemies;


// called once after the preload ends
gameScene.create = function() {
 
  this.add.image(320, 180, 'background');

  // create the player
  //adding .physics have to have physcis defined in config
  player = this.physics.add.sprite(70, 180, 'player');
  
  player.setScale(0.5);
  player.setCollideWorldBounds(true);

  //start adding enemies here
  //add enemy as group:
    enemies = this.physics.add.group({
        key: 'enemy',
        repeat: 4,
        setXY: {
            x: 120,
            y: 100,
            stepX: 80,
            stepY: 20
        }
    });
    
    //set scale to group instead of enemy.setScale(0.6)
    Phaser.Actions.ScaleXY(enemies.getChildren(), -0.4, -0.4);
    

    //set flip enemy to group instead of enemy.flipX = true
    //set speed within here as well
    enemies.children.iterate(function (enemy){
        console.log(enemy);
        enemy.setCollideWorldBounds(true);
        // flip enemy
        enemy.flipX = true;
        //child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
       dir = Math.random() < 0.5 ? 1 : -1;
       console.log(dir);
       console.log(this.enemyMinSpeed);
       these values below intheory are min speed of emenmy, then last max speed of enemy minus min speed of enemy
       speed = (2 + Math.random()) * (4.5 - 2); //had to use hard coded numerical values, could not use this.min/max
       console.log(speed);
       enemy.speed = dir * speed;
       console.log(enemy.speed);
        
  
    });
    


  goal = this.physics.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'goal'); //this.sys.game.config.width or height, is meant to grab that value in a different manner, or define that value in a diff manner
  goal.setScale(0.6);

  //score box
  scoreText = this.add.text(16, 50, 'score: 0', { fontSize: '32px', fill: '#000' });

  this.physics.add.overlap(player, goal, collectGoal, null, this);
  //this.physics.add.overlap(player, enemy1, hitEnemy, null, this);

  pointer = this.input.activePointer;
  
  
};

// this is called up to 60 times per second
gameScene.update = function(){  
  //movement set isn't really appropriate for game theme and style, but wanted to figure out
    //ability to move at angles given pointer clicked location, have to define ponter in create, other examples available
    if(this.input.activePointer.isDown){
        player.x += (pointer.x - player.x) * 0.05;
        player.y += (pointer.y - player.y) * 0.05;
        
        };//end if
   
    //enemy movement

    enemies.children.iterate(function (child){
        child.y += child.speed;
        conditionUp = child.speed < 0 && child.y <= 80;
        conditionDown = child.speed > 0 && child.y >= 280;

        if (conditionUp || conditionDown){
            child.speed *= -1;
        }
    });
    // numEnemies = enemies.children.size;
    

    // for(let i = 0; i< numEnemies; i++) {
  
    //   // enemy movement
    //   enemies[i].y += enemies[i].speed;
  
    //   // check we haven't passed min or max Y
    //   let conditionUp = enemies[i].speed < 0 && enemies[i].y <= this.enemyMinY;
    //   let conditionDown = enemies[i].speed > 0 && enemies[i].y >= this.enemyMaxY;
  
    //   // if we passed the upper or lower limit, reverse
    //   if(conditionUp || conditionDown) {
    //     enemies[i].speed *= -1;
    //   }
    // }
    

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