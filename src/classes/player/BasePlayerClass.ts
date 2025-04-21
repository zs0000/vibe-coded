import { PlayerClassKey, PlayerClassDef } from '../PlayerClass';

export abstract class BasePlayerClass {
  name: PlayerClassKey;
  baseHP: number;
  speed: number;
  color: number;
  skills: { name: string; desc: string; }[];
  passive: { name: string; desc: string; };

  constructor(def: PlayerClassDef) {
    this.name = def.name;
    this.baseHP = def.baseHP;
    this.speed = def.speed;
    this.color = def.color;
    this.skills = def.skills;
    this.passive = def.passive;
  }

  // Shared methods can go here
  abstract attack(targetX: number, targetY: number, scene: Phaser.Scene): void;
}

// Add this export for use in types
export type { BasePlayerClass };
