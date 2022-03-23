import * as Phaser from 'phaser';
import { Viewport, Column, TextButton, TextSprite, Row } from 'phaser-ui-tools';
import eventsCenter from './EventsCenter';

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

    public focusedCharacter;

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
        }
    };

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

    public populateInfo(info) {
        this.focusCharacter(info.party[0]);
    }
    
    public focusCharacter(character) {
        this.focusedCharacter = character;
        if (this.textInfo.focusedCharacter.name == null) {
            this.textInfo.focusedCharacter.name = this.add.text(-120,-300,character.name);
            this.column.add(this.textInfo.focusedCharacter.name);
        }
        else 
            this.textInfo.focusedCharacter.name.setText(character.name);
        var i = 0;
        for (var item in character.equipment) {
            console.log(character.equipment[item]);
            if (this.textInfo.focusedCharacter.equipment[item] == null) {
                this.textInfo.focusedCharacter.equipment[item] = this.add.text(-120, -280 + (i * 20), item + ": " + (character.equipment[item] != null ? character.equipment[item].name : "Empty"));
                this.column.add(this.textInfo.focusedCharacter.equipment[item]);
            }
            else
                this.textInfo.focusedCharacter[item].setText(character.equipment[item].name);
            i++;
        }
    }

    public create() {
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(2, 0xffff00, 1);
        this.graphics.setDepth(5);
        this.column = new Column(this, 600, 300, 800, 600);
        this.bg = new Phaser.GameObjects.Rectangle(this, 0, 0, 240, 600, 0x000000, 1);
        console.log("stroke rect");
        this.button = new TextButton(this, 0, 0, "button", this, 1, 0, 1, 2).setText("AYY").eventTextYAdjustment(3);
        this.column.add(this.bg);
        this.hudBorder = this.graphics.strokeRect(480, 0, 240, 528);
        this.chatbg = new Phaser.GameObjects.Rectangle(this, 0, 0, 480, 160, 0x444444, 1);
        this.chatrow = new Row(this, 240, 450, 800, 600);
        this.chatrow.add(this.chatbg);

        eventsCenter.on('focusCharacter', function(character) { this.focusCharacter(character); }.bind(this));
        eventsCenter.on('populateInfo', function(info) { this.populateInfo(info); }.bind(this));
        //this.chatport.add(this.chatbg);
    }
    public preload() {

    }
    public update(_time: number, delta: number) {
    }
}