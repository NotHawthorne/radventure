import * as Phaser from 'phaser';
import { Viewport, Column, TextButton, TextSprite, Row } from 'phaser-ui-tools';
import eventsCenter from './EventsCenter';
import { Tabs, ScrollablePanel } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { Rectangle } from 'phaser3-rex-plugins/plugins/gameobjects/shape/shapes/geoms';
import Anchor from 'phaser3-rex-plugins/plugins/anchor.js';
import BaseSizer from 'phaser3-rex-plugins/templates/ui/basesizer/BaseSizer';
import { IConfig } from 'phaser3-rex-plugins/plugins/behaviors/textedit/Edit';
import { IConfigOpen } from 'phaser3-rex-plugins/plugins/behaviors/textedit/TextEdit';
import PhaserTooltip from './PhaserTooltip';

export class UiScene extends Phaser.Scene {

    public viewport;
    public bg;
    public header;
    public column;
    public row;
    public button;
    public hudBorder;

    public chatport;
    public chatrow;
    public chatentry;
    public chatlog;
    public chatbg;

    public focusedCharacter;

    public inspectorMenu;
    public inspectorPanel;
    public partyMenu;

    public textInfo = {
        focusedCharacter: {
            name: null,
            hp: null,
            mana: null,
            max_hp: null,
            max_mana: null,
            equipment: {
                head: null,
                shoulders: null,
                chest: null,
                pants: null,
                gloves: null,
                feet: null,
                ring1: null,
                ring2: null,
                mainhand: null,
                offhand: null,
                neck: null,
                extra_slot0: null,
                extra_slot1: null
            },
            stats: {
                strength: null,
                stamina: null,
                intellect: null,
                wisdom: null,
                alacrity: null,
                luck: null,
                weapon_damage: null,
                spell_damage: null,
                bonus_healing: null,
                damage_reduction: null,
                spell_resistance: null,
                dodge_chance: null,
                parry_chance: null,
                block_chance: null,
                crit_chance: null,
                hit_chance: null,
                health: null,
                health_regen: null,
                mana: null,
                mana_regen: null,
                magic_find: null,
                gold_find: null,
                life_on_hit: null,
                minimum_damage: null,
                maximum_damage: null,
                armor: null
            }
        }
    };

    public graphics;

    public static textStyle = {'fill': '#FFF', 'font': '12px Courier New'};
    public lastRatio = 0;

