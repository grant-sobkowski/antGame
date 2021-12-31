import 'phaser';
import antImg from './img/pixelAnt.png';
import antWithFoodImg from './img/pixelAntWithFood.png';
import nestImg from './img/barrelGreen_top.png';
import toNest from './img/barrelRed_top.png';
import toFood from './img/treeGreen_small.png';
import boulder from './img/boulder.png';
import Button from './button.js';

export default class gameScene extends Phaser.Scene{
    constructor() {
        super('gameScene');
        this.moveCounter = 0;
        this.antArray = [];
    }
//PHASER BASE FUNCTION: initializes scene vars
    initialize(){
        Phaser.Scene.call(this, { "key": "gameScene" });
    }
//PHASER BASE FUNCTION: preloads required assets
    preload(){
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: './src/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
        this.load.image('ant', antImg);
        this.load.image('antWithFood', antWithFoodImg);
        this.load.image('nest', nestImg);
        this.load.image('toNestPath', toNest);
        this.load.image('toFoodPath', toFood);
        this.load.image('boulder', boulder);
    }
//PHASER BASE FUNCTION: initializes starting objects
    create(){
        var self = this;
        //set background color
        this.cameras.main.setBackgroundColor('#808080')
        //bounds
        this.physics.world.setBounds(0, 0, 1200, 800);

        let fArrX = [];
        let fArrY = [];
        //nest
        let nestCoords = this.spawnNest();
        fArrX.push(nestCoords[0]+98);
        fArrY.push(nestCoords[1]-70);

        //debug
        this.dbgText = this.add.text(10, 10, 'Move the mouse', { font: '16px Courier', fill: '#00ff00' });
        this.endButton = new Button(1100, 30, "End Simulation", this, () => this.isGameScene(false));
        
        //groups
        this.foodMarkers = this.physics.add.staticGroup();
        this.markers = this.physics.add.staticGroup();
        this.boulders = this.physics.add.staticGroup();
        this.antGroup = this.physics.add.group();
        this.antGroupWithFood = this.physics.add.group();

        //food sprite/hpbar
        this.food = this.physics.add.staticSprite(1000, 200, 'toFoodPath');
        this.food.setSize(75, 75);
        this.foodHP = 100;
        this.foodHpBar = new Phaser.GameObjects.Graphics(this);
        this.foodCoords = [1000, 200];
        fArrX.push(1098);
        fArrY.push(-50);
        this.drawFood(this.foodCoords[0], this.foodCoords[1]);
        this.add.existing(this.foodHpBar);

        //spawnFeatures
        this.spawnFeatures(fArrX, fArrY);
        this.addInputContainer();
        self.guessTime = 0;
    }
    addInputContainer(){
        this.box = this.add.rectangle(600, 750, 1200, 100, 0xd3d3d3, 80);
        //scroller is of type container
        this.instructions = this.add.text(100, 710, "Guess how long the ants will take:", { font: '18px Courier', fill: '#ffffff' })
        this.sliderTxt = this.add.text(320, 755, "10 Seconds", { font: '16px Courier', fill: '#ffffff' });
        this.scroller = this.createSlider(this.sliderTxt);
        this.startButton = new Button(900, 750, "Start Simulation", this, () => this.startSim());
    }
    destroyInputContainer(){
        this.box.destroy();
        this.instructions.destroy();
        this.sliderTxt.destroy();
        this.scroller.destroy();
        this.startButton.destroy();
    }
    spawnNest(){
        this.nestX = this.getRandomInt(500);
        this.nestY = this.getRandomInt(650)
        let nestCoords = [this.nestX, this.nestY];
        this.nest = this.physics.add.staticSprite(nestCoords[0], nestCoords[1], 'nest')
        .setSize(30, 30);
        return [this.nestX, this.nestY]
    }
    startSim(){

        console.log('startSim() called!');
        //spawns ants, timer, and despawns config stuff.
        //spawns ants
        this.destroyInputContainer();
        this.addAnts(15);
        //adds colliders
        this.physics.add.overlap(this.antGroup, this.foodMarkers, this.collisionMarker, null, this);
        this.physics.add.overlap(this.antGroupWithFood, this.markers, this.collisionMarker, null, this);
        this.physics.add.collider(this.boulders, this.antGroup, this.collisionBoulder, null, this);
        this.physics.add.collider(this.boulders, this.antGroupWithFood, this.collisionBoulder, null, this);
        //start timer
        this.sceneStartTime = this.time.now;
    }
    createSlider(sliderText){
        const COLOR_PRIMARY = 0x4e342e;
        const COLOR_LIGHT = 0x7b5e57;
        const COLOR_DARK = 0x260e04;

        return this.rexUI.add.slider({
            x: 200,
            y: 765,
            width: 200,
            height: 20,
            orientation: 0,
        
            track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 6, COLOR_DARK),
            thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),
 

            valuechangeCallback: function(newValue, oldValue, slider) {
                let secs = 600*newValue + 10;
                let mins = Math.floor(secs/60);
                self.guessTime = secs;
                secs = Math.round(secs % 60);
                sliderText.text = `${mins} minutes ${secs} seconds`;
            },
        
            space: {
                top: 4,
                bottom: 4,
            },      
            input: 'drag', 
        
            enable: true
        }).layout();   
    }
    spawnFeatures(featureArrX, featureArrY){
        let numBoulders = this.getRandomInt(10)+1;
        for(let i=0; i<numBoulders; i++){
            let x = this.getRandomInt(1150);
            let y = this.getRandomInt(650);
            while(this.checkOverlap(featureArrX, featureArrY, x, y)){
                console.log('checkOverlap returned true');
                x = this.getRandomInt(1150);
                y = this.getRandomInt(650);
            }
            console.log(`boulder spawned at ${x}, ${y}`);
            this.boulders.create(x, y, 'boulder')
            .setScale(.25)
            .setBodySize(70, 70)
            .setOffset(153, 170);
        }
    }
    checkOverlap(arrX, arrY, x, y){
        for(let i=0; i<arrX.length; i++){
            if((x > arrX[i]-200) && (x < arrX[i]+200)){
                if((y > arrY[i]-200) && (y < arrY[i]+200)){
                    return true;
                }
            }
        }
        return false;
        //returns true if features overlap
    }
    //creates ants + collider objects
    addAnts(number){
        for(let i=0; i<number; i++){
            let ant = this.physics.add.sprite(this.nestX, this.nestY, 'ant');
            ant.setSize(10, 10);
            let xVel = new Object();
            let yVel = new Object();
            let lastMark = undefined;
            let markerCountToNest= 0;
            xVel.value = this.getRandomTrajectory();
            yVel.value = this.getRandomTrajectory();
            ant.setCollideWorldBounds(true);
            ant.setVelocity(xVel.value, yVel.value);
            ant.angle = this.radToDeg(Phaser.Math.Angle.Between(0, 0, xVel.value, yVel.value)) + 90;
            this.antGroup.add(ant);
            ant.setData({'mode': 'randomTraj', 'xVel': xVel, 'yVel': yVel, 'lastMark': lastMark, 'markerCountToNest': markerCountToNest});
            this.physics.add.collider(ant, this.food, this.collisionFood, null, this);
            this.physics.add.overlap(ant, this.nest, this.collisionNest, null, this);
            this.antArray.push([ant, xVel, yVel, lastMark, markerCountToNest]);
        }
    }
    drawFood(x, y){
        x-=38;
        y+=50;

        this.foodHpBar.clear();
    //background
        this.foodHpBar.fillStyle(0x000000);
        this.foodHpBar.fillRect(x, y, 77, 12);
        this.foodHpBar.fillStyle(0xffffff);
        this.foodHpBar.fillRect(x+2, y+2, 73, 8);
    //health
        this.foodHpBar.fillStyle(0x00ff00);
        let p = 0.73;
        let d = Math.floor(p * this.foodHP);
        this.foodHpBar.fillRect(x + 2, y + 2, d, 8);

    }
    
