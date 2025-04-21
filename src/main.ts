import Phaser from 'phaser';

// Placeholder: Will be replaced with real scenes
import MainMenuScene from './scenes/MainMenuScene';
import GameScene from './scenes/GameScene';
import PostRunScene from './scenes/PostRunScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  backgroundColor: '#22223b',
  parent: 'game-root',
  scene: [MainMenuScene, GameScene, PostRunScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  new Phaser.Game(config);
});
