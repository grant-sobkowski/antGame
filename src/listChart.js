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
        let codeString = "";
        for(let i=0; i<this.lbdLength; i++){
            let scoreObj = this.scores[this.keys[i]];
            codeString.concat(`this.${this.keys[i]}_score = scene.add.text(${this.x}, ${this.y}+30), ${scoreObj.score}, {font: '12px Courier', fill: '#00ff00'} `);
            codeString.concat(`this.${this.keys[i]}_date = scene.add.text(${this.x}+400, ${this.y}+30), ${scoreObj.score}, {font: '12px Courier', fill: '#00ff00'} `);
        }
        return codeString;
    }
}