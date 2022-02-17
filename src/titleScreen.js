import 'phaser';
import Button from './components/button.js';
import playButton from './img/playButton.png';
import background from './img/background_sand.png';
import titleArt from './img/antGame_titleArt.png';
import scoreButton from './img/antGame_trophy.png';

export default class titleScreen extends Phaser.Scene{
    constructor(){
        super('titleScreen');
    }
    preload(){
        this.load.plugin('rexanchorplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexanchorplugin.min.js', true);
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });  
        this.load.bitmapFont('minecraftFont', './src/assets/minecraftFont.png', './src/assets/minecraftFont.xml');
        this.load.image('playButton', playButton);
        this.load.image('background', background);
        this.load.image('titleArt', titleArt);
        this.load.image('scoreButton', scoreButton);
    }
    create(){
        let sandImage = this.add.image(0, 0, 'titleArt');
        this.plugins.get('rexanchorplugin').add(sandImage, {
            left: 'left+0',
            top: 'top+0',

            width: '100%',
            // height: '30%',
            onResizeCallback: function (width, height) {
                this.setSize(width, height)
                    .updateDisplayOrigin()  // Bug, fixed in p3.60
            },
            onResizeCallbackScope: sandImage
        });
        const screenCenterX = 640;
        const screenCenterY = 360;
        //add button here
        console.log('working titleScene!');
        let playButton = this.add.image(640, 600, 'playButton').setInteractive();
        let scoreButton = this.add.sprite(1240, 30, 'scoreButton').setInteractive();
        playButton.on('pointerdown', ()=>{
            this.scene.start("gameScene");
        })
        playButton.on('pointerover', ()=>playButton.setTint(0x03a8f4));
        playButton.on('pointerout', ()=>playButton.clearTint());
        scoreButton.on('pointerdown', ()=>{
            this.scene.start("endScene", {isLeaderboard: true});
        })
        scoreButton.on('pointerover', ()=>scoreButton.setTint(0x03a8f4));
        scoreButton.on('pointerout', ()=>scoreButton.clearTint());

    }
    spawnInstructions(){
        var dialog = this.rexUI.add.dialog({
                x: 800,
                y: 300,
                width: 500,

                background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

                title: this.createLabel(this, 'Title').setDraggable(),

                toolbar: [
                    this.createLabel(this, 'X')
                ],

                content: this.createLabel(this, 'Content'),

                description: this.createLabel(this, 'Description'),

                actions: [
                    this.createLabel(this, 'Back')
                ],

                space: {
                    left: 20,
                    right: 20,
                    top: -20,
                    bottom: -20,

                    title: 25,
                    titleLeft: 30,
                    content: 25,
                    description: 25,
                    descriptionLeft: 20,
                    descriptionRight: 20,
                    choices: 25,

                    toolbarItem: 5,
                    choice: 15,
                    action: 15,
                },

                expand: {
                    title: false,
                    // content: false,
                    // description: false,
                    // choices: false,
                    // actions: true,
                },

                align: {
                    title: 'center',
                    // content: 'left',
                    // description: 'left',
                    // choices: 'left',
                    actions: 'right', // 'center'|'left'|'right'
                },

                click: {
                    mode: 'release'
                }
            })
            .setDraggable('background')   // Draggable-background
            .layout()
            // .drawBounds(this.add.graphics(), 0xff0000)
            .popUp(1000);

        var tween = this.tweens.add({
            targets: dialog,
            scaleX: 1,
            scaleY: 1,
            ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: 0, // -1: infinity
            yoyo: false
        });

        this.print = this.add.text(0, 0, '');
        dialog
            .on('button.click', function (button, groupName, index, pointer, event) {
                this.print.text += groupName + '-' + index + ': ' + button.text + '\n';
            }, this)
            .on('button.over', function (button, groupName, index, pointer, event) {
                button.getElement('background').setStrokeStyle(1, 0xffffff);
            })
            .on('button.out', function (button, groupName, index, pointer, event) {
                button.getElement('background').setStrokeStyle();
            });
    }
    createLabel(scene, text) {
        return scene.rexUI.add.label({
            width: 40, // Minimum width of round-rectangle
            height: 40, // Minimum height of round-rectangle
          
            background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x5e92f3),
    
            text: scene.add.text(0, 0, text, {
                fontSize: '24px'
            }),
    
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }
        });
    }
    update(){
    }
}