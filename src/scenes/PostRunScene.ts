import Phaser from 'phaser';

export default class PostRunScene extends Phaser.Scene {
  constructor() {
    super('PostRun');
  }

  create() {
    this.add.text(480, 160, 'Run Over!', {
      fontSize: '40px', color: '#fff', fontFamily: 'sans-serif', align: 'center',
    }).setOrigin(0.5);
    this.add.text(480, 240, 'Click to return to Main Menu', {
      fontSize: '24px', color: '#cbd5e1',
    }).setOrigin(0.5);

    this.input.once('pointerdown', () => {
      this.scene.start('MainMenu');
    });
  }
}
