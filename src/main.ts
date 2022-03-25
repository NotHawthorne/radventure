import * as Phaser from "phaser";
import { GridControls } from "./GridControls";
import { GridPhysics } from "./GridPhysics";
import { Player } from "./Player";
import {io} from 'socket.io-client';
const mapData = require("../data/mapData.json");
const tileData = require("../data/tileData.json");
const classData = require("../data/classData.json");
const unitData = require("../data/unitData.json");
import { LoginScene } from "./LoginScene";
import { UiScene } from "./UiScene";
import { BattleScene } from "./BattleScene";
import eventsCenter from './EventsCenter'
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import ButtonPlugin from 'phaser3-rex-plugins/plugins/button-plugin.js';
import AnchorPlugin from 'phaser3-rex-plugins/plugins/anchor-plugin.js';
import Button from "phaser3-rex-plugins/plugins/button";

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
  private mainPlayer = null;
  private loadedUnits = {};
  private loadedPlayers = {};

  private inBattle = false;

  private state = null;

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

  public static preloadSprites(scene: Phaser.Scene) {
    console.log("sprites");
    for (const c of classData["classes"]) {
      scene.load.spritesheet(c["name"], c["sprite"], {
        "frameWidth": 16,
        "frameHeight": 16,
        "startFrame": 0,
        "endFrame": 1,
        "margin": 0,
        "spacing": 0
      });
    }
    for (const c of unitData["units"]) {
      scene.load.spritesheet(c["name"], c["sprite"], {
        "frameWidth": 16,
        "frameHeight": 165,
        "startFrame": 0,
        "endFrame": 1,
        "spacing": 0
      });
    }
  }

  public static linkAnims(scene: Phaser.Scene) {
    console.log("linking anims...");
    for (const c of classData["classes"])
      scene.anims.create({"key": c["name"]+"_idle", "frameRate": 1, "frames": scene.anims.generateFrameNumbers(c["name"], { frames: [ 0, 1 ] }), repeat: -1});
    for (const c of unitData["units"])
      scene.anims.create({"key": c["name"]+"_idle", "frameRate": 1, "frames": scene.anims.generateFrameNumbers(c["name"], { frames: [ 0, 1 ] }), repeat: -1});
  }

  public handleInput(event) {

  }

  public encounterStart(data) {
    game.scene.start('BattleScene');
    eventsCenter.emit('stateChange', {"state": "battle", "data": data} );
    console.log("HI");
  }

  public addPlayer(player, isSelf) {
    console.log("LOAD PLAYER " + player.name + "AT " + player.x + ", " + player.y)
    var display_char = player.party[0];
    this.loadedPlayers[player.name] = player;
    this.loadedPlayers[player.name].sprite = this.add.sprite((player.x * 16), (player.y * 16), display_char.unit_class);
    if (this.mainPlayer != null)
      console.log(this.mainPlayer.sprite.x, this.mainPlayer.sprite.y);
    this.loadedPlayers[player.name].sprite.setDepth(2);
    this.loadedPlayers[player.name].sprite.scale = 1;
    this.loadedPlayers[player.name].sprite.offsetX = 8;
    this.loadedPlayers[player.name].sprite.offsetY = 8;
    this.loadedPlayers[player.name].sprite.setPosition((Number(player.x) * 16) + 8, (player.y * 16) + 8);
    if (isSelf == true) {
      console.log(this.loadedPlayers[player.name].sprite.x, this.loadedPlayers[player.name].sprite.y);
      this.loadedPlayers[player.name].sprite.setPosition((Number(player.x) * 16) + 8, (player.y * 16) + 16);
      this.loadedPlayers[player.name].sprite.setDepth(3);
      this.loadedPlayers[player.name].sprite.offsetY = 16;
      this.loadedPlayers[player.name].sprite.x = player.x * 16;
      this.loadedPlayers[player.name].sprite.y = player.y * 16;
      this.cameras.main.startFollow(this.loadedPlayers[player.name].sprite);
      this.cameras.main.roundPixels = false;
      this.cameras.main.setFollowOffset(-128, -64);
      this.mainPlayer = player;
      console.log(this.cameras.main);
    }
    this.loadedPlayers[player.name].sprite.play(display_char.unit_class+"_idle");
    return this.loadedPlayers[player.name];
  }

  public removePlayer(player) {
    this.loadedPlayers[player.name].sprite.destroy();
    delete this.loadedPlayers[player.name];
  }

  public updatePlayer(player) {
    console.log("updating player");
    if (this.loadedPlayers[player.name].x != player.x || this.loadedPlayers[player.name].y != player.y) {
      this.loadedPlayers[player.name].x = player.x;
      this.loadedPlayers[player.name].y = player.y;
      this.loadedPlayers[player.name].sprite.x = (player.x * 16) + this.loadedPlayers[player.name].sprite.offsetX;
      this.loadedPlayers[player.name].sprite.y = (player.y * 16) + this.loadedPlayers[player.name].sprite.offsetY;
      console.log(this.loadedPlayers[player.name].sprite.x, ", ", this.loadedPlayers[player.name].sprite.y);
      console.log(player.x, ", ", player.y);
    }
  }

  public addUnit(unit) {
    console.log("LOADING " + JSON.stringify(unit));
    this.loadedUnits[unit.name] = unit;
    this.add.sprite(1, 1, unit.unit_class);
  }

  public handleLogin(packet) {
    console.log("Starting scene");
    game.scene.start('UiScene');
    this.addPlayer(packet, true);
    this.player = new Player(this.loadedPlayers[packet.name].sprite, new Phaser.Math.Vector2(packet.x, packet.y));
    eventsCenter.emit('stateChange', {"state": "world", "data": packet});
    this.player.socket = this.socket;

    this.gridPhysics = new GridPhysics(this.player, this.currentMap["map"]);
    this.gridControls = new GridControls(this.input, this.gridPhysics);

    console.log("EMIT");

    eventsCenter.emit('populateInfo', packet);
  }

  public stateChange(data) {
    this.state = data.state;
    switch (data.state) {
      case "battle":
        this.player.isInBattle = true;
        break ;
      case "world":
        this.player.isInBattle = false;
        break ;
      default:
        console.log("GameScene switched states.");
        break ;
    }
  }

  public create() {
    // bind input
    this.input.keyboard.on('keydown', this.handleInput);
    // create websocket
    this.socket = io('http://localhost:4242');
    //api routes
    this.socket.on('connect', function() { this.socket.emit('login', { username: this.registry.get('user'), password: this.registry.get('pass')}); }.bind(this));
    this.socket.on('loginDataDump', function(data) { this.handleLogin(data); }.bind(this));
    this.socket.on('addPlayer', function(data) { if (data.name != this.mainPlayer.name) this.addPlayer(data, false); }.bind(this));
    this.socket.on('removePlayer', function(data) { this.removePlayer(data); }.bind(this));
    this.socket.on('updatePlayer', function(data) { this.updatePlayer(data); }.bind(this));
    this.socket.on('encounterStart', function(data) { this.encounterStart(data); }.bind(this));
    this.socket.on('encounterEnd', function(data) { this.encounterEnd(data); }.bind(this));
    //local routes
    eventsCenter.on('stateChange', function(data) { this.stateChange(data) }.bind(this));
    //connect sprites to animations
    GameScene.linkAnims(this);
    //start map
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
      GameScene.preloadSprites(this);
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "RadVenture",
  plugins: {
    scene: [{
      key: 'rexUI',
      plugin: UIPlugin,
      mapping: 'rexUI'
    }],
    global: [{
      key: 'rexButton',
      plugin: ButtonPlugin,
      start: true
    },
    {
      key: 'rexAnchor',
      plugin: AnchorPlugin,
      start: true
    }]
  },
  render: {
    antialias: false,
  },
  type: Phaser.AUTO,
  scene: [ LoginScene, GameScene, UiScene, BattleScene ],
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