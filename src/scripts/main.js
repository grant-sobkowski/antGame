const Phaser = require('./phaser.min.js');
const gameScene = require('./game.js');

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
	},
	scene: [gameScene]
};

export default new Phaser.Game(config);