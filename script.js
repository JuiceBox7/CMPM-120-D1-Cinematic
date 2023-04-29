class Start extends Phaser.Scene {

    constructor() {
        super({key:'Start'});
    }

    create() {
        this.add.text(185, 235, 'Click anywhere\n   to begin', {fontSize: 50});
        this.input.on('pointerdown', () => this.scene.start('LoadingScreen'));
    }
}

class LoadingScreen extends Phaser.Scene {

    constructor() {
        super({key:'LoadingScreen'});
    }

    preload() {
        this.load.path = 'assets/';
        this.load.image('logo', 'studio-name.png');
        this.load.audio('shink', 'unsheathing.mp3');
        
        for (let i=0; i < 500; i++) {
            this.load.image('logo'+i, '')
        }

        let box = this.add.graphics();
        let bar = this.add.graphics();
        box.fillStyle(0x222222, 0.8);
        box.fillRect(240, 270, 320, 50);

        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        let percentText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '0%',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        this.load.on('progress', function(value) {
            console.log(value);
            bar.clear();
            bar.fillStyle(0xffffff, 1);
            bar.fillRect(250, 280, 300 * value, 30);
            percentText.setText(parseInt(value * 100) + '%');
        });

        this.load.on('complete', function() {
            console.log('complete');
            bar.destroy();
            box.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
    }

    create() {
        this.add.sprite(400, 300, 'logo');
        this.cameras.main.fadeIn(1000);
        let shink = this.sound.add('shink');
        shink.play();

        this.time.addEvent({
            delay: 2000,
            loop: false,
            callback: () => {
                this.scene.start('Menu');
            }
        });
    }
}

class Menu extends Phaser.Scene {

    constructor() {
        super({key:'Menu'});
    }

    preload() {
        this.load.path = 'assets/';
        this.load.image('background', 'menu-background.png');
        this.load.image('title', 'midnight-title.png');
        this.load.image('menu', 'menu.png');
        this.load.image('hover', 'menu-click.png');
        this.load.audio('click', 'game-start.mp3');
    }

    create() {
        this.cameras.main.fadeIn(3000);
        let background = this.add.image(-1200, 300, 'background');
        let title = this.add.image(200, 0, 'title');
        let menu = this.add.image(300, 1350, 'menu');
        let click = this.sound.add('click');
        let hover = this.add.image(300, 1350, 'hover');
        hover.setVisible(false);

        let cam = this.cameras.main;
        let targetScene = this.scene.get('Dave');
        let targetCam = targetScene.cameras.main;
        let defaultWidth = this.cameras.default.width;
        
        let startbutton = this.add.text(10, 310, 'PLAYY', {fontSize: 60, color: 'transparent'});
        startbutton.setInteractive();
        
        startbutton.on('pointerover', () => {
            hover.setVisible(true);
        });
        
        startbutton.on('pointerout', () => {
            hover.setVisible(false);
        });
        
        startbutton.on('pointerdown', () => {
            click.play();
            this.scene.transition({
                target: 'Dave',
                sleep: true,
                duration: 1000,
                onUpdate: function(progress) {
                    const t = Phaser.Math.Easing.Quadratic.InOut(progress);
                    cam.setViewport(t * defaultWidth, 0, (1 - t) * defaultWidth, cam.height);
                    targetCam.setViewport(0, 0, t * defaultWidth, targetCam.height);
                    targetCam.setScroll((1 - t) * defaultWidth, 0);
                }
            });
        });
        
        this.tweens.add({
            targets: background,
            x: 400,
            duration: 2000,
            ease: 'linear',
        });
        
        this.tweens.add({
            targets: title,
            y: 350,
            duration: 2500,
            ease: 'Expo ease-in'
        });
        
        this.tweens.add({
            targets: menu,
            y: 350,
            duration: 2500,
            ease: 'Expo ease-in'
        });
        
        this.tweens.add({
            targets: hover,
            y: 350,
            duration: 2500,
            ease: 'Expo ease-in'
        });
    }
}

class Dave extends Phaser.Scene {
    
    constructor() {
        super({key:'Dave'});
    }
    
    preload() {
        this.load.path = 'assets/';
        this.load.image('dave', 'dave.png');
    }
    
    create() {
        this.cameras.main.setBackgroundColor(0xffffff);
        this.add.image(100, 300, 'dave');
        this.add.rectangle(200, 425, 500, 150, 0x000000);
        this.add.rectangle(700, 425, 150, 150, 0x000000);
        this.add.circle(700, 300, 30, 0x000000);
        this.add.circle(700, 300, 25, 0xffffff);
        let txt = this.add.text(10, 100, 'It looks like Dave has a long road ahead of him...', {fontSize: 25});
        txt.setColor(0xffffff);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [Start, LoadingScreen, Menu, Dave]
};

const game = new Phaser.Game(config);
