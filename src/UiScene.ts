import * as Phaser from 'phaser';
import { Viewport, Column, TextButton, TextSprite, Row } from 'phaser-ui-tools';

export class UiScene extends Phaser.Scene {

    public viewport;
    public bg;
    public header;
    public column;
    public button;
    public hudBorder;

    public chatport;
    public chatrow;
    public chatentry;
    public chatlog;
    public chatbg;

    public graphics;

    public static textStyle = {'fill': '#FFF', 'font': '16px Courier New'};
    public lastRatio = 0;

    public static sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
        active: false,
        visible: false,
        key: "UiScene"
    };

    constructor() {
        super(UiScene.sceneConfig);
    }
    public create() {
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(2, 0xffff00, 1);
        this.graphics.setDepth(5);
        this.header = new TextSprite(this, 0, 0, "header").setText('Header', UiScene.textStyle).setOrigin(0.0, 0.0);
        this.column = new Column(this, 600, 300, 800, 600);
        this.bg = new Phaser.GameObjects.Rectangle(this, 0, 0, 240, 600, 0x000000, 1);
        console.log("stroke rect");
        this.button = new TextButton(this, 0, 0, "button", this, 1, 0, 1, 2).setText("AYY").eventTextYAdjustment(3);
        this.column.add(this.bg);
        this.column.add(this.button);
        this.column.add(this.header);
        this.hudBorder = this.graphics.strokeRect(480, 0, 240, 528);
        this.chatbg = new Phaser.GameObjects.Rectangle(this, 0, 0, 480, 160, 0x444444, 1);
        this.chatrow = new Row(this, 240, 450, 800, 600);
        this.chatrow.add(this.chatbg);

        //this.chatport.add(this.chatbg);
    }
    public preload() {

    }
    public update(_time: number, delta: number) {
    }
}