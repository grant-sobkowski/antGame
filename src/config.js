import gameScene from './gameScene.js';
import titleScreen from './titleScreen.js';
import endScene from './endScene.js';
// import titleScreen from './titleScreen.js'

const DEFAULT_WIDTH = 1280
const DEFAULT_HEIGHT = 720

export default {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    backgroundColor: '#ffffff',
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true
        },
    },
    scale: {
        // Fit to window
        mode: Phaser.Scale.FIT,
        // Center vertically and horizontally
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [titleScreen, gameScene, endScene]
};