import { BasePlayerClass } from './BasePlayerClass';
import { PlayerClassDef } from '../PlayerClass';

export class SorceressClass extends BasePlayerClass {
  constructor(def: PlayerClassDef) {
    super(def);
  }

  attack(targetX: number, targetY: number, scene: import('../../types/GameSceneWithProps').GameSceneWithProps) {
    // Sorceress: slow, high-damage projectile, slow fire rate
    const speed = 300;
    const damage = 60;
    const cooldown = 700;
    const size = 18;
    const tint = 0xf472b6;
    const proj = scene.physics.add.sprite(scene.player.x, scene.player.y, '').setDisplaySize(size, size).setTint(tint);
    proj.body.setAllowGravity(false);
    const angle = Phaser.Math.Angle.Between(scene.player.x, scene.player.y, targetX, targetY);
    scene.physics.velocityFromRotation(angle, speed, proj.body.velocity);
    proj.setData('damage', damage);
    scene.canShoot = false;
    setTimeout(() => { scene.canShoot = true; }, cooldown);
    scene.physics.add.overlap(proj, scene.enemies, (projObj, enemyObj) => {
      const enemy = enemyObj as typeof scene.enemies[number];
      enemy.hp -= damage;
      if (enemy.hp <= 0) {
        enemy.destroy();
        scene.enemies = scene.enemies.filter(e => e !== enemy);
      }
      proj.destroy();
    });
    setTimeout(() => { if (proj.active) proj.destroy(); }, 2000);
  }
}
