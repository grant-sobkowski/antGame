var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let delayCounter = 0;
var game = new Phaser.Game(config);

function preload (){
    this.load.image('ant', 'img/shotRed.png');
}

function create (){
    
}

function update (){
    delayCounter++;
    if ((delayCounter % 2) == 0){

    }
}