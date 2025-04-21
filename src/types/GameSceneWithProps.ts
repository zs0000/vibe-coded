import GameScene from '../scenes/GameScene';
import { Enemy } from '../scenes/GameScene';

// Extend this type as needed for additional properties
export type GameSceneWithProps = GameScene & {
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  enemies: Enemy[];
  canShoot: boolean;
  platforms: Phaser.Physics.Arcade.StaticGroup;
};
