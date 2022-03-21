import * as Phaser from 'phaser';
import { Viewport, Column, TextButton, TextSprite } from 'phaser-ui-tools';

export class UiScene extends Phaser.Scene {

    public viewport;
    public header;
    public column;
    public button;

    public static textStyle = {'fill': '#FFF', 'font': '16px Courier New'};

    public static sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
        active: false,
        visible: false,
        key: "UiScene"
    };

    constructor() {
        super(UiScene.sceneConfig);
    }
    public create() {
        this.viewport = new Viewport(this, 0, 0, 600, 260);
        this.header = new TextSprite(this, 0, 0, "header").setText('Header', UiScene.textStyle).setOrigin(0.0, 0.0);
        this.column = new Column(this, 200, 200);
        this.button = new TextButton(this, 0, 0, "button", this, 1, 0, 1, 2, ).setText("AYY").eventTextYAdjustment(3);
        this.viewport.addNode(this.column);
        this.column.addNode(this.header);
    }
    public preload() {

    }
    public update(_time: number, delta: number) {

    }
}