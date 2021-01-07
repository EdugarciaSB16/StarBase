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
       this.enemies = []
       this.enemy = new Enemy()
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
                }else if(this.points >=2){
                    //Hacer transion al boss
                    this.enemies = []
                    this.bulletsEnemies = []
                    this.boss = new Boss(this.ctx, 300, 300)
                    setTimeout(() => {
                       this.drawBoss()
                    }, 1000);
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
        
        /*if(this.showExplosion){
            this.explosionEnemy.draw()
        }*/
        
        this.ctx.save()
        this.ctx.font = '18px Arial'
        this.ctx.fillStyle = "yellow";
        this.ctx.fillText(`Score: ${this.points}`, 40, 35)
        this.ctx.restore()
    }
    
    drawBoss(){
        this.boss.draw()
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
        const restEnemy = this.enemies.filter((enemy)=>{

            /*if(this.ship.bullet.collidesWith(enemy)){
                this.explosionEnemy.horizontalFrameIndex = 0
                this.explosionEnemy.verticalFrameIndex = 0
                this.explosionEnemy.x = enemy.x
                this.explosionEnemy.y = enemy.y
            }*/

           return !this.ship.bullet.collidesWith(enemy)
        })
    
        const numEnemy = this.enemies.length - restEnemy.length
        this.points += numEnemy
        
        if (numEnemy) {
           // this.ship.bullets = this.ship.bullets.filter(bullet => !this.ship.bullet.collidesWith(bullet))
         
            this.sounds.explo.currentTime = 0
            this.sounds.explo.play()
            this.showExplosion = true

            setTimeout(() => {
                this.showExplosion = false
            }, 2000);
        }
    
        this.enemies = restEnemy
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