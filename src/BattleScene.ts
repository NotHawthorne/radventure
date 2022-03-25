import * as Phaser from "phaser";
import Sprite from "phaser3-rex-plugins/plugins/gameobjects/mesh/perspective/sprite/Sprite";
import eventsCenter from "./EventsCenter";
import { GameScene } from "./main";
import { UiScene } from "./UiScene";
import { HealthBar } from './HealthBar';
import PhaserTooltip  from './PhaserTooltip'

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "BattleScene"
};

export class BattleScene extends Phaser.Scene {

    player;
    teams: {
        home: {
            name: string,
            sprite: Phaser.GameObjects.Sprite
            health_bar: HealthBar
            mana_bar: HealthBar
        }[],
        away: {
            name: string,
            sprite: Phaser.GameObjects.Sprite
            health_bar: HealthBar
            mana_bar: HealthBar
        }[]
    } = {
        home: [],
        away: [],
    };
    actions = [];

    actionPanel = {
        buttons: {
            swing: null,
            spell: null,
            item: null,
            flee: null
        },
        bg: null,
        border: null
    };

    selectionCursor = null;
    hoverCursor = null;

    hoveredUnit = null;
    selectedUnit = null;

    bg = null;

    state = null;

    graphics = null;

    constructor() {
        super('BattleScene');
    }

    selectUnit(data) {
        if (this.selectionCursor == null)
            this.selectionCursor = this.add.graphics();
        this.selectionCursor.clear();
        this.selectedUnit = data;
        this.selectionCursor.lineStyle(1, 0xFFFF00, 1.0);
        this.selectionCursor.fillStyle(0xFFFFFF, 1.0);
        this.selectionCursor.setDepth(100);
        this.selectionCursor.strokeRect(data.x - 12, data.y - 16, 38, 38);
        console.log("SELECT " + data.name);
    }

    hoverUnit(data, over) {
        if (over == true) {
            this.graphics.lineStyle(1, 0xFFFFFF, 1.0);
            this.graphics.setDepth(50);
            if (this.hoverCursor == null) {
                this.graphics.strokeRect(data.x - 17, data.y - 16, 38, 38);
            }
        }
        else {
            this.graphics.clear();
        }
    }

    init() {
        return null;
    }

    loadUnit(unit, team) {
        var coords_x = 150 + (this.teams[team].length * 40);
        var coords_y = (team == "away" ? 80 : 280);
        
        this.teams[team].push({
                "name": unit.name, 
                "sprite": this.add.sprite(coords_x, coords_y, unit.unit_class),
                "health_bar": new HealthBar(this, coords_x - 14, coords_y + 15, unit.stats.health, unit.stats.max_health, 0xff0000),
                "mana_bar": new HealthBar(this, coords_x - 14, coords_y + 20, unit.stats.health, unit.stats.max_health, 0x0000ff),
            });
        var description = 
            unit.name + "\n" + 
            "level " + unit.level + " " + unit.unit_class + "\n" + 
            "hp: " + unit.stats.health + "/" + unit.stats.max_health + "\n" +
            "mp: " + unit.stats.mana + "/" + unit.stats.max_mana;
        UiScene.addTooltip(
            coords_x, 
            coords_y + 20, 
            this.teams[team][this.teams[team].length - 1].sprite, 
            description,
            this,
            false
        );
        console.log("created sprite" + this.teams[team][this.teams[team].length - 1].name);
    }

    swing() {

    }

    spell() {

    }

    item() {

    }

    flee() {

    }

    startBattle(data) {
        console.log("STARTING BATTLE");
        this.bg = new Phaser.GameObjects.Rectangle(this, 240, 185, 480, 370, 0x000000);
        console.log(JSON.stringify(data.data));
        for (var i in data.data.party_a) {
            this.loadUnit(data.data.party_a[i], "home");
            console.log(data.data.party_a[i].name);
            this.teams.home[i].sprite.setDepth(9);
            this.teams.home[i].sprite.setInteractive();
            this.teams.home[i].sprite.on("pointerover", this.hoverUnit.bind(this, this.teams.home[i].sprite, true));
            this.teams.home[i].sprite.on("pointerout", this.hoverUnit.bind(this, this.teams.home[i].sprite, false));
            this.teams.home[i].sprite.on("pointerdown", this.selectUnit.bind(this, data.data.party_a[i]));
        }
        for (var i in data.data.party_b) {
            this.loadUnit(data.data.party_b[i], "away");
            console.log(data.data.party_b[i].name);
            this.teams.away[i].sprite.setDepth(9);
            this.teams.away[i].sprite.setInteractive();
            this.teams.away[i].sprite.on("pointerover", this.hoverUnit.bind(this, this.teams.away[i].sprite, true));
            this.teams.away[i].sprite.on("pointerout", this.hoverUnit.bind(this, this.teams.away[i].sprite, false));
            this.teams.away[i].sprite.on("pointerdown", this.selectUnit.bind(this, data.data.party_b[i]));
        }
        this.add.existing(this.bg);
        this.actionPanel.buttons.swing = UiScene.createBtn(
            this,
            {
                x: 50,
                y: 325,
                name: "swing",
                color: 0xFFF
            },
            null,
            this.swing
        );
        this.actionPanel.buttons.spell = UiScene.createBtn(
            this,
            {
                x: 300,
                y: 325,
                name: "spell",
                color: 0xFFF
            },
            null,
            this.spell
        );
        this.actionPanel.buttons.item = UiScene.createBtn(
            this,
            {
                x: 50,
                y: 375,
                name: "item",
                color: 0xFFF
            },
            null,
            this.item
        );
        this.actionPanel.buttons.flee = UiScene.createBtn(
            this,
            {
                x: 300,
                y: 375,
                name: "flee",
                color: 0xFFF
            },
            null,
            this.flee
        );
    }

    create() {
        //this.actionPanel.
        GameScene.linkAnims(this);
        this.add.text(20, 20, "BATTLE SCENE");
        console.log("Started battle scene");
    }

    public stateChange(data) {
        this.state = data.state;
        switch (data.state) {
            case "battle":
                this.startBattle(data);
                break ;
            default:
                console.log("BattleScene changed state.");
                break ;
        }
    }

    preload() {
        this.load.scenePlugin('PhaserTooltip', PhaserTooltip, 'PhaserTooltip', 'tooltip');
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xFFFFFF, 1.0);
        GameScene.preloadSprites(this);
        eventsCenter.on('stateChange', this.startBattle, this);
    }
}