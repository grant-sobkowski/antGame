import gameScene from './gameScene.js';
import titleScreen from './titleScreen.js';
import endScene from './endScene.js';
// import titleScreen from './titleScreen.js'

export default {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1600,
    height: 800,
    backgroundColor: '#ffffff',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        },
    },
    scene: [titleScreen, gameScene, endScene]
};