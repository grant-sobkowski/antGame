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
    self.guessTime = data.guessTime;
    this.elapsedTime = data.elapsedTime;
    
    console.log(data);
    }
    preload(){
        this.load.plugin('rexanchorplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexanchorplugin.min.js', true);
        this.load.bitmapFont('minecraftFont', './src/assets/minecraftFont.png', './src/assets/minecraftFont.xml');
        this.load.bitmapFont('arcadeFont', './src/assets/gamecom_font.png', './src/assets/gamecom_font.xml');
        this.load.image('nextButton', nextButton);
        this.load.image('nextButton_small', nextButtonSm);
        this.load.image('background', background);
        this.load.image('homeButton', homeButton);
        this.load.image('block', block);
        this.load.image('rub', rub);
        this.load.image('end', end);
        this.load.image('rightButton', rightButton);
        this.load.image('leftButton', leftButton);
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
        let date = new Date();
        let score = Math.round(Math.min(self.guessTime, this.elapsedTime)/Math.max(self.guessTime, this.elapsedTime) * 1000000);
        this.newScore = {
                'score' : score,
                'date' : date,
                'name': "GMS"
        }
        let newScore = this.newScore;
        this.screenCenterX = 640;
        this.screenCenterY = 360;
        this.page = 1;
        this.prevPage = null;
        this.pageNum = null;
        this.spawnScore(newScore, score);
    }
    async getScores(data = {}){
        try{
            let response = await fetch('http://localhost:3000/leaderboard');
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
            let rawResp = await fetch('http://localhost:3000/leaderboard', configObj);
            console.log(rawResp);
            console.log("post status = " + rawResp.status);
            return 1;
        }catch(e){
            console.error(e);
            return -1;
        }
    }
    //TODO Create function to store top 10 scores in localStorage
    //Keys stored as 1-10
    //Function tries to read keys 10-1, if one or more is missing, add score to appropriate position without removing any
    //If 10 scores, sort list and remove bottom one
    spawnScore(newScore, score){
        let s1 = this.add.bitmapText(this.screenCenterX, 150, 'minecraftFont', 'Game Over!').setOrigin(0.5);
        TweenHelper.flashElement(this, s1);
        let s2 = this.add.bitmapText(this.screenCenterX, 245, 'minecraftFont', 'Estimated Time: ' + Math.round(self.guessTime), 30).setOrigin(0.5);
        let s3 = this.add.bitmapText(this.screenCenterX, 285, 'minecraftFont', 'Elapsed Time: ' + Math.round(this.elapsedTime), 30).setOrigin(0.5);
        let s4 = this.add.bitmapText(this.screenCenterX, 325, 'minecraftFont', 'Score: ' + score, 30).setOrigin(0.5);
        let nextButton = this.add.sprite(this.screenCenterX, 420, 'nextButton').setInteractive().setScale(.6).setOrigin(0.5);
        nextButton.on('pointerdown', ()=>{
            this.destroyElems(s1, s2, s3, s4, nextButton);
            this.spawnNameInput(newScore);
        })
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

            let prompt = this.add.bitmapText(this.screenCenterX, 244, 'minecraftFont', 'Enter Your Name:', 40).setOrigin(0.5);
            TweenHelper.flashElement(this, prompt);
    
            let h1 = this.add.bitmapText(this.screenCenterX - 240, 80, 'minecraftFont', 'Rank', 38).setOrigin(0.5);
            let h2 = this.add.bitmapText(this.screenCenterX, 80, 'minecraftFont', 'Score', 38).setOrigin(0.5);
            let h3 = this.add.bitmapText(this.screenCenterX + 240, 80, 'minecraftFont', 'Name', 38).setOrigin(0.5);
            this.nameText = this.add.bitmapText(this.screenCenterX + 240, 130, 'minecraftFont', '', 28).setOrigin(0.5);
            let g2 = this.add.bitmapText(this.screenCenterX, 130, 'minecraftFont', newScore.score, 28).setOrigin(0.5);
            let g3 = this.add.bitmapText(this.screenCenterX - 240, 130, 'minecraftFont', newScore.rank, 28).setOrigin(0.5);
            let b1 = this.add.sprite(this.screenCenterX - 100, 640, 'homeButton').setOrigin(0.5);
            let b2 = this.add.sprite(this.screenCenterX + 100, 640, 'nextButton_small').setOrigin(0.5);
            b1.setInteractive();
            b1.on('pointerdown', ()=>this.scene.start("titleScreen"));
            b2.setInteractive();
            b2.on('pointerdown', async ()=>{
                //TODO: Require name input
                await this.postScore(this.newScore);
                scores = await this.getScores();
                scores = scores.sort((a, b)=> b.score - a.score);
                this.destroyElems(prompt, h1, h2, h3, this.nameText, g2, g3, input, b1, b2)
                this.spawnLeaderboard(scores)
            });
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
    async spawnLeaderboard(scores){
        let rank = this.add.bitmapText(this.screenCenterX-300, 100, 'minecraftFont', 'Rank', 50).setOrigin(.5);
        let score = this.add.bitmapText(this.screenCenterX-100, 100, 'minecraftFont', 'Score', 50).setOrigin(.5);
        let playerName = this.add.bitmapText(this.screenCenterX+100, 100, 'minecraftFont', 'Name', 50).setOrigin(0.5);
        let date = this.add.bitmapText(this.screenCenterX+300, 100, 'minecraftFont', 'Date', 50).setOrigin(.5);
        // let scoresList = this.getList(newScore);
        // this.updateList(scoresList);
        // this.renderList(scoresList, this);
        let pageNum = Math.ceil(scores.length/10);
        this.pageNum = pageNum;
        this.pageCounter = this.add.bitmapText(this.screenCenterX, 580, 'minecraftFont', this.page+"/"+pageNum, 25).setOrigin(0.5);
        let rb = this.add.sprite(this.screenCenterX + 65, 580, 'rightButton').setInteractive();
        let lb = this.add.sprite(this.screenCenterX - 65, 580, 'leftButton').setInteractive();
        
        this.prevPage = this.renderList(scores, this);

        rb.on('pointerdown', ()=>this.incPage(pageNum, scores));
        lb.on('pointerdown', ()=>this.decPage(pageNum, scores));


        this.homeButton = this.add.sprite(this.screenCenterX, 650, 'homeButton').setInteractive();
        this.homeButton.on('pointerdown', ()=>{
            this.scene.start("titleScreen");
        })
    }
    renderList(scores, scene){
        let pageScores = scores.slice(10*(this.page-1), ((10*(this.page-1))+10));
        console.log("page = " + this.page);
        console.log(`page scores = ${pageScores}`);
        let ldbdObjArr = [];
        for(let i=0; i<pageScores.length; i++){
            let a = scene.add.bitmapText(this.screenCenterX-300, 160 + i*40, 'minecraftFont', i+(10*(this.page-1))+1, 30).setOrigin(0.5);
            let b = scene.add.bitmapText(this.screenCenterX-100, 160 + i*40, 'minecraftFont', pageScores[i].score, 30).setOrigin(0.5);
            let c = scene.add.bitmapText(this.screenCenterX+100, 160 + i*40, 'minecraftFont', pageScores[i].name, 30).setOrigin(0.5);
            let mm = pageScores[i].date.slice(5,7);
            let yy = pageScores[i].date.slice(2,4);
            let dd = pageScores[i].date.slice(8,10);
            let d = scene.add.bitmapText(this.screenCenterX+300, 160 + i*40, 'minecraftFont', mm + '/' + dd + '/' + yy, 30).setOrigin(0.5);
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
