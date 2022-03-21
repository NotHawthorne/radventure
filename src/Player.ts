import { Party } from "./Party";
import { GameScene } from "./main";

export class Player {
  constructor(
    private sprite: Phaser.GameObjects.Sprite,
    private tilePos: Phaser.Math.Vector2
  ) {
    const offsetX = 8;
    const offsetY = 16;

    this.sprite.setOrigin(0.5, 1);
    this.sprite.setPosition(
      tilePos.x * 16 + offsetX,
      tilePos.y * 16 + offsetY
    );
    this.sprite.setFrame(55);
  }

  public party: Party;
  public socket;

  getTilePos(): Phaser.Math.Vector2 {
    return this.tilePos.clone();
  }

  setTilePos(tilePosition: Phaser.Math.Vector2): void {
    this.tilePos = tilePosition.clone();
  }

  getPosition(): Phaser.Math.Vector2 {
    return this.sprite.getBottomCenter();
  }

  setPosition(position: Phaser.Math.Vector2): void {
    this.sprite.setPosition(position.x, position.y);
  }
}