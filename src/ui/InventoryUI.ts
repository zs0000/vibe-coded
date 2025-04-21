import Phaser from 'phaser';
import { InventoryData } from '../classes/Inventory';

export class InventoryUI {
  private scene: Phaser.Scene;
  private panel?: Phaser.GameObjects.Graphics;
  private texts: Phaser.GameObjects.Text[] = [];
  private debugText?: Phaser.GameObjects.Text;
  public isOpen: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  open(inventory: InventoryData) {
    this.isOpen = true;
    this.draw(inventory);
  }

  close() {
    this.isOpen = false;
    this.destroy();
  }

  toggle(inventory: InventoryData) {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.draw(inventory);
    } else {
      this.destroy();
    }
  }

  draw(inventory: InventoryData) {
    this.destroy();
    // Debug text
    this.debugText = this.scene.add.text(40, 10, 'INVENTORY OPEN', { fontSize: '20px', color: '#f87171', fontFamily: 'sans-serif', fontStyle: 'bold' })
      .setDepth(9998).setAlpha(1).setScrollFactor(0).setVisible(true);
    // Draw panel
    this.panel = this.scene.add.graphics();
    this.panel.fillStyle(0x1e293b, 1.0);
    this.panel.fillRect(40, 40, 270, 400);
    this.panel.lineStyle(2, 0xffffff);
    this.panel.strokeRect(40, 40, 270, 400);
    this.panel.setDepth(9998).setAlpha(1).setScrollFactor(0).setVisible(true);
    // Title
    const titleText = this.scene.add.text(50, 50, 'Inventory', { fontSize: '22px', color: '#fff', fontFamily: 'sans-serif', fontStyle: 'bold' })
      .setDepth(9999).setAlpha(1).setScrollFactor(0).setVisible(true);
    this.texts.push(titleText);
    // Items
    inventory.items.forEach((item, i) => {
      const t = this.scene.add.text(50, 80 + i * 22, `[${item.rarity}] ${item.name}`, { fontSize: '16px', color: '#fbbf24', fontFamily: 'sans-serif' })
        .setDepth(9999).setAlpha(1).setScrollFactor(0).setVisible(true);
      this.texts.push(t);
    });
    // Materials
    let matY = 80 + inventory.items.length * 22 + 16;
    const matLabel = this.scene.add.text(50, matY, 'Materials:', { fontSize: '17px', color: '#bae6fd', fontFamily: 'sans-serif' })
      .setDepth(9999).setAlpha(1).setScrollFactor(0).setVisible(true);
    this.texts.push(matLabel);
    inventory.materials.forEach((mat, i) => {
      const t = this.scene.add.text(60, matY + 24 + i * 20, `${mat.name}: ${mat.amount}`, { fontSize: '15px', color: '#a7f3d0', fontFamily: 'sans-serif' })
        .setDepth(9999).setAlpha(1).setScrollFactor(0).setVisible(true);
      this.texts.push(t);
    });
  }

  destroy() {
    if (this.panel) this.panel.destroy();
    this.texts.forEach(t => t.destroy());
    this.texts = [];
    if (this.debugText) this.debugText.destroy();
  }
}
