import { BasePlayerClass } from './BasePlayerClass';
import { PlayerClassDef } from '../PlayerClass';

export class RangerClass extends BasePlayerClass {
  constructor(def: PlayerClassDef) {
    super(def);
  }

  attack(targetX: number, targetY: number, scene: import('../../types/GameSceneWithProps').GameSceneWithProps) {
    // Ranger: arrow with gravity, persists until hit/ground, consistent fire rate
    const speed = 450;
    const damage = 30;
    const cooldown = 350;
    const gravityY = 400;
    const fadeDelay = 2000;
    const size = 10;
    const tint = 0x38bdf8;
    const proj = scene.physics.add.sprite(scene.player.x, scene.player.y, '').setDisplaySize(size, size).setTint(tint);
    proj.body.setAllowGravity(true);
    proj.body.setGravityY(gravityY);
    const angle = Phaser.Math.Angle.Between(scene.player.x, scene.player.y, targetX, targetY);
    scene.physics.velocityFromRotation(angle, speed, proj.body.velocity);
    proj.setData('damage', damage);
    scene.canShoot = false;
    setTimeout(() => { scene.canShoot = true; }, cooldown);
    scene.physics.add.overlap(proj, scene.enemies, (projObj, enemyObj) => {
      const enemy = enemyObj as typeof scene.enemies[number];
      enemy.hp -= proj.getData('damage');
      if (enemy.hp <= 0) {
        enemy.destroy();
        scene.enemies = scene.enemies.filter(e => e !== enemy);
      }
      proj.destroy();
    });
    setTimeout(() => { if (proj.active) proj.destroy(); }, fadeDelay);
  }
}
