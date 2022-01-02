import 'phaser';
import ListChart from './listChart.js';

export default class endScene extends Phaser.Scene{
    constructor(){
        super('endScene');
    }
    init(data){
    //data variable passes information from gameScene
    var self = this;
    self.guessTime = data.guessTime;
    this.elapsedTime = data.elapsedTime;
    console.log(data);
    }
    preload(){
    }
    create(){
        console.log('endScene start /////////////////////');
        let score = Math.round(Math.min(self.guessTime, this.elapsedTime)/Math.max(self.guessTime, this.elapsedTime) * 10);
        this.add.text(10, 10, 'Game over!', { font: '16px Courier', fill: '#00ff00' });
        this.add.text(10, 30, `Predicted Duration: ${self.guessTime} Actual Duration: ${this.elapsedTime}`, { font: '16px Courier', fill: '#00ff00' });
        const date = new Date();
        if(!score){
            score = 0;
        }
        let newScore = {
                'date' : `${date.getMonth()}/${date.getDay()}/${date.getYear().toString().slice(1)}`,
                'guessTime' : self.guessTime,
                'elapsedTime' : this.elapsedTime,
                'score': score
        }
        let leaderboard = this.getList(newScore);
        console.log(`full leaderboard: ${leaderboard}`);
        this.renderList(10, 100, leaderboard, this);
    }
    //TODO Create function to store top 10 scores in localStorage
    //Keys stored as 1-10
    //Function tries to read keys 10-1, if one or more is missing, add score to appropriate position without removing any
    //If 10 scores, sort list and remove bottom one

    getList(newScore){
        let scores = [];
        scores.push(newScore);
        for(let i=1; i<11; i++){
            try{
                let score = JSON.parse(localStorage.getItem(i.toString()));
                scores.push(score);
                console.log(`entry in local storage: key: ${i+1} value: ${score}`);
            }catch(e){console.error(e)}
        }
        scores = scores.filter(val=>{return (val!==null)});
        scores.sort((a,b)=>{return(b.score-a.score)});
        return(scores);
    }
    updateList(scores){
        localStorage.clear();
        for(let i=0; i<scores.length; i++){
            let score = scores[i];
            localStorage.setItem((i+1).toString(), JSON.stringify(score));
        }
    }
    renderList(x, y, scores, scene){
        let count = 30;
        scene.add.text(x, y, 'Your Top Scores:', {font: '16px Courier', fill: '#00ff00'});
        scene.add.line(x, y+25, 0, 0, x+500, 0, 0x00ff00).setOrigin(0);
        scores.forEach((value, index)=>{
            scene.add.text(x, y+count, value.score, {font: '16px Courier', fill: '#00ff00'});
            scene.add.text(x+400, y+count, value.date, {font: '16px Courier', fill: '#00ff00'})
            count+=30;

        })
    }
}
