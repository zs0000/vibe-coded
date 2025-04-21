// src/classes/Inventory.ts

export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface InventoryItem {
  id: string; // unique identifier
  name: string;
  type: 'weapon' | 'armor' | 'accessory' | 'consumable';
  rarity: ItemRarity;
  // Add more fields as needed (e.g., stat bonuses)
}

export interface CraftingMaterial {
  id: string; // unique identifier
  name: string;
  amount: number;
}

export interface InventoryData {
  items: InventoryItem[]; // limited by MAX_ITEMS
  materials: CraftingMaterial[];
}

export const MAX_ITEMS = 20;
