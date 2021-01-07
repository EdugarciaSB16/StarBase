class Game{
    constructor(canvasId){
        this.canvas = document.getElementById(canvasId)
        this.ctx = this.canvas.getContext('2d')
        this.canvas.width = 840
        this.canvas.height = 600
        this.drawInterval = undefined
        this.fps = 1000 / 60

        //INSTANCIAS
       this.background = new Background(this.ctx)
       this.ship = new Ship(this.ctx, 20, this.canvas.height / 2)
       this.enemy = new Enemy()
       this.enemies = []
       this.bulletsEnemies = []
       this.bulletEnemy = new Bullet_Enemy()
       this.drawCount = 0
       this.health = 100
       this.collidesShip = false
       this.showExplosion = false
       this.explosionEnemy = new Explosion(this.ctx, 0, 0)

       //SOUNDS
       const themeGame =  new Audio('./sounds/music-back.mp3')
       themeGame.volume = 0.4
       this.points = 0
       const themeExplo = new Audio('./sounds/explosion-alien.mp3')

       this.sounds = {
           theme: themeGame,
           explo: themeExplo
       }

        this.gameover = new Image()
        this.gameover.src = 'images/gameover.png'

        this.gameover.isReady = false

        this.gameover.onload = () => {
            this.gameover.isReady = true
        }
    }

    start(){
        if(!this.drawInterval){
            this.sounds.theme.play()
            this.drawInterval = setInterval(() => {
                this.clear()
                this.move()
                this.draw()
                this.checkCollisions()
                this.drawCount++
                
                if (this.drawCount % OBS_FRAMES === 0) {
                    this.addEnemies()
                    this.drawCount = 0
                }
                
            }, this.fps);
        }
    }

    isReady() {
        return this.gameover.isReady
    }
    clear(){
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
        this.enemies = this.enemies.filter(enemy => enemy.x > -100)
        this.bulletsEnemies = this.bulletsEnemies.filter(bullet => bullet.x>0)
    }

    stop(){
         clearInterval(this.drawInterval)

        if (this.isReady()) {
            this.ctx.drawImage(
                this.gameover,
                200,
                200,
                450,
                150
            )
        }

        this.ctx.save()
        this.ctx.font = '26px Arial'
        this.ctx.fillStyle = 'yellow'
        this.ctx.textAlign = 'center'
        this.ctx.fillText(
            `Your final score: ${this.points}`,
            this.canvas.width / 2,
            400,
        )
        this.ctx.restore()
         
    }
    
    draw(){
        this.background.draw()
        this.ship.draw()
        this.enemies.forEach(enemy => enemy.draw())
        this.bulletsEnemies.forEach(bullet => bullet.draw())
        
        if(this.showExplosion){
            this.explosionEnemy.draw()
        }
        
        this.ctx.save()
        this.ctx.font = '18px Arial'
        this.ctx.fillStyle = "yellow";
        this.ctx.fillText(`Score: ${this.points}`, 40, 35)
        this.ctx.restore()
    }
    
    move(){
        this.background.move()
        this.ship.move()
        this.enemies.forEach(enemy => enemy.move())
        this.bulletsEnemies.forEach(bullet => bullet.move())
    }
    
    onKeyEvent(event) {
        this.ship.onKeyEvent(event)
    }
    
    addEnemies(){
        const RandomPos = Math.floor(Math.random() * 480 - 120) + 120
        this.enemies.push(
            this.enemy = new Enemy(this.ctx, this.canvas.width, RandomPos)
            )
            this.bulletsEnemies.push(
                this.bulletEnemy = new Bullet_Enemy(this.ctx, this.enemy.x, this.enemy.y + 30)
            )
        }

    checkCollisionsEnemy(){
        //COLISION BULLET -> ENEMY
        const prevEnemies = this.enemies.length
        this.enemies = this.enemies.filter(enemy =>{
            const collitionedBullet = this.ship.bullets.find(bullet => bullet.collidesWith(enemy))

            if(collitionedBullet){
                this.ship.bullets.splice(this.ship.bullets.indexOf(collitionedBullet), 1)

                this.explosionEnemy.horizontalFrameIndex = 0
                this.explosionEnemy.verticalFrameIndex = 0
                this.explosionEnemy.x = enemy.x
                this.explosionEnemy.y = enemy.y
                this.sounds.explo.currentTime = 0
                this.sounds.explo.play()
                this.showExplosion = true
                //this.explosionEnemy.draw()

                setTimeout(() => {
                    this.showExplosion = false
                }, 2000);
                
                return false
            }

            return true
        })
    
        const newPoints = prevEnemies - this.enemies.length
        this.points += newPoints
    }    

    checkCollisionsShip(){
        if(this.bulletsEnemies.some(bullet => this.ship.collidesWith(bullet))){
        
           this.bulletsEnemies = this.bulletsEnemies.filter(bullet => !this.ship.collidesWith(bullet))
           this.health -=35
        }
        if(this.health <= 0){
            this.stop()
        }

        this.collidesShip = false
    }

    checkCollisions() {
        this.checkCollisionsEnemy()
        this.checkCollisionsShip()
        
    }
}