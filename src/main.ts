import * as Phaser from "phaser";
import { GridControls } from "./GridControls";
import { GridPhysics } from "./GridPhysics";
import { Player } from "./Player";
import {io} from 'socket.io-client';
const mapData = require("../data/mapData.json");
const tileData = require("../data/tileData.json");
const classData = require("../data/classData.json");
import { LoginScene } from "./LoginScene";
import { UiScene } from "./UiScene";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "GameScene",
};

const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 528;
const SPRITES = {};


var textStyle = {'fill': '#FFF', 'font': '16px Courier New'};


export class GameScene extends Phaser.Scene {

  currentMap = {
    "name": "",
    "map": null,
    "tileData": {}
  };

  private gridControls: GridControls;
  private gridPhysics: GridPhysics;
  private socket = null;
  private player = null;
  private playerSprite = null;
  private loadedUnits = [];

  constructor() {
    super(sceneConfig);
  }

  public createUnit(player) {

  }

  public loadMap(mapName) {
    if (mapData[mapName] === undefined) { // invalid name, return
      return undefined;
    }
    this.currentMap["name"] = mapName;
    this.currentMap["map"] = this.make.tilemap({key: mapName});
    for (const [key, value] of Object.entries(mapData[mapName]["tileData"])) { // load images, store in map
      this.currentMap["tileData"][value["name"]] = this.currentMap["map"].addTilesetImage(value["name"], value["filePath"])
    }
    for (const [key, value] of Object.entries(mapData[mapName]["tileData"])) { // load tiles, using stored images
      this.currentMap["map"].createLayer(value["layerName"], this.currentMap["tileData"][value["name"]]);
      this.currentMap["map"].addTilesetImage(value["name"], value["filePath"])
    }
  }

  public preloadMaps() {
    for (const [key, value] of Object.entries(mapData)) {
      this.load.tilemapTiledJSON(key, value["filePath"]);
    }
  }

  public preloadTiles() {
    for (const [key, value] of Object.entries(tileData)) {
      this.load.image(value["name"], value["filePath"])
    }
  }

  public preloadSprites() {
    console.log("sprites");
    for (const c of classData["classes"]) {
      console.log(c);
      console.log(c["sprite"]);
      this.load.spritesheet(c["name"], c["sprite"], {
        "frameWidth": 16,
        "frameHeight": 16,
        "startFrame": 0,
        "endFrame": 1,
        "margin": 0,
        "spacing": 0
      });
    }
  }

  public linkAnims() {
    console.log("linking anims...");
    for (const c of classData["classes"])
      this.anims.create({"key": c["name"]+"_idle", "frameRate": 1, "frames": this.anims.generateFrameNumbers(c["name"], { frames: [ 0, 1 ] }), repeat: -1});
  }

  public handleInput(event) {

  }

  public addUnit(unit) {

  }

  public handleLogin(packet) {
    game.scene.start('UiScene');
    var display_unit = packet.party[0];
    console.log("HEY HEY " + display_unit.unit_class);
    this.playerSprite = this.add.sprite(1, 1, display_unit.unit_class);
    this.playerSprite.setDepth(2);
    this.playerSprite.scale = 1;
    this.cameras.main.startFollow(this.playerSprite);
    this.cameras.main.roundPixels = true;
    this.player = new Player(this.playerSprite, new Phaser.Math.Vector2(packet.x, packet.y));
    this.player.socket = this.socket;
    this.playerSprite.play(display_unit.unit_class+"_idle");
    console.log(display_unit.unit_class);

    this.gridPhysics = new GridPhysics(this.player, this.currentMap["map"]);
    this.gridControls = new GridControls(this.input, this.gridPhysics);
  }

  public create() {
    this.input.keyboard.on('keydown', this.handleInput);
    this.socket = io('http://localhost:4242');
    this.socket.on('connect', function() {
      console.log("CONNECTED");
      this.socket.emit('login', {username: this.registry.get('user'), password: this.registry.get('pass')});
    }.bind(this));
    this.socket.on('loginDataDump', function(data) {
      this.handleLogin(data);
      console.log("HOLY SHIT " + JSON.stringify(data));
    }.bind(this))
    this.linkAnims();
    this.loadMap("spawn");
  }

  public update(_time: number, delta: number) {
    if (this.gridControls != null)
      this.gridControls.update();
    if (this.gridPhysics != null)
      this.gridPhysics.update(delta);
  }

  public preload() {
      this.preloadTiles();
      this.preloadMaps();
      this.preloadSprites();
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "RadVenture",
  render: {
    antialias: false,
  },
  type: Phaser.AUTO,
  scene: [ LoginScene, GameScene, UiScene ],
  scale: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600
    },
    max: {
      width: 1920,
      height: 1200
    }
  },
  parent: "game",
  backgroundColor: "#48C4F8",
};

export const game = new Phaser.Game(gameConfig);

game.scene.start("Login");