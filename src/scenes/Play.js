class Play extends Phaser.Scene{
    constructor() {
        super("playScene")
    }

    //int(), preload(), create()
    //load images/tile sprites
    preload(){
        this.load.image('rocket' , './assets/rocket.png')
        this.load.image('spaceship', './assets/spaceship.png')
        this.load.image('starfield', './assets/starfield.png')
        //load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png',{
            frameWidth: 64,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 9
        })

    }
    

    create() {

        //place starfield
        this.starfield = this.add.tileSprite(0, 0, game.config.width, game.config.height,'starfield').setOrigin(0,0)
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width,
            borderUISize * 2, 0x00FF00).setOrigin(0,0)
            //white borders
            this.add.rectangle(0,0,game.config.width,borderUISize,0xFFFFFF).setOrigin
            (0,0)
            this.add.rectangle(0,game.config.height - borderUISize, game.config.width,borderUISize,0xFFFFFF).setOrigin(0,0)
            this.add.rectangle(0,0,borderUISize,game.config.height, 0xFFFFFF).setOrigin(0,0)
            this.add.rectangle(game.config.width - borderUISize,0,borderUISize,game.config.height,0xFFFFFF).setOrigin(0,0)

            //add rocket player1
            this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5,0)


            // add spaceships
            this.ship1 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0)
            this.ship2 = new Spaceship(this, game.config.width + borderUISize*4, borderUISize*5 + borderPadding*3, 'spaceship', 0, 20).setOrigin(0,0)
            this.ship3 = new Spaceship(this, game.config.width, borderUISize*5 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0)

            //define keys
            keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
            keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
            keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
            keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

            //animation config
            this.anims.create({
                key: 'explode',
                frames: this.anims.generateFrameNumbers('explosion',{
                    start: 0,
                    end: 9,
                    first: 0
                }),
                frameRate: 30

            })

            

        
    }
    
    update(){
        this.starfield.tilePositionX -= starSpeed

        //update rocket
        this.p1Rocket.update()

        //update spaceship
        this.ship1.update()
        this.ship2.update()
        this.ship3.update()

        //check collisions
        if(this.checkCollision(this.p1Rocket, this.ship3)){
            //console.log('kaboom ship 3')
            this.p1Rocket.reset()
            //this.ship3.reset()
            this.shipExplode(this.ship3)
        }
        if(this.checkCollision(this.p1Rocket, this.ship2)){
           // console.log('kaboom ship 2')
           this.p1Rocket.reset()
           //this.ship2.reset()
           this.shipExplode(this.ship2)
        }
        if(this.checkCollision(this.p1Rocket, this.ship1)){
           // console.log('kaboom ship 1')
           this.p1Rocket.reset()
           //this.ship1.reset()
           this.shipExplode(this.ship1)
        }
    }

    checkCollision(rocket, ship){
        // simple AABB checking
        if(rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship.y){
            return true
        }else{
            return false
        }
    }

    shipExplode(ship){
        //temporarily hide the ship
        ship.alpha = 0
        //create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0)
        boom.anims.play('explode')
        boom.on('animationcomplete', () => {
            ship.reset()
            ship.alpha = 1
            boom.destroy()
        })
    }
}