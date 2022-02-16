import 'phaser';
export default class ListChart {
    constructor(x, y, scores){
        this.x = x;
        this.y = y;
        this.keys = Object.keys(scores);
        this.scores = scores;
        this.lbdLength = this.keys.length;
        console.log(`lbdLength is ${this.lbdLength}`);
    }
    getCode(){
        let codeString = [];
        let key = 1;
        let val = this.scores[1];
        codeString.push(`this.add.text(${this.x}, ${this.y+30}, ${val.score}, {font: '12px Courier', fill: '#00ff00'})`);
        codeString.push(`this.add.text(${this.x+400}, ${this.y+30}, ${val.score}, {font: '12px Courier', fill: '#00ff00'})`);
        return codeString;
    }
}