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
        console.log(this.elapsedTime);
        let score = Math.round(Math.min(self.guessTime, this.elapsedTime)/Math.max(self.guessTime, this.elapsedTime) * 10);
        this.add.text(10, 10, 'Game over!', { font: '16px Courier', fill: '#00ff00' });
        this.add.text(10, 30, `Predicted Duration: ${self.guessTime} Actual Duration: ${this.elapsedTime}`, { font: '16px Courier', fill: '#00ff00' });
        console.log('working endScene!');

        let key = Math.random().toString(32).slice(2);
        const date = new Date();
        var newScore = {};
        newScore[key] = {
                'date' : `${date.getMonth()}/${date.getDay()}/${date.getYear()}`,
                'guessTime' : self.guessTime,
                'elapsedTime' : this.elapsedTime,
                'score': score
        }
        
        
        // fs.readFile('./runtime/scores.json', function readFileCallback(err, data) {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         cachedScores = JSON.parse(data);
        //     }
        // }));

        // console.log(updateCache(newScore));
        // let lbdLen = Object.keys(leaderboard).length;
        // if(lbdLen > 10){
        //     leaderboard.sort((a, b)=>{return (a-b)});
        // }
        // delete Object.keys(leaderboard)[10];
        // let lbdCss = new ListChart(50, 50, leaderboard);
        // console.log(lbdCss.getCode());
        // eval(lbdCss.getCode());
    }
    // static async updateCache(score){
    //     var cachedScores = [];
    //     const result = await addScoreToCache(score);
    //     cache.keys().then(function(keys){
    //         keys.forEach((key)=>{
    //             cache.match(key).then(function(result){
    //                 cachedScores.push(result);
    //             })
    //         })
    //     })
    //     .then(function(){
    //         return cachedScores;
    //     })
    // }
    // static async addScoreToCache(score){
    //     cache.put(score).then(
    //         function(){return 1}
    //     );
    // }
}
