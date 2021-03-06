import 'phaser';
import TweenHelper from './components/tweenHelper.js';
import Button from './components/button.js';
import nextButton from './img/arcadeNextButton.png';
import nextButtonSm from './img/nextButton_small.png';
import background from './img/background_sand.png';
import homeButton from './img/homeButton_wide2.png';
import "babel-polyfill";
import NameInput from './components/NameInput.js';
import block from './img/p_block.png';
import rub from './img/p_rub.png';
import end from './img/p_end.png';
import rightButton from './img/right_button4.png';
import leftButton from './img/left_button.png';
import leaderboardBanner from './img/antGame_bannerThin.png';

export default class endScene extends Phaser.Scene{
    constructor(){
        super('endScene');
        this.chars = [
            [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ],
            [ 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T' ],
            [ 'U', 'V', 'W', 'X', 'Y', 'Z', '.', '-', '<', '>' ]
        ];
        this.cursor = new Phaser.Math.Vector2();
    }
    init(data){
    //data variable passes information from gameScene
    var self = this;
    this.isLeaderboardVal = data.isLeaderboard;
    self.guessTime = data.guessTime;
    this.elapsedTime = data.elapsedTime;
    }
    preload(){
        this.load.plugin('rexanchorplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexanchorplugin.min.js', true);
        this.load.image('nextButton', nextButton);
        this.load.image('nextButton_small', nextButtonSm);
        this.load.image('background', background);
        this.load.image('homeButton', homeButton);
        this.load.image('block', block);
        this.load.image('rub', rub);
        this.load.image('end', end);
        this.load.image('rightButton', rightButton);
        this.load.image('leftButton', leftButton);
        this.load.image('banner', leaderboardBanner);
    }
    create(){
        let sandImage = this.add.image(10, 10, 'background');
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
        this.screenCenterX = 640;
        this.screenCenterY = 360;
        this.page = 1;
        this.prevPage = null;
        this.pageNum = null;
        if(this.isLeaderboard(this.isLeaderboardVal) === false){
            let date = new Date();
            let score = Math.round(Math.min(self.guessTime, this.elapsedTime)/Math.max(self.guessTime, this.elapsedTime) * 1000000);
            this.newScore = {
                    'score' : score,
                    'date' : date,
                    'name': "GMS"
            }
            let newScore = this.newScore;
            this.spawnScore(newScore, score);
        }
    }
    async getScores(data = {}){
        try{
            let response = await fetch('https://ant-game.herokuapp.com/leaderboard');
            let strVal = await response.json();
            console.log(strVal);
            return(strVal);
        }catch(e){
            console.error(e);
            return -1;
        }
    }
    async postScore(newScore){
        try{
            let configObj = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(newScore) // body data type must match "Content-Type" header
            }
            let rawResp = await fetch('https://ant-game.herokuapp.com/leaderboard', configObj);
            // console.log(rawResp);
            console.log("post status = " + rawResp.status);
            return 1;
        }catch(e){
            console.error(e);
            return -1;
        }
    }
    isLeaderboard(bool){
        if(bool){
            this.spawnLeaderboard();
            return true;
        }
        return false;
    }
    //TODO Create function to store top 10 scores in localStorage
    //Keys stored as 1-10
    //Function tries to read keys 10-1, if one or more is missing, add score to appropriate position without removing any
    //If 10 scores, sort list and remove bottom one
    spawnScore(newScore, score){
        let s1 = this.add.bitmapText(this.screenCenterX, 150, 'MinecraftFont', 'Game Over!').setOrigin(0.5);
        TweenHelper.flashElement(this, s1);
        let s2 = this.add.bitmapText(this.screenCenterX, 245, 'MinecraftFont', 'Estimated Time: ' + Math.round(self.guessTime), 30).setOrigin(0.5);
        let s3 = this.add.bitmapText(this.screenCenterX, 285, 'MinecraftFont', 'Elapsed Time: ' + Math.round(this.elapsedTime), 30).setOrigin(0.5);
        let s4 = this.add.bitmapText(this.screenCenterX, 325, 'MinecraftFont', 'Score: ' + score, 30).setOrigin(0.5);
        let nextButton = this.add.sprite(this.screenCenterX, 420, 'nextButton').setInteractive().setScale(.6).setOrigin(0.5);
        nextButton.on('pointerdown', ()=>{
            this.destroyElems(s1, s2, s3, s4, nextButton);
            this.spawnNameInput(newScore);
        })
        nextButton.on('pointerover', ()=>nextButton.setTint(0x03a8f4));
        nextButton.on('pointerout', ()=>nextButton.clearTint());
    }
    async spawnNameInput(newScore){
        try{
            let resp = await this.getScores();

            let scores = resp.sort((a, b)=> b.score - a.score);
            let count = 0;
            while(newScore.score < scores[count].score){
                count++;
            }
            newScore.rank = count + 1;

            let prompt = this.add.bitmapText(this.screenCenterX, 244, 'MinecraftFont', 'Enter Your Name:', 40).setOrigin(0.5);
            TweenHelper.flashElement(this, prompt);
    
            let h1 = this.add.bitmapText(this.screenCenterX - 240, 80, 'MinecraftFont', 'Rank', 38).setOrigin(0.5);
            let h2 = this.add.bitmapText(this.screenCenterX, 80, 'MinecraftFont', 'Score', 38).setOrigin(0.5);
            let h3 = this.add.bitmapText(this.screenCenterX + 240, 80, 'MinecraftFont', 'Name', 38).setOrigin(0.5);
            this.nameText = this.add.bitmapText(this.screenCenterX + 240, 130, 'MinecraftFont', '', 28).setOrigin(0.5);
            let g2 = this.add.bitmapText(this.screenCenterX, 130, 'MinecraftFont', newScore.score, 28).setOrigin(0.5);
            let g3 = this.add.bitmapText(this.screenCenterX - 240, 130, 'MinecraftFont', newScore.rank, 28).setOrigin(0.5);
            let b1 = this.add.sprite(this.screenCenterX - 100, 640, 'homeButton').setOrigin(0.5);
            let b2 = this.add.sprite(this.screenCenterX + 100, 640, 'nextButton_small').setOrigin(0.5);
            b1.setInteractive();
            b1.on('pointerdown', ()=>this.scene.start("titleScreen"));
            b2.setInteractive();
            b2.on('pointerdown', async ()=>{
                //TODO: Require name input
                await this.postScore(this.newScore);
                this.destroyElems(prompt, h1, h2, h3, this.nameText, g2, g3, input, b1, b2)
                this.spawnLeaderboard();
            });
            b1.on('pointerover', ()=>b1.setTint(0x03a8f4));
            b1.on('pointerout', ()=>b1.clearTint());
            b2.on('pointerover', ()=>b2.setTint(0x03a8f4));
            b2.on('pointerout', ()=>b2.clearTint());
            let input = new NameInput(this, this.screenCenterX-264, 400);
            input.spawn();
    
            this.events.on('updateName', this.updateName, this);
            this.events.on('submitName', (name)=>{
                //todo: lock further inputs, add tween to next button
            })
        }catch(e){
            console.error(e);
        }
    }

