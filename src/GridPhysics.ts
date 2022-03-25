import { Direction } from "./Direction";
import { Player } from "./Player";
import { GameScene } from "./main";

const Vector2 = Phaser.Math.Vector2;
type Vector2 = Phaser.Math.Vector2;

export class GridPhysics {
  private movementDirectionVectors: {
    [key in Direction]?: Vector2;
  } = {
    [Direction.UP]: Vector2.UP,
    [Direction.DOWN]: Vector2.DOWN,
    [Direction.LEFT]: Vector2.LEFT,
    [Direction.RIGHT]: Vector2.RIGHT
  };

  private readonly speedPixelsPerSecond: number = 64;
  constructor(
      private player: Player,
      private tileMap: Phaser.Tilemaps.Tilemap
  ) {}
  private walkCooldown = 0;

  private leftOver : Vector2 = new Vector2(0, 0);

  private movementDirection: Direction = Direction.NONE;
  private lastMovementIntent: Direction = Direction.NONE;

  movePlayer(direction: Direction): void {
    this.lastMovementIntent = direction;
      if (!this.isMoving()) {
          this.startMoving(direction);
      }
  }

  private isMoving(): boolean {
      return this.movementDirection != Direction.NONE;
  }

  private startMoving(direction: Direction): void {
      this.movementDirection = direction;
      if (this.walkCooldown <= 0) {
          this.update(0);
      }
  }

  update(delta: number): void {
      this.move(this.movementDirection);
      if (Math.round(this.walkCooldown) > 0)
        this.walkCooldown -= delta;
      this.lastMovementIntent = Direction.NONE;
  }

  private move(direction: Direction) {
    const newPos: Vector2 = this.player.getPosition();
    if (this.isMoving() && this.shouldContinueMoving()) {
        if (Math.round(this.walkCooldown) <= 0 && this.player.isInBattle == false) {
            switch (this.movementDirection.valueOf()) {
                case Direction.UP.valueOf():
                    newPos.add(new Vector2(0, -16));
                    this.player.socket.emit('move', {'direction': 'up'});
                    break ;
                case Direction.DOWN.valueOf():
                    newPos.add(new Vector2(0, 16));
                    this.player.socket.emit('move', {'direction': 'down'});
                    break ;
                case Direction.LEFT.valueOf():
                    newPos.add(new Vector2(-16, 0));
                    this.player.socket.emit('move', {'direction': 'left'});
                    break ;
                case Direction.RIGHT.valueOf():
                    newPos.add(new Vector2(16, 0));
                    this.player.socket.emit('move', {'direction': 'right'});
                    break ;
            }
            this.walkCooldown = 250;
            this.updatePlayerTilePos();
        }
        this.player.setPosition(newPos);
    }
    this.stopMoving();
  }

  private stopMoving(): void {
      this.movementDirection = Direction.NONE;
  }

  private updatePlayerTilePos() {
    this.player.setTilePos(
      this.player
        .getTilePos()
        .add(this.movementDirectionVectors[this.movementDirection])
    );
  }

  private isBlockingDirection(direction: Direction): boolean {
    return this.hasBlockingTile(this.tilePosInDirection(direction));
  }

  private tilePosInDirection(direction: Direction): Vector2 {
    return this.player
      .getTilePos()
      .add(this.movementDirectionVectors[direction]);
  }

  private hasBlockingTile(pos: Vector2): boolean {
    if (this.hasNoTile(pos)) return true;
    return this.tileMap.layers.some((layer) => {
      const tile = this.tileMap.getTileAt(pos.x, pos.y, false, layer.name);
      return tile && tile.properties.collides;
    });
  }
  
  private hasNoTile(pos: Vector2): boolean {
    return !this.tileMap.layers.some((layer) =>
      this.tileMap.hasTileAt(pos.x, pos.y, layer.name)
    );
  }
  private shouldContinueMoving(): boolean {
    return (
      this.movementDirection == this.lastMovementIntent &&
      !this.isBlockingDirection(this.lastMovementIntent)
    );
  }
}