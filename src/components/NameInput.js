import 'phaser';

export default class NameInput{
    constructor(scene, posx, posy){
        this.scene = scene;
        this.posx = posx;
        this.posy = posy;

        this.charArray = [
            [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ],
            [ 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T' ],
            [ 'U', 'V', 'W', 'X', 'Y', 'Z', '.', '-', '<', '>' ]
        ];

        this.text;
        this.block;

        this.name = '';
        this.charLimit = 3;

        this.screenCenterX = 640;
        this.screenCenterY = 360;
    }
    spawn(){
        let text = this.scene.add.bitmapText(this.screenCenterX-264, 300, 'arcadeFont', 'ABCDEFGHIJ\n\nKLMNOPQRST\n\nUVWXYZ.-', 32);

        //text.width == 320

        text.setLetterSpacing(46);
        text.setInteractive();

        this.l1 = this.scene.add.image(text.x + 430, text.y + 148, 'rub');
        this.l2 = this.scene.add.image(text.x + 482, text.y + 148, 'end');

        this.block = this.scene.add.image(text.x - 10, text.y - 10, 'block').setOrigin(0);
        this.text = text;

        setTimeout(()=>{
            this.scene.input.keyboard.on('keyup_LEFT', this.moveLeft, this);
            this.scene.input.keyboard.on('keyup_RIGHT', this.moveRight, this);
            this.scene.input.keyboard.on('keyup_UP', this.moveUp, this);
            this.scene.input.keyboard.on('keyup_DOWN', this.moveDown, this);
            this.scene.input.keyboard.on('keyup_ENTER', this.pressKey, this);
            this.scene.input.keyboard.on('keyup_SPACE', this.pressKey, this);
            this.scene.input.keyboard.on('keyup', this.anyKey, this);
            text.on('pointermove', this.moveBlock, this);
            text.on('pointerup', this.pressKey, this);
        }, 500);

        this.scene.tweens.add({
            targets: this.block,
            alpha: 0.2,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            duration: 500
        });
    }
    destroy(){
        this.scene.destroyElems(this.l1, this.l2, this.block, this.text);
    }
    moveBlock (pointer, x, y){
        let chars = [
            [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ],
            [ 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T' ],
            [ 'U', 'V', 'W', 'X', 'Y', 'Z', '.', '-', '<', '>' ]
        ];
        let cx = Phaser.Math.Snap.Floor(x, 52, 0, true);
        let cy = Phaser.Math.Snap.Floor(y, 64, 0, true);

        this.scene.cursor.set(cx, cy);

        this.block.x = this.text.x - 10 + (cx * 52);
        this.block.y = this.text.y - 6 + (cy * 64);
    }
    moveLeft (){
        if (this.scene.cursor.x > 0)
        {
            this.scene.cursor.x--;
            this.block.x -= 52;
        }
        else
        {
            this.scene.cursor.x = 9;
            this.block.x += 52 * 9;
        }
    }

    moveRight (){
        if (this.scene.cursor.x < 9)
        {
            this.scene.cursor.x++;
            this.block.x += 52;
        }
        else
        {
            this.scene.cursor.x = 0;
            this.block.x -= 52 * 9;
        }
    }

    moveUp (){
        if (this.scene.cursor.y > 0)
        {
            this.scene.cursor.y--;
            this.block.y -= 64;
        }
        else
        {
            this.scene.cursor.y = 2;
            this.block.y += 64 * 2;
        }
    }

    moveDown (){
        if (this.scene.cursor.y < 2)
        {
            this.scene.cursor.y++;
            this.block.y += 64;
        }
        else
        {
            this.scene.cursor.y = 0;
            this.block.y -= 64 * 2;
        }
    }
    anyKey (event)
    {
        //  Only allow A-Z . and -

        let code = event.keyCode;

        if (code === Phaser.Input.Keyboard.KeyCodes.PERIOD)
        {
            this.scene.cursor.set(6, 2);
            this.pressKey();
        }
        else if (code === Phaser.Input.Keyboard.KeyCodes.MINUS)
        {
            this.scene.cursor.set(7, 2);
            this.pressKey();
        }
        else if (code === Phaser.Input.Keyboard.KeyCodes.BACKSPACE || code === Phaser.Input.Keyboard.KeyCodes.DELETE)
        {
            this.scene.cursor.set(8, 2);
            this.pressKey();
        }
        else if (code >= Phaser.Input.Keyboard.KeyCodes.A && code <= Phaser.Input.Keyboard.KeyCodes.Z)
        {
            code -= 65;

            let y = Math.floor(code / 10);
            let x = code - (y * 10);

            this.scene.cursor.set(x, y);
            this.pressKey();
        }
    }

    pressKey ()
    {
        let x = this.scene.cursor.x;
        let y = this.scene.cursor.y;
        let nameLength = this.name.length;

        this.block.x = this.text.x - 10 + (x * 52);
        this.block.y = this.text.y - 2 + (y * 64);

        if (x === 9 && y === 2 && nameLength > 0)
        {
            //  Submit
            this.scene.events.emit('submitName', this.name);
        }
        else if (x === 8 && y === 2 && nameLength > 0)
        {
            //  Rub
            this.name = this.name.slice(0, nameLength-1);

            this.scene.events.emit('updateName', this.name);
        }
        else if (this.name.length < this.charLimit)
        {
            //  Add
            this.name = this.name.concat(this.charArray[y][x]);

            this.scene.events.emit('updateName', this.name);
        }
    }
    
}