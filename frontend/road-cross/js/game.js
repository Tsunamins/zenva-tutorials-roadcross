//import Bullets from './Bullets.js';


// create a new scene


let gameScene = new Phaser.Scene('Game');

// initiate scene parameters, may not be necessary for my code variation
gameScene.init = function() { 

  };



// load assets
gameScene.preload = function(){
  // load images
  //this.load.image('background', 'assets/background.png');
  this.load.image('tiles', 'assets/maps/pinktilesheet.png');
  this.load.tilemapTiledJSON('map', 'assets/maps/1stworkingmap.json');
  this.load.spritesheet('player', 'assets/catspritesheet.png', { frameWidth: 35, frameHeight: 32 });
  //this.load.image('player', 'assets/player.png');
  this.load.spritesheet('enemy', 'assets/enemyspritesheet.png', { frameWidth: 32, frameHeight: 32 } );
  this.load.spritesheet('goal', 'assets/fireflyspritesheet.png', { frameWidth: 17, frameHeight: 17 });
  this.load.image('bullet', 'assets/magicb.png')
};

let map;
let tiles;
let layer_background;
let layer_roads;
let layer_collision;

let cursors;

let player;
let enemies;
let goals;
//var bullets;

let health;
let score = 0;
let hit = 0;
let attack = 0;
let scoreText;
var hitText;
let attackText;
let pointer;

let dir;
let speed;
let conditionUp;
let conditionDown;

 let finalScore;
 let finalHit;

 let timedEvent = 0;



// called once after the preload ends
gameScene.create = function() {

    var Bullet = new Phaser.Class({
      Extends: Phaser.GameObjects.Sprite,
      initialize:
        function Bullet (scene)
        {
            Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'bullet');
            this.speed = 1;
            this.born = 0;
            this.direction = 0;
            this.xSpeed = 0;
            this.ySpeed = 0;
            this.setSize(12, 12, true);
        },
        fire: function (player)
        {
            this.setPosition(player.x, player.y);
            if (player.flipX)
            {
                //face left
                this.speed = Phaser.Math.GetSpeed(-1000, 1);
            }
            else
            {
                //face right
                this.speed = Phaser.Math.GetSpeed(1000, 1);
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

//still in create, create bullets
  this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
  this.physics.world.enable(this.bullets);

  //background-create
  //this.add.image(320, 180, 'background');
  map = this.make.tilemap({key: 'map'});
  tiles = map.addTilesetImage('pinktilesheet', 'tiles');
  //paramsbelow are name of layer in tiled or can use array iteration value 0, 1, 2, etc
  layer_background = map.createStaticLayer('background', tiles, 0, 0);
  layer_roads = map.createStaticLayer('roads', tiles, 0, 0);
  layer_collision = map.createStaticLayer('buildings-trees', tiles, 0, 0);
  layer_collision.setCollisionByExclusion([-1], true, this);


  //player-create 
  //TODO: attach player location to map JSON file
  player = this.physics.add.sprite(70, 180, 'player');
  
  //player.setScale(0.5);
  player.setCollideWorldBounds(true);


  //create animations
    this.anims.create({
      //changed from left to walking to apply flipX
      key: 'walking',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'player', frame: 3 } ],
        frameRate: 20
    });
    
  
    //firing key not working, frame error
    // this.anims.create({
    //   key: 'fire',
    //   frames: [ { key: 'player', frame: 4 } ],
    //   frames: 20
    // });

    this.anims.create({
      //changed from left to walking to apply flipX
      key: 'enemy-walk',
      frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      //changed from left to walking to apply flipX
      key: 'firefly-float',
      frames: this.anims.generateFrameNumbers('goal', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1
    });



  

      

      //enemies-create
        enemies = this.physics.add.group({
            key: 'enemy',
            repeat: 4,
          
        });


    
    
    //set scale to group instead of enemy.setScale(0.6)
   // Phaser.Actions.ScaleXY(enemies.getChildren(), -0.4, -0.4);    

    //set flip enemy to group instead of enemy.flipX = true
    //set speed within here as well
    enemies.children.iterate(function (enemy){
        
        enemy.x = Phaser.Math.Between(100, 600);
        enemy.y = Phaser.Math.Between(100, 300)
        enemy.setCollideWorldBounds(true);
        enemy.setBounce(1);
        enemy.setVelocity(Phaser.Math.Between(20, 60), Phaser.Math.Between(20, 60));
       
        enemy.health = 3;
    });



  //goal-create
  goals = this.physics.add.group({
    key :'goal',
    repeat :6,  
  });

  goals.children.iterate(function (goal){
    //goal.setScale(0.6);
    //goal.body.immovable = true;
    goal.x = Phaser.Math.Between(100, 600);
    goal.y = Phaser.Math.Between(100, 300)
    goal.setCollideWorldBounds(true);
    goal.setBounce(1);
    goal.setVelocity(Phaser.Math.Between(20, 60), Phaser.Math.Between(20, 60));
   
});



  //score/HUD - create
  scoreText = this.add.text(0, 0, 'Fireflies collected: 0', { fontSize: '14px', fill: '#000', backgroundColor: '#cebff5' });
  hitText = this.add.text(200, 0, 'Enemy hit points: 0', { fontSize: '14px', fill: '#000',  backgroundColor: '#cebff5'});
  attackText = this.add.text(400, 0, 'Enemies banished: 0', { fontSize: '14px', fill: '#000',  backgroundColor: '#cebff5'});


  //overlap detect-create
  this.physics.add.overlap(player, goals, collectGoal, null, this); //this works in first phaser game tutorial because of the way the scene: is set up in config, works bc only 1 treasure on map
  //this.physics.add.overlap(player, enemies, hitByEnemy, null, this.create); //this context needs to be specified to create (this.create), only way to callback to multiple collisions
  this.physics.add.collider(player, enemies, hitByEnemy, null, this.create);
  this.physics.add.collider(enemies, goals);
  this.physics.add.collider(enemies, enemies);
  this.physics.add.collider(player, layer_collision);
  this.physics.add.collider(enemies, layer_collision);
  //TODO: get bullet with collision layer to work, have bullet layer func in update, doesn't work yet
  

  
  
    //input - create
  pointer = this.input.activePointer;
  cursors = this.input.keyboard.createCursorKeys();

  this.cameras.main.setSize(400, 300);
  this.cameras.main.startFollow(player);

 
};

// this is called up to 60 times per second
gameScene.update = function(){
   //timedEvent = this.time.addEvent({delay: 70000});
   

  if(this.isTerminating) return;
  //movement set isn't really appropriate for game theme and style, but wanted to figure out
    //ability to move at angles given pointer clicked location, have to define ponter in create, other examples available
    
   
    if(this.input.activePointer.isDown){
        player.x += (pointer.x - player.x) * 0.05;
        player.y += (pointer.y - player.y) * 0.05;
        
        };//end if 
        
        if (cursors.left.isDown){
            player.flipX = true;
            player.setVelocityX(-160);
            player.anims.play('walking', true);
    
        } else if (cursors.right.isDown){
           player.flipX = false;
           player.setVelocityX(160);
            player.anims.play('walking', true);
    
           
        } else {
          
          player.setVelocityX(0);
          player.anims.play('turn', true);

        };

        if (cursors.up.isDown){
          player.setVelocityY(-160);
          player.anims.play('walking', true);
  
         
      } else if (cursors.down.isDown){
          player.setVelocityY(160);
          player.anims.play('walking', true);
  
        
      } else {
        
        player.setVelocityY(0);
       
      };
        
      if (cursors.space.isDown){
        
        //firing animation for cat not working
        // player.setVelocity(0);
        // player.anims.play('fire', true);
          var bullet = this.bullets.get();
          bullet.setActive(true);
          bullet.setVisible(true);
  
          if (bullet)
          {
           
              bullet.fire(player);
              this.physics.add.overlap(bullet, enemies, hitAnEnemy, null, this);
              //TODO: get bullet with collision layer to work, doesn't work with below yet
              this.physics.add.collider(bullet, layer_collision);
             
          }
      }

    goals.children.iterate(function(child){
      child.setVelocity = 75;
      child.anims.play('firefly-float', true);

      });

    enemies.children.iterate(function (child){
      child.setVelocity = 150;
      child.anims.play('enemy-walk', true);

      
    });
  
    if (score === 7 && attack === 5){
      return this.gameOver();
    };

};//end update

function collectGoal (player, goal)
{
    goal.disableBody(true, true); //remove from screen

    //Add a score feature for data purposes
    score += 1;
    scoreText.setText('Fireflies collected: ' + score);
       
  };

function hitByEnemy (player, enemy){

  
 
  hit += 1;
  hitText.setText('Enemy hit points: ' + hit);
    //this.physics.pause();
  //player.setTint(0xff0000);
  // console.log(timedEvent + 5000);
  //   if ((timedEvent + 5000) <= gameScene.time){//set lower time to clear in milliseconds
  //     player.clearTint();
  //   }
 
  // if (hit === 5){
  //   gameScene.events.emit('maxHits');
  //    }

};

function hitAnEnemy(bullet, enemy){
  attack += 1;
  attackText.setText('Enemies banished: ' + attack);
  enemy.disableBody(true, true);
};




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
  pixelArt: true,
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