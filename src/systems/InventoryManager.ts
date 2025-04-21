import { InventoryData, InventoryItem, CraftingMaterial } from '../classes/Inventory';
import { saveInventory, loadInventory } from './Persistence';

export class InventoryManager {
  private data: InventoryData;
  private maxItems: number = 20;

  constructor() {
    this.data = loadInventory();
  }

  getInventory(): InventoryData {
    return this.data;
  }

  addItem(item: InventoryItem): boolean {
    if (this.data.items.length >= this.maxItems) return false;
    this.data.items.push(item);
    saveInventory(this.data);
    return true;
  }

  removeItem(itemId: string): boolean {
    const idx = this.data.items.findIndex(i => i.id === itemId);
    if (idx === -1) return false;
    this.data.items.splice(idx, 1);
    saveInventory(this.data);
    return true;
  }

  addMaterial(material: CraftingMaterial): void {
    const existing = this.data.materials.find(m => m.id === material.id);
    if (existing) {
      existing.amount += material.amount;
    } else {
      this.data.materials.push({ ...material });
    }
    saveInventory(this.data);
  }

  removeMaterial(materialId: string, amount: number): boolean {
    const mat = this.data.materials.find(m => m.id === materialId);
    if (!mat || mat.amount < amount) return false;
    mat.amount -= amount;
    if (mat.amount === 0) {
      this.data.materials = this.data.materials.filter(m => m.id !== materialId);
    }
    saveInventory(this.data);
    return true;
  }

  clearInventory(): void {
    this.data = { items: [], materials: [] };
    saveInventory(this.data);
  }
}
