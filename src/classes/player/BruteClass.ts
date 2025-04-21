import { BasePlayerClass } from './BasePlayerClass';
import { PlayerClassDef } from '../PlayerClass';

export class BruteClass extends BasePlayerClass {
  constructor(def: PlayerClassDef) {
    super(def);
  }

  attack(targetX: number, targetY: number, scene: import('../../types/GameSceneWithProps').GameSceneWithProps) {
    // Brute: melee attack (short-range arc to left or right)
    const cooldown = 500;
    // Determine swing direction based on click position
    const facingRight = targetX > scene.player.x;
    const arcRadius = 60;
    const arcAngle = Math.PI / 2; // 90 degrees
    const damage = 40;
    scene.canShoot = false;
    setTimeout(() => { scene.canShoot = true; }, cooldown);
    // Find enemies in arc
    scene.enemies.forEach(enemy => {
      const dx = enemy.x - scene.player.x;
      const dy = enemy.y - scene.player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      const centerAngle = facingRight ? 0 : Math.PI;
      if (
        dist < arcRadius &&
        Math.abs(angle - centerAngle) < arcAngle / 2
      ) {
        enemy.hp -= damage;
      }
    });
  }
}
