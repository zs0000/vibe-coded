export type PlayerClassKey = 'Ranger' | 'Sorceress' | 'Reaper' | 'Brute';

export interface PlayerClassDef {
  name: PlayerClassKey;
  baseHP: number;
  speed: number;
  color: number;
  skills: { name: string; desc: string; }[];
  passive: { name: string; desc: string; };
}

export const CLASS_DEFS: Record<PlayerClassKey, PlayerClassDef> = {
  Ranger: {
    name: 'Ranger',
    baseHP: 90,
    speed: 260,
    color: 0x38bdf8,
    skills: [
      { name: 'Power Shot', desc: 'Fires a piercing arrow for double damage.' },
      { name: 'Trap', desc: 'Places a trap that snares enemies.' },
      { name: 'Dash', desc: 'Quickly dodge in a direction.' },
    ],
    passive: { name: 'Critical Strikes', desc: 'Chance for attacks to deal double damage.' },
  },
  Sorceress: {
    name: 'Sorceress',
    baseHP: 80,
    speed: 220,
    color: 0xf472b6,
    skills: [
      { name: 'Fireball', desc: 'Launches an explosive fireball.' },
      { name: 'Frost Nova', desc: 'Freezes nearby enemies.' },
      { name: 'Arcane Surge', desc: 'Restores mana and increases spell power.' },
    ],
    passive: { name: 'Mana Flow', desc: 'Regenerate mana over time.' },
  },
  Reaper: {
    name: 'Reaper',
    baseHP: 100,
    speed: 240,
    color: 0x64748b,
    skills: [
      { name: 'Soul Slash', desc: 'Deals heavy melee damage and lifesteal.' },
      { name: 'Shadow Step', desc: 'Teleport behind the nearest enemy.' },
      { name: 'Harvest', desc: 'Drain HP from all nearby enemies.' },
    ],
    passive: { name: 'Lifesteal', desc: 'Recover HP for a portion of melee damage dealt.' },
  },
  Brute: {
    name: 'Brute',
    baseHP: 130,
    speed: 200,
    color: 0xfbbf24,
    skills: [
      { name: 'Shield Bash', desc: 'Stun and knock back enemies in front.' },
      { name: 'Taunt', desc: 'Force enemies to attack you.' },
      { name: 'Earthquake', desc: 'Slam the ground for area damage.' },
    ],
    passive: { name: 'Fortified', desc: 'Take reduced damage from all sources.' },
  },
};
