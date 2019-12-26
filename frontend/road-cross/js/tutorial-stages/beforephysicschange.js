//import Bullets from './Bullets.js';


// create a new scene


let gameScene = new Phaser.Scene('Game');

// initiate scene parameters, may not be necessary for my code variation
gameScene.init = function() { 

  };



// load assets
gameScene.preload = function(){
  // load images
  this.load.image('background', 'assets/background.png');
  //this.load.spritesheet('player', 'assets/playersheet.png', { frameWidth: 32, frameHeight: 48 });
  this.load.image('player', 'assets/player.png');
  this.load.image('enemy', 'assets/dragon.png');
  this.load.image('goal', 'assets/treasure.png');
  this.load.image('bullet', 'assets/ballBlack_04.png')
};

let cursors;

let player;
let enemies;
let goals;
//var bullets;

let health;
let score = 0;
let hit = 0;
let scoreText;
var hitText;
let pointer;

let dir;
let speed;
let conditionUp;
let conditionDown;

 let finalScore;
 let finalHit;



// called once after the preload ends
gameScene.create = function() {

  var Bullet = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    function Bullet (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

        this.speed = 0;
        this.born = 0;
    },

    fire: function (player)
    {
        this.setPosition(player.x, player.y);

        if (player.flipX)
        {
            //  Facing left
            this.speed = Phaser.Math.GetSpeed(-1000 + player.vel.x, 1);
        }
        else
        {
            //  Facing right
            this.speed = Phaser.Math.GetSpeed(1000 + player.vel.x, 1);
        }

        this.born = 0;
    },

    update: function (time, delta)
    {
        this.x += this.speed * delta;

        this.born += delta;

        if (this.born > 1000)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }

});

this.bullets = this.add.group({ classType: Bullet, runChildUpdate: true });
 
  //background-create
  this.add.image(320, 180, 'background');

  //player-create 
  player = this.physics.add.sprite(70, 180, 'player');
  
  player.setScale(0.5);
  player.setCollideWorldBounds(true);

  

  //enemies-create
    enemies = this.physics.add.group({
        key: 'enemy',
        repeat: 4,
      
    });
    
    //set scale to group instead of enemy.setScale(0.6)
    Phaser.Actions.ScaleXY(enemies.getChildren(), -0.4, -0.4);    

    //set flip enemy to group instead of enemy.flipX = true
    //set speed within here as well
    enemies.children.iterate(function (enemy){
        
        enemy.x = Phaser.Math.Between(100, 600);
        enemy.y = Phaser.Math.Between(100, 300)
        enemy.setCollideWorldBounds(true);
        // flip enemy
        enemy.flipX = true;

        enemy.setBounce(1);
        enemy.setVelocity(Phaser.Math.Between(20, 60), Phaser.Math.Between(20, 60));
       

       
        
       
  
    });

 //new phaser bullet class within create


  //goal-create

  goals = this.physics.add.group({
    key :'goal',
    repeat :6,

    
  })

  goals.children.iterate(function (goal){
    goal.setScale(0.6);
    goal.body.immovable = true;
    goal.x = Phaser.Math.Between(100, 600);
    goal.y = Phaser.Math.Between(100, 300)
    goal.setCollideWorldBounds(true);
   
});



  //score/HUD - create
  scoreText = this.add.text(16, 50, 'score: 0', { fontSize: '32px', fill: '#000' });
  hitText = this.add.text(16, 100, 'hit: 0', { fontSize: '32px', fill: '#000' });

  //overlap detect-create
  this.physics.add.overlap(player, goals, collectGoal, null, this); //this works in first phaser game tutorial because of the way the scene: is set up in config, works bc only 1 treasure on map
  this.physics.add.overlap(player, enemies, hitEnemy, null, this.create); //this context needs to be specified to create (this.create), only way to callback to multiple collisions
  
  this.physics.add.collider(enemies, goals);
  this.physics.add.collider(enemies, enemies);
  
    //input - create
  pointer = this.input.activePointer;
  cursors = this.input.keyboard.createCursorKeys();

  

  
  
};

// this is called up to 60 times per second
gameScene.update = function(){
  
  if(this.isTerminating) return;
  //movement set isn't really appropriate for game theme and style, but wanted to figure out
    //ability to move at angles given pointer clicked location, have to define ponter in create, other examples available
    
   
    if(this.input.activePointer.isDown){
        player.x += (pointer.x - player.x) * 0.05;
        player.y += (pointer.y - player.y) * 0.05;
        
        };//end if 
        
        if (cursors.left.isDown){
            player.setVelocityX(-160);
    
           // player.anims.play('left', true);
        } else if (cursors.right.isDown){
            player.setVelocityX(160);
    
           // player.anims.play('right', true);
        } else {
          
          player.setVelocityX(0);

        };

        if (cursors.up.isDown){
          player.setVelocityY(-160);
  
         // player.anims.play('left', true);
      } else if (cursors.down.isDown){
          player.setVelocityY(160);
  
         // player.anims.play('right', true);
      } else {
        
        player.setVelocityY(0);

      };
        
      if (cursors.space.isDown){
        console.log("Space bar pressed")
        
          var bullet = this.bullets.get();
          bullet.setActive(true);
          bullet.setVisible(true);
  
          if (bullet)
          {
              bullet.fire(this.player);
  
              this.lastFired = time + 100;
          }
      
      }



    enemies.children.iterate(function (child){
      child.setVelocity = 150;
      
    });
  
    if (score === 70 && hit === 5){
      return this.gameOver();
    };

};//end update

function collectGoal (player, goal)
{
    goal.disableBody(true, true); //remove from screen

    //Add a score feature for data purposes
    score += 10;
    scoreText.setText('Score: ' + score);
    
        
    if (score === 10){
      gameScene.events.emit('goalCollected');
      
    }
    
    };

function hitEnemy (player, enemy){
  enemy.disableBody(false, false); //params stand for(disable game object, and hide game object)
  //above: same effect if (true, false), gets a great deal of hit points if commented out
  hit +=1;
  hitText.setText('Hit: ' + hit);
  
  //this.physics.pause();
  player.setTint(0xff0000);

  if (hit === 5){
    gameScene.events.emit('maxHits');
   
  }

 
  
}




gameScene.gameOver = function() {

  

  // initiated game over sequence
  this.isTerminating = true;

  // shake camera
  this.cameras.main.shake(500);

  // listen for event completion
  this.cameras.main.on('camerashakecomplete', function(camera, effect){

    // fade out
    this.cameras.main.fade(500);
  }, this);

  adapter.createStat(score, hit);

  this.cameras.main.on('camerafadeoutcomplete', function(camera, effect){
    // restart the Scene
    this.scene.restart();
  }, this);


};






// set the configuration of the game
let config = {
  type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
  width: 640,
  height: 360,
  parent: 'canvas',
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 0 },
        debug: false
    }
},
  scene: gameScene, 
  extend:{
    bullets: null
  }
};

// create a new game, pass the configuration
let game = new Phaser.Game(config);