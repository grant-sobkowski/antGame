import Phaser from 'phaser';
import config from './config.js';
import gameScene from './gameScene.js';
// import endScene from './endScene.js';

class Game extends Phaser.Game{
    constructor(){
        super(config);
    }
}

window.onload = function(){
    var game = new Game();
    window.game = game;
}