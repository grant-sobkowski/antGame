import 'phaser';
import Button from './button.js';

export default class titleScreen extends Phaser.Scene{
    constructor(){
        super('titleScreen');
    }
    preload(){
    }
    create(){
        //add button here
        this.add.text(415, 50, 'Ant Simulation', { font: '16px Courier', fill: '#00ff00' })
        .setPadding(20)
        .setFill('#0066CC')
        .setBackgroundColor('#00CC66');
        console.log('working titleScene!');
        let startButton = new Button(500, 300, 'Start game', this, () => this.scene.start("gameScene"));

    }
    update(){
    }
}