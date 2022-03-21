import * as Phaser from "phaser";

export class BattleScene extends Phaser.Scene {
    constructor() {
        super('battle');
    }
    create() {
        this.add.text(20, 20, "BATTLE SCENE");
    }
}