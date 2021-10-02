import Phaser from 'phaser.min.js';

export default class gameScene extends Phaser.Scene{

    constructor(){
        super();
    }

    preload (){
        this.load.image('ant', 'img/shotRed.png');
    }

    xVel = getRandomTrajectory();
    yVel = getRandomTrajectory();

    create (){
        this.ant = this.physics.add.sprite(200, 200, 'ant');
        this.ant.setVelocity(xVel, yVel);
        this.ant.setBounce(1).setCollideWorldBounds(true);
    
    }

    moveCounter = 0;
    update (){
        moveCounter ++;
        if((moveCounter % 60) == 0){
            if(Math.random() < .3){
                oldXVel = xVel;
                oldYVel = yVel;
                xVel = getRandomTrajectory();
                yVel = getRandomTrajectory();
                ant.setVelocity(this.xVel, this.yVel);
                handleTurn();
            }
        }
    }

    getRandomTrajectory(){
    let rng = Math.random() - .495;
    return (rng*100);
}
    // handleTurn(){
    //     let targetAngle = Phaser.Math.Angle.Between(oldXVel, oldYVel, xVel, yVel);
    //     Phaser.
    // }
}

// class ant {
//     constructor(xVel, yVel, xpos, ypos) {
//         ant = game.physics.add.sprite(xpos, ypos, 'ant');
//         ant.setVelocity(this.getRandomTrajectory(), this.getRandomTrajectory);
//         ant.setBounce(1).setCollideWorldBounds(true);
//         this.xVel = xVel;
//         this.yVel = yVel;
//         this.xpos = xpos;
//         this.ypos = ypos;
//         this.moveCounter = 0;
//     }

//     getxVel(){
//         return this.xVel;
//     }

//     getyVel(){
//         return this.yVel;
//     }

//     move() {
//         // let trajectory = Phaser.Math.Between(0, 0, this.xVel, this.yVel);
        
       
//     }

//     getRandomTrajectory(){
//         let rng = Math.random() - .495;
//         return (rng*10);
//     }

// }