    updateName(name){
        this.nameText.setText(name);
        this.newScore.name = name;
    }
    //creates Leaderboard
    async spawnLeaderboard(){
        let scores = await this.getScores();
        scores = scores.sort((a, b)=> b.score - a.score);
        let rank = this.add.bitmapText(this.screenCenterX-300, 122, 'MinecraftFont', 'Rank', 38).setOrigin(.5);
        let score = this.add.bitmapText(this.screenCenterX-100, 122, 'MinecraftFont', 'Score', 38).setOrigin(.5);
        let playerName = this.add.bitmapText(this.screenCenterX+100, 122, 'MinecraftFont', 'Name', 38).setOrigin(0.5);
        let date = this.add.bitmapText(this.screenCenterX+300, 122, 'MinecraftFont', 'Date', 38).setOrigin(.5);
        // let scoresList = this.getList(newScore);
        // this.updateList(scoresList);
        // this.renderList(scoresList, this);
        let pageNum = Math.ceil(scores.length/10);
        this.pageNum = pageNum;
        this.pageCounter = this.add.bitmapText(this.screenCenterX, 590, 'MinecraftFont', this.page+"/"+pageNum, 25).setOrigin(0.5);
        let rb = this.add.sprite(this.screenCenterX + 65, 590, 'rightButton').setInteractive();
        let lb = this.add.sprite(this.screenCenterX - 65, 590, 'leftButton').setInteractive();
        
        this.prevPage = this.renderList(scores, this);

        rb.on('pointerdown', ()=>this.incPage(pageNum, scores));
        rb.on('pointerover', ()=>rb.setTint(0x03a8f4));
        rb.on('pointerout', ()=>rb.clearTint());
        lb.on('pointerdown', ()=>this.decPage(pageNum, scores));
        lb.on('pointerover', ()=>lb.setTint(0x03a8f4));
        lb.on('pointerout', ()=>lb.clearTint());


        let banner = this.add.image(this.screenCenterX, 50, 'banner').setOrigin(0.5);
        let homeButton = this.add.sprite(this.screenCenterX, 650, 'homeButton').setInteractive();
        homeButton.on('pointerdown', ()=>{
            this.scene.start("titleScreen");
        })
        homeButton.on('pointerover', ()=>homeButton.setTint(0x03a8f4));
        homeButton.on('pointerout', ()=>homeButton.clearTint());
    }
    renderList(scores, scene){
        let pageScores = scores.slice(10*(this.page-1), ((10*(this.page-1))+10));
        // console.log("page = " + this.page);
        // console.log(`page scores = ${pageScores}`);
        let ldbdObjArr = [];
        for(let i=0; i<pageScores.length; i++){
            let a = scene.add.bitmapText(this.screenCenterX-300, 170 + i*40, 'MinecraftFont', i+(10*(this.page-1))+1, 30).setOrigin(0.5);
            let b = scene.add.bitmapText(this.screenCenterX-100, 170 + i*40, 'MinecraftFont', pageScores[i].score, 30).setOrigin(0.5);
            let c = scene.add.bitmapText(this.screenCenterX+100, 170 + i*40, 'MinecraftFont', pageScores[i].name, 30).setOrigin(0.5);
            let mm = pageScores[i].date.slice(5,7);
            let yy = pageScores[i].date.slice(2,4);
            let dd = pageScores[i].date.slice(8,10);
            let d = scene.add.bitmapText(this.screenCenterX+300, 170 + i*40, 'MinecraftFont', mm + '/' + dd + '/' + yy, 30).setOrigin(0.5);
            ldbdObjArr.push(a, b, c, d);
        }
        return(ldbdObjArr);
    }
    incPage(pageNum, scores){
        if((this.page) < pageNum){
            this.destroyArr(this.prevPage);
            this.page++;
            this.pageCounter.setText(this.page + "/" + pageNum);
            this.prevPage = this.renderList(scores, this);
        }
    }
    decPage(pageNum, scores){
        if((this.page-1) > 0){
            this.destroyArr(this.prevPage);
            this.page--;
            this.pageCounter.setText(this.page + "/" + pageNum);
            this.prevPage = this.renderList(scores, this);
        }
    }
    destroyArr(arr){
        arr.forEach((el)=>el.destroy());
    }
    destroyElems(...elems){
        elems.forEach((elem)=>elem.destroy());
    }
}
