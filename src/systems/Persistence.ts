export type EquippedItems = {
  weapon: string | null;
  armor: string | null;
  accessory: string | null;
};

const EQUIPPED_KEY = 'equippedItems';

export function loadEquippedItems(): EquippedItems {
  const data = localStorage.getItem(EQUIPPED_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      // fallback to default if corrupted
    }
  }
  return { weapon: null, armor: null, accessory: null };
}

export function saveEquippedItems(items: EquippedItems) {
  localStorage.setItem(EQUIPPED_KEY, JSON.stringify(items));
}

export function clearEquippedItems() {
  localStorage.removeItem(EQUIPPED_KEY);
}

// --- Inventory Persistence ---
import { InventoryData } from '../classes/Inventory';

const INVENTORY_KEY = 'playerInventory';

export function saveInventory(inv: InventoryData) {
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(inv));
}

export function loadInventory(): InventoryData {
  const data = localStorage.getItem(INVENTORY_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {}
  }
  return { items: [], materials: [] };
}

export function clearInventory() {
  localStorage.removeItem(INVENTORY_KEY);
}
