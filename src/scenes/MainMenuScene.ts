import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    // Placeholder UI: Class selection
    const title = this.add.text(480, 80, 'Echoes of the Endless', {
      fontSize: '40px', color: '#fff', fontFamily: 'sans-serif', fontStyle: 'bold', align: 'center',
    }).setOrigin(0.5);

    const classes = ['Ranger', 'Sorceress', 'Reaper', 'Brute'];
    classes.forEach((cls, i) => {
      const btn = this.add.text(480, 200 + i * 60, cls, {
        fontSize: '32px', color: '#cbd5e1', backgroundColor: '#334155', padding: { left: 24, right: 24, top: 8, bottom: 8 },
      }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          localStorage.setItem('selectedClass', cls);
          this.scene.start('Game');
        });
    });
  }
}