    public static sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
        active: false,
        visible: false,
        key: "UiScene"
    };

    constructor() {
        super(UiScene.sceneConfig);
    }

    createBtn (scene, config, column) {
        var x = Phaser.Utils.Objects.GetValue(config, 'x', 0);
        var y = Phaser.Utils.Objects.GetValue(config, 'y', 0);
        var color = Phaser.Utils.Objects.GetValue(config, 'color', 0xffffff);
        var name = Phaser.Utils.Objects.GetValue(config, 'name', '');

        //var btn = new Phaser.GameObjects.Rectangle(this, x, y, 120, 120, color, 1);
        //btn.setDepth(1);
        var btnText = this.add.text(x, y, name, UiScene.textStyle);
        btnText.setDepth(4);
        
        //btn.setInteractive();
        //btn.on('click', function (button, gameObject) { console.log("clicked"); })
        //console.log(btn);
        //column.add(btnText);
        //column.add(btn);
        btnText.setInteractive()
            .on('pointerdown', function() { console.log("test") });
        column.add(btnText);
        return btnText;
    }

    public populateInfo(info) {
        this.row = new Row(this, -120, -300, 300, 200);
        this.column.add(this.row);
        console.log("POPULATE");
        this.focusCharacter(info.party[0]);
        this.partyMenu = [];
        for (var i = 0; i != 5; i++) {
            this.partyMenu.push(this.createBtn(this, {x: -120, y: 80 + (20 * i), name: info.party.length > i ? info.party[i].name : "Empty", color: 0xFFF}, this.column));
        }
    }

    public getFinalStatsForItem(item) {
        var ret = item.stats;
        for (var enchant in item.enchants) {
            for (var x in item.enchants[enchant].stats) {
                ret[x] += item.enchants[enchant].stats[x];
            }
        }
        return ret;
    }
    
    public focusCharacter(character) {
        console.log("GOING");
        this.focusedCharacter = character;
        if (this.textInfo.focusedCharacter.name == null) {
            this.textInfo.focusedCharacter.name = this.add.text(-120,-280,character.name);
            this.column.add(this.textInfo.focusedCharacter.name);
        }
        else 
            this.textInfo.focusedCharacter.name.setText(character.name);
        var i = 0;
        for (var item in character.equipment) {
            console.log(character.equipment[item]);
            if (this.textInfo.focusedCharacter.equipment[item] == null) {
                this.textInfo.focusedCharacter.equipment[item] = this.add.text(-120, -260 + (i * 20), item + ": " + (character.equipment[item] != null ? character.equipment[item].name : "Empty"), UiScene.textStyle);
                this.column.add(this.textInfo.focusedCharacter.equipment[item]);
            }
            else
                this.textInfo.focusedCharacter[item].setText(character.equipment[item].name);
            if(character.equipment[item] != null) {
                var tooltip = character.equipment[item].name + "\n"
                    + character.equipment[item].slot;
                var finalStats = this.getFinalStatsForItem(character.equipment[item]);
                for (var x in finalStats) {
                    if (finalStats[x] > 0)
                        tooltip += "\n" + x + ": " + finalStats[x];
                }
                this.addTooltip(0, 0, this.textInfo.focusedCharacter.equipment[item], tooltip, this);
            }
            i++;
        }
    }

    public create() {
        this.inspectorMenu = [
            this.createBtn(this, { name: "equipment", x: 0, y: 0, color: 0xFFF }, this.row),
            this.createBtn(this, { name: "stats", x: 90, y: 0, color: 0xFFF }, this.row),
            this.createBtn(this, { name: "abilities", x: 150, y: 0, color: 0xFFF }, this.row)
        ]
    }

    public preload() {
        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
        this.load.scenePlugin('PhaserTooltip', PhaserTooltip, 'PhaserTooltip', 'tooltip');
        eventsCenter.on('focusCharacter', function(character) { this.focusCharacter(character); }.bind(this));
        eventsCenter.on('populateInfo', function(info) { this.populateInfo(info); }.bind(this));
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(2, 0xffff00, 1);
        this.graphics.setDepth(5);
        this.column = new Column(this, 600, 300, 800, 600);
        this.bg = new Phaser.GameObjects.Rectangle(this, 0, 0, 240, 600, 0x000000, 1);
        this.column.add(this.bg);
        this.hudBorder = this.graphics.strokeRect(480, 0, 240, 528);
        this.chatbg = new Phaser.GameObjects.Rectangle(this, 0, 0, 480, 160, 0x444444, 1);
        this.chatrow = new Row(this, 240, 450, 800, 600);
        this.chatrow.add(this.chatbg);
    }

    public update(_time: number, delta: number) {
    }
    
    public addTooltip(x, y, item, content, scene) {
        var tooltipID = scene.tooltipID = Math.random() * 10000;
        scene._tooltip = scene.tooltip.createTooltip({
            x: item.getBounds().x,
            y: item.getBounds().y - 30,
            hasBackground: true,
            text: {
                text: content
            },
            background: {
                width: 100,
                height: 50,
                lineStyle: {
                    "width": 2,
                    "color": 0xFFFFFF,
                    "alpha": 1.0
                },
                fillStyle: {
                    "color": 0x444444,
                    "alpha": 0.7
                }
            },
            id: tooltipID,
            target: item
        });

        scene.tooltip.hideTooltip(tooltipID);
                
        item.setInteractive();
        item.setDepth(100);

        item.on(
            'pointerover',
                function(pointer, item) {
                    scene.tooltip.showTooltip(tooltipID, true);
                    console.log("HI");
                },
                scene
        );

        item.on(
            'pointerout',
                function(pointer, item) {
                    scene.tooltip.hideTooltip(tooltipID, true);
                },
            scene
        );
    }
}