//PHASER BASE FUNCTION: called each in game tick occurs
    update(){
        try{
        if((this.moveCounter % 60) == 0){
            this.updatePaths();
            if(Math.random()<.4){
                this.turnAnts();
            }
        }
        }catch(e){
            console.error(e);
        }
        try{
        // this.text.setText(`time elapsed: ${Math.round(this.time.now) - Math.round(this.sceneStartTime)}`);
        this.dbgText.setText(`x: ${game.input.mousePointer.x} y: ${game.input.mousePointer.y} guessTime: ${self.guessTime} elapsedTime: ${this.time.now - this.sceneStartTime}`);
        }catch(e){
            console.error(e);
        }
        this.moveCounter++;
        this.updateAnts();
        this.drawFood(1000, 200);
        this.isGameScene();
    }
////UPDATE CALLBACK FUNCTIONS////
    updateAnts(){
        this.antArray.forEach((ant)=>{
            if(ant[0].getData('mode')=='randomTraj'){
                ant[0].setVelocity(ant[1].value, ant[2].value);
                ant[0].angle = this.radToDeg(Phaser.Math.Angle.Between(0, 0, ant[1].value, ant[2].value)) + 90;
            }
            else if(ant[0].getData('mode')=='toFood'){
                let nextMarker = ant[0].getData('nextMark');
                this.antToFood(ant[0], nextMarker);
                return 0;
            }
            else if(ant[0].getData('mode')=='toNest'){
                let nextMarker = ant[0].getData('lastMark');
                if(nextMarker==undefined){
                    ant[0].setData('mode', 'randomTraj');
                    return 0;
                }
                this.antToNest(ant[0], nextMarker);
                return 0;
            }
        });
    }
    //Movement mode: causes ant to follow markers
    antToFood(ant, nextMarker){
        // try{
        // console.log('nextMarker test: ' + nextMarker.getData('nextMark').x);
        // }catch(e){
        //     console.error(e);
        // }
        let nextMarkerPrime;
        let targetXpos = nextMarker.x;
        let targetYpos = nextMarker.y;
        let diffX = Math.abs(ant.x - nextMarker.x);
        let diffY = Math.abs(ant.y - nextMarker.y);
        if(diffX < 3 && diffY < 3){
            ant.setData('lastMark', nextMarker);
            ant.setData('nextMark', nextMarker.getData('nextMark'));
            nextMarkerPrime = ant.getData('nextMark');
            targetXpos = nextMarkerPrime.x;
            targetYpos = nextMarkerPrime.y;
        };
        ant.angle =  this.radToDeg(Phaser.Math.Angle.Between(ant.x, ant.y, targetXpos, targetYpos)) +90;
        let normalAngle = this.phaserAngleToNormal(ant.angle);
        if(normalAngle < 0){
            normalAngle += 360;
        }
        let hypotenuse = 80;
        let xVel = hypotenuse * Math.cos(this.degToRad(normalAngle));
        let yVel = -1 * hypotenuse * Math.sin(this.degToRad(normalAngle));

        ant.setVelocity(xVel, yVel);
    }
    //Movement mode -> ants move at constant speed of 20 while moving
    antToNest(ant, nextMarker){
        let targetXpos = nextMarker.x;
        let targetYpos = nextMarker.y;
        let diffX = Math.abs(nextMarker.x - ant.x);
        let diffY = Math.abs(nextMarker.y - ant.y);
        if(diffX < 3 && diffY < 3){
            try{
            let markerCountToFood = ant.getData('markerCountToFood');
            if(nextMarker.getData('isToFood')==false){
                this.foodMarkers.add(nextMarker);
                let markToNest = ant.getData('nextMark');
                nextMarker.setData({'isToFood': true, 'nextMark': markToNest, 'indexToFood': markerCountToFood});
                nextMarker.setTexture('toFoodPath');
            }
            ant.setData({'nextMark': nextMarker, 'lastMark': nextMarker.getData('lastMark'), 'markerCountToFood': markerCountToFood+1});
            nextMarker = nextMarker.getData('lastMark');
            targetXpos = nextMarker.x;
            targetYpos = nextMarker.y;
            }catch(e){
                console.error(e);
            }
        };
        ant.angle =  this.radToDeg(Phaser.Math.Angle.Between(ant.x, ant.y, targetXpos, targetYpos)) +90;
        let normalAngle = this.phaserAngleToNormal(ant.angle);
        if(normalAngle < 0){
            normalAngle += 360;
        }
        let hypotenuse = 80;
        let xVel = hypotenuse * Math.cos(this.degToRad(normalAngle));
        let yVel = -1 * hypotenuse * Math.sin(this.degToRad(normalAngle));

        ant.setVelocity(xVel, yVel);
    }

    //Creates new path markers and assigns them the relevent data
    updatePaths(){
        //ant[3] = last marker obj (undefined if nest/food) ant[4] = iterator count to determine pos in list
        this.antArray.forEach((ant)=>{
            if(ant[0].getData('mode')=='randomTraj'){
                let marker = this.markers.create(ant[0].x + 7, ant[0].y +7, 'toNestPath');
                marker.setScale(.2);
                marker.setBodySize(15, 15);
                marker.setDisplayOrigin(45, 45);
                marker.setData({'lastMark': ant[3], 'isToFood': false, 'indexToNest': ant[0].getData('markerCountToNest'), 'hostAnt':ant[0]});
                ant[3] = marker;
                ant[0].setData('lastMark', marker);
                ant[4]++;
            }
            else{
                return 0;
            }
        });
    }
    turnAnts(){
        this.antArray.forEach((ant)=>{
            if(ant[0].getData('mode')=='randomTraj'){
            this.handleTurn(ant[0], ant[1], ant[2]);
            }
        });
    }
    //Creates a tween (phaser object which updates a parameter slowly) and adjusts ant velocities to random nums
    handleTurn(ant, xVel, yVel){
        let newX = this.getRandomTrajectory();
        let newY = this.getRandomTrajectory();
        if(ant.x < 150){
            newX = Math.abs(newX);
        }
        else if(ant.x > 1050){
            newX = -1*Math.abs(newX);
        }
        if(ant.y < 100){
            newY = Math.abs(newY);
        }
        else if(ant.y > 600){
            newY = -1*Math.abs(newY);
        }

        let tweenX = this.tweens.add({
            targets: xVel,
            value: newX,
            duration: 2000
        });
        let tweenY = this.tweens.add({
            targets: yVel,
            value: newY,
            duration: 2000
        });
    }
    isGameScene(command = true){
        //triggers end game
        if(this.foodHP <= 0 || !command){
            let gTime = this.roundDec(self.guessTime, 2);
            let elapsedTime = (this.time.now - this.sceneStartTime)/100;
            this.scene.start("endScene", {guessTime: gTime, elapsedTime: elapsedTime});
        }
        // TODO update score graphic
    }

////EVENT CALLBACK FUNCTIONS////
    collisionNest(ant, nest){
        if(ant.getData('mode')==='toNest'){
            console.log('collisionNest called!');
            this.antGroupWithFood.kill(ant);
            ant.setData('mode', 'randomTraj');
            ant.setTexture('ant');
            ant.setVelocity(this.getRandomTrajectory(), this.getRandomTrajectory);
            this.addAnts(1);
        }
    }
    //If ant is in randomTraj mode, updates trail, if ant is in toFood mode, updates ant mode
    collisionFood(ant, food){
        if(ant.getData('mode')==='randomTraj'){
            this.foodHP-= 100;
            let currentMark = ant.getData('lastMark');
            ant.setData('markerCountToFood', 0);
            let dummyHead = new Object();
            dummyHead.x = this.foodCoords[0];
            dummyHead.y = this.foodCoords[1];
            this.foodMarkers.add(currentMark);
            this.markers.kill(currentMark);
            //sets nextMark, count and isToFood
            currentMark.setData({'isToFood': true, 'indexToFood': 0, 'nextMark': dummyHead});
            //updates texture
            currentMark.setTexture('toFoodPath');
            //advances loop forward
            ant.setData({'mode': 'toNest', 'markerCountToNest': 0, 'markerCountToFood': 0});
            ant.setTexture('antWithFood');
            this.antGroupWithFood.add(ant);
        }
        else if(ant.getData('mode')==='toFood'){
            this.antGroupWithFood.add(ant);
            this.foodHP-=20;
            ant.setData('mode', 'toNest');
            ant.setTexture('antWithFood');
        }
    }
    //puts ant on path towards food
    collisionMarker(ant, marker){
    //works!
        if(marker.getData('hostAnt')==ant){
            return 0;
        }
        if(ant.getData('mode')==='randomTraj'){
            if(marker.getData('isToFood')){
                console.log('randomTraj ant hit toFood marker! new marker = ' + marker.x + ' ' + marker. y);
                this.antGroupWithFood.add(ant);
                ant.setData({'mode': 'toFood', 'nextMark': marker});
            }
        }
        else if(ant.getData('mode')==='toNest'){
            let lastMark = ant.getData('lastMark');
            if(lastMark == undefined){
                ant.setData('mode', 'randomTraj');
                return 0;
            }
            if(marker.getData('indexToNest')<ant.getData('lastMark').getData('indexToNest')){
                //marker has shorter route to nest than ant's current path
                ant.setData('lastMark', marker);
                if(marker.getData('isToFood')){
                //compare toFoodIndex to ant's last marker +1
                    if(ant.getData('indexToFood')<marker.getData(indexToFood)){
                        marker.setData({'indexToFood': ant.getData('indexToFood'), 'nextMark': ant.getData('nextMark')})
                    }
                }
                if (!this.foodMarkers.contains(marker)){
                    this.foodMarkers.add(marker);
                }
                marker.setData({'nextMark': lastMark, 'isToFood': true, 'indexToFood': lastMark.getData('indexToFood')+1});
                marker.setTexture('toFoodPath');
            }
        }
    }
    collisionBoulder(ant, boulder){
        if(ant.getData('mode')=='toNest'){
            ant.setData('mode', 'randomTraj');
        }
        else if(ant.getData('mode')=='toFood'){
            ant.setData('mode', 'randomTraj');
        }
    }
    // collisionToNestMarker(ant, toNestMarker){
    //     if(toNestMarker.getData('hostAnt')==ant){
    //         return 0;
    //     }
    //     else if(ant.getData('mode')=='randomTraj'){
    //         ant.setData('mode'=='toFood');
    //     }
    //     //TODO: add tween to direct ant towards next marker
    // }

////UTILITY////
        //Name: converts radians to degrees
        roundDec(number, decimalsToKeep){
            let powScale = 10**decimalsToKeep;
            return(Math.round(number*powScale)/powScale);
        }
        radToDeg(number){
            const pi = Math.PI;
            let ratio = number/(2*pi);
            let degrees = ratio*360;
            return degrees;
        }
        degToRad(number){
            const pi = Math.PI;
            let ratio = number/360;
            let radians = ratio*2*pi;
            return radians;
        }
        //returns variable speed for ants from -100 to 100
        getRandomTrajectory(){
            let rng = Math.random() - .495;
            return (rng*200);
        }
        getRandomInt(max){
            return Math.floor(Math.random() * max);
        }
        phaserAngleToNormal(angle){
            return((-1* angle) + 90);
        }
}