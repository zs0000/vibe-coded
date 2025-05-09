import Phaser from 'phaser';
import { loadEquippedItems, saveEquippedItems, EquippedItems } from '../systems/Persistence';
import { PlayerClassKey, PlayerClassDef, CLASS_DEFS } from '../classes/PlayerClass';
import { InventoryManager } from '../systems/InventoryManager';
import { InventoryUI } from '../ui/InventoryUI';
import { BasePlayerClass } from '../classes/player/BasePlayerClass';
import { RangerClass } from '../classes/player/RangerClass';
import { SorceressClass } from '../classes/player/SorceressClass';
import { ReaperClass } from '../classes/player/ReaperClass';
import { BruteClass } from '../classes/player/BruteClass';

interface Enemy extends Phaser.GameObjects.Rectangle {
  hp: number;
}

export default class GameScene extends Phaser.Scene {
  equipped: EquippedItems;
  playerClass: PlayerClassKey;
  playerClassObj!: BasePlayerClass;
  player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  enemies: Enemy[] = [];
  playerHP: number = 100;
  maxHP: number = 100;
  hpBar!: Phaser.GameObjects.Graphics;
  wave: number = 1;
  nextWaveTimer!: Phaser.Time.TimerEvent;
  canShoot: boolean = true;
  platforms!: Phaser.Physics.Arcade.StaticGroup;
  jumpKey!: Phaser.Input.Keyboard.Key;
  bgLayers: Phaser.GameObjects.TileSprite[] = [];
  inventoryManager: InventoryManager;
  inventoryUI: InventoryUI;

  worldWidth = 3000;
  worldHeight = 1200;

  // Platform data for drawing
  platformRects = [
    { x: this.worldWidth / 2, y: this.worldHeight - 32, w: this.worldWidth, h: 64, color: 0x334155 }, // ground
    { x: 600, y: 900, w: 300, h: 24, color: 0x64748b },
    { x: 1200, y: 700, w: 300, h: 24, color: 0x64748b },
    { x: 2000, y: 500, w: 300, h: 24, color: 0x64748b }
  ];

  constructor() {
    super('Game');
    this.equipped = loadEquippedItems();
    const stored = localStorage.getItem('selectedClass') as PlayerClassKey | null;
    this.playerClass = stored && CLASS_DEFS[stored] ? stored : 'Ranger';
    // Use new class-based system
    switch (this.playerClass) {
      case 'Ranger':
        this.playerClassObj = new RangerClass(CLASS_DEFS['Ranger']);
        break;
      case 'Sorceress':
        this.playerClassObj = new SorceressClass(CLASS_DEFS['Sorceress']);
        break;
      case 'Reaper':
        this.playerClassObj = new ReaperClass(CLASS_DEFS['Reaper']);
        break;
      case 'Brute':
        this.playerClassObj = new BruteClass(CLASS_DEFS['Brute']);
        break;
      default:
        this.playerClassObj = new RangerClass(CLASS_DEFS['Ranger']);
    }
    this.inventoryManager = new InventoryManager();
    this.inventoryUI = new InventoryUI(this);
  }

  create() {
    // Parallax backgrounds (still placeholder, will fix color method later)
    this.bgLayers = [
      this.add.tileSprite(0, 0, this.worldWidth, this.worldHeight, '').setOrigin(0, 0).setScrollFactor(0),
      this.add.tileSprite(0, 0, this.worldWidth, this.worldHeight, '').setOrigin(0, 0).setScrollFactor(0.2),
      this.add.tileSprite(0, 0, this.worldWidth, this.worldHeight, '').setOrigin(0, 0).setScrollFactor(0.5),
    ];
    // TODO: Replace with colored images or graphics for true parallax

    // World bounds
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);

    // Draw platform visuals with graphics
    const platGraphics = this.add.graphics();
    this.platformRects.forEach(rect => {
      platGraphics.fillStyle(rect.color, 1);
      platGraphics.fillRect(rect.x - rect.w / 2, rect.y - rect.h / 2, rect.w, rect.h);
    });

    // Platforms (invisible, for collision)
    this.platforms = this.physics.add.staticGroup();
    this.platformRects.forEach(rect => {
      const body = this.platforms.create(rect.x, rect.y, '');
      body.setDisplaySize(rect.w, rect.h).refreshBody();
      body.setVisible(false); // hide collision bodies
    });

    // Player
    this.player = this.physics.add.sprite(200, this.worldHeight - 100, '')
      .setDisplaySize(32, 32)
      .setTint(this.playerClassObj.color);
    this.player.setCollideWorldBounds(true);
    this.player.body.setGravityY(800);
    this.physics.add.collider(this.player, this.platforms);

    // Set player stats by class
    this.playerHP = this.playerClassObj.baseHP;
    this.maxHP = this.playerClassObj.baseHP;

    // Camera follow
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // Health bar (fixed to camera)
    this.hpBar = this.add.graphics();
    this.hpBar.setScrollFactor(0);
    this.drawHPBar();

    // --- HUD: Class & Skills ---
    this.add.text(20, 48, `${this.playerClassObj.name}`, {
      fontSize: '22px', color: '#fff', fontFamily: 'sans-serif', fontStyle: 'bold',
    }).setScrollFactor(0);
    this.add.text(20, 72, `Passive: ${this.playerClassObj.passive.name}`, {
      fontSize: '16px', color: '#cbd5e1', fontFamily: 'sans-serif',
    }).setScrollFactor(0);
    this.playerClassObj.skills.forEach((sk, i) => {
      this.add.text(20, 98 + i * 22, `Skill ${i+1} [${['Q','W','E'][i]}]: ${sk.name}`, {
        fontSize: '15px', color: '#fbbf24', fontFamily: 'sans-serif',
      }).setScrollFactor(0);
    });

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.addKeys('W,A,S,D');
    this.jumpKey = this.input.keyboard.addKey('SPACE');

    // --- Skill Keybinds (Q/W/E) ---
    this.input.keyboard.on('keydown-Q', () => this.useSkill(0));
    this.input.keyboard.on('keydown-W', () => this.useSkill(1));
    this.input.keyboard.on('keydown-E', () => this.useSkill(2));

    // --- Inventory UI ---
    this.input.keyboard.on('keydown-I', () => {
      this.inventoryUI.toggle(this.inventoryManager.getInventory());
    });
    // Add test data if empty
    const inv = this.inventoryManager.getInventory();
    if (inv.items.length === 0) {
      this.inventoryManager.addItem({
        id: 'test-item',
        name: 'Test Sword',
        type: 'weapon',
        rarity: 'common'
      });
    }
    if (inv.materials.length === 0) {
      this.inventoryManager.addMaterial({
        id: 'mat-iron',
        name: 'Iron Ore',
        amount: 5
      });
    }
    // Optionally, open inventory on start for dev:
    // this.inventoryUI.open(this.inventoryManager.getInventory());

    // First wave
    this.spawnWave();
    this.nextWaveTimer = this.time.addEvent({ delay: 30000, callback: this.spawnWave, callbackScope: this, loop: true });

    // Shoot (mouse click)
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.canShoot) this.shootProjectile(pointer.worldX, pointer.worldY);
    });
  }

  update() {
    this.handlePlayerMovement();
    this.moveEnemies();
    this.checkEnemyCollisions();
    this.updateParallax();
  }

  handlePlayerMovement() {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    let vx = 0;
    if (this.cursors.left?.isDown || this.input.keyboard.addKey('A').isDown) vx = -220;
    if (this.cursors.right?.isDown || this.input.keyboard.addKey('D').isDown) vx = 220;
    body.setVelocityX(vx);
    // Jump
    if ((this.cursors.up?.isDown || this.input.keyboard.addKey('W').isDown || this.jumpKey.isDown)
      && body.blocked.down) {
      body.setVelocityY(-400);
    }
  }

  shootProjectile(targetX: number, targetY: number) {
    this.canShoot = false;
    this.playerClassObj.attack(targetX, targetY, this);
    // The attack() method must handle cooldown and projectile logic.
  }

  spawnWave() {
    const count = 3 + Math.floor(this.wave * 1.5);
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(100, this.worldWidth-100);
      const y = Phaser.Math.Between(100, this.worldHeight-400);
      const enemy = this.physics.add.sprite(x, y, '').setDisplaySize(28, 28).setTint(0xf87171) as Enemy;
      enemy.hp = 50 + this.wave * 10;
      enemy.body.setGravityY(800);
      this.physics.add.collider(enemy, this.platforms);
      this.enemies.push(enemy);
    }
    this.wave++;
  }

  moveEnemies() {
    this.enemies = this.enemies.filter(enemy => enemy.active && enemy.body);
    this.enemies.forEach(enemy => {
      const body = enemy.body as Phaser.Physics.Arcade.Body | undefined;
      if (!body) return;
      // Simple AI: walk toward player if on ground
      if (body.blocked.down) {
        const dx = this.player.x - enemy.x;
        body.setVelocityX(Math.sign(dx) * 80);
      }
    });
  }

  checkEnemyCollisions() {
    this.enemies.forEach(enemy => {
      if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemy.getBounds())) {
        this.damagePlayer(8);
      }
    });
  }

  damagePlayer(amount: number) {
    this.playerHP -= amount;
    this.drawHPBar();
    if (this.playerHP <= 0) {
      saveEquippedItems(this.equipped);
      this.scene.start('PostRun');
    }
  }

  drawHPBar() {
    this.hpBar.clear();
    const pct = Math.max(0, this.playerHP / this.maxHP);
    this.hpBar.fillStyle(0x22d3ee);
    this.hpBar.fillRect(20, 20, 200 * pct, 18);
    this.hpBar.lineStyle(2, 0xffffff);
    this.hpBar.strokeRect(20, 20, 200, 18);
  }

  updateParallax() {
    const cam = this.cameras.main;
    this.bgLayers[1].tilePositionX = cam.scrollX * 0.2;
    this.bgLayers[2].tilePositionX = cam.scrollX * 0.5;
  }

  // --- Placeholder for skill activation ---
  useSkill(idx: number) {
    const skill = this.playerClassObj.skills[idx];
    // TODO: Implement actual skill effects per class/skill
    this.add.text(240, 48 + idx * 20, `Used: ${skill.name}`, {
      fontSize: '16px', color: '#f87171', fontFamily: 'sans-serif',
    }).setScrollFactor(0).setDepth(100).setAlpha(0.9);
    // Example: play sound, animation, effect, cooldown, etc.
  }

  // --- Placeholder for passives ---
  // TODO: In update/gameplay, apply passive effects based on class
}
