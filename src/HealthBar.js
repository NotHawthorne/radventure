import * as Phaser from 'phaser';

export class HealthBar {

    constructor (scene, x, y, current, max, color)
    {
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.bar.setDepth(2);

        this.x = x;
        this.y = y;
        this.value = max;
        this.max = max;
        this.p = 76 / 100;
        this.color = color;

        this.draw();

        scene.add.existing(this.bar);
    }


    get () { return this.value; }

    set (amount)
    {
        this.value -= amount;

        if (this.value < 0)
        {
            this.value = 0;
        }
        if (this.value > this.max) {
            this.value = this.max;
        }

        this.draw();

        return (this.value === 0);
    }

    draw ()
    {
        this.bar.clear();
        this.bar.setDepth(2);

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, 25, 16);

        //  Health

        this.bar.fillStyle(this.color);
        this.bar.fillRect(this.x + 2, this.y + 2, 25, 3);

        var d = Math.floor(this.p * ((this.max / this.value) * 10));

        this.bar.fillRect(this.x + 2, this.y + 2, d, 3);
    }

}