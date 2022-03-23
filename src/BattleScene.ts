import * as Phaser from "phaser";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "BattleScene"
};

export class BattleScene extends Phaser.Scene {
    constructor() {
        super('BattleScene');
    }
    create() {
        this.add.text(20, 20, "BATTLE SCENE");
        console.log("Started battle scene");
    }
}