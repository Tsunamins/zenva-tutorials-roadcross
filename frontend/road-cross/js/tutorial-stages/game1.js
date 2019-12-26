
//let gameScene = new Phaser.Scene('Game');
//older method above

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        //gameScene, old method, changed to newer example
        preload: preload,
        create: create,
        update: PaymentRequestUpdateEvent
    }
};

let game = new Phaser.Game(config);