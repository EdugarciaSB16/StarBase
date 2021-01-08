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
       this.healthBoss = 300
       this.collidesShip = false
       this.explosionEnemy = new Explosion(this.ctx, 0, 0)
       this.showBoss = false
       this.eneFrames = 120
       this.bulletsBoss = []
       this.countHealth = 3
      
       //SOUNDS
       const themeGame =  new Audio('./sounds/music-back.mp3')
       themeGame.volume = 0.3

       this.kill = 0
       this.points = 0
       const themeExplo = new Audio('./sounds/explosion-alien.mp3')
       const themeOver = new Audio('./sounds/gameover.mp3')
       const themeWin = new Audio('./sounds/win.wav')

       this.sounds = {
           theme: themeGame,
           explo: themeExplo,
           over: themeOver,
           win: themeWin
       }

        this.gameover = new Image()
        this.gameover.src = './images/gameover.png'
        this.gameover.isReady = false

        this.win = new Image()
        this.win.src = './images/win.png'
        this.win.isReadyWin = false

        this.iconScore = new Image()
        this.iconScore.src = './images/score.png'
        this.iconScore.isReadyIcon = false

        this.iconHealth = new Image()
        this.iconHealth.src = './images/health.png'
        this.iconHealth.isReadyHealth = false

        this.gameover.onload = () => {
            this.gameover.isReady = true
        }

        this.iconScore.onload = () => {
            this.iconScore.isReadyIcon = true
        }

        this.win.onload = () =>{
            this.win.isReadyWin = true
        }

        this.iconHealth.onload = () => {
            this.iconHealth.isReadyHealth = true
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
                
                if (this.drawCount % this.eneFrames === 0) {
                    this.addEnemies()
                    this.drawCount = 0
                    
                } 
                //Levels
                if(this.points === 250){ // 250
                    this.eneFrames = 90
                }else if(this.points === 700){ //700
                    this.eneFrames = 70
                }else if(this.points >= 1500){ //1500
                    this.enemies = []
                    this.bulletsEnemies = []
                    if (!this.showBoss){
                        this.boss = new Boss(this.ctx, 840, 250)
                        this.showBoss = true
                    }
                    this.checkCollisionsShipWithBoss() 
                    this.checkCollisionsBossWithShip()
                }

            }, this.fps);
        }
    }

    isReadyGame() {
        return this.gameover.isReady
    }

    isReadyIcon(){
        return this.iconScore.isReadyIcon
    }

    isReadyWin(){
        return this.win.isReadyWin
    }

    isReadyHealth(){
        return this.iconHealth.isReadyHealth
    }

    clear(){
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
        this.enemies = this.enemies.filter(enemy => enemy.x > -100)
        this.bulletsEnemies = this.bulletsEnemies.filter(bullet => bullet.x>0)
    }

    stop(){
         clearInterval(this.drawInterval)

        if (this.isReadyGame) {
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

    winStop(){
        clearInterval(this.drawInterval)

        if (this.isReadyWin()) {
            this.ctx.drawImage(
                this.win,
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
        this.explosionEnemy.draw()

        if(this.showBoss){
            this.boss.draw()
        }

        if (this.isReadyIcon()) {
            this.ctx.drawImage(
                this.iconScore,
                20,
                70,
                30,
                30
            )
        }

        if (this.isReadyHealth()) {
            this.ctx.drawImage(
                this.iconHealth,
                20,
                15,
                30,
                30
            )
        }

        this.ctx.save()
        this.ctx.font = '18px Arial'
        this.ctx.fillStyle = "#36d1e9";
        this.ctx.fillText(`Score: ${this.points}`, 65, 90)
        this.ctx.restore()

        this.ctx.save()
        this.ctx.font = '18px Arial'
        this.ctx.fillStyle = "#36d1e9";
        this.ctx.fillText(`${this.countHealth}`, 60, 35)
        this.ctx.restore()
    }
    
    move(){
        this.background.move()
        this.ship.move()
        this.enemies.forEach(enemy => enemy.move())
        this.bulletsEnemies.forEach(bullet => bullet.move())
        
        if(this.showBoss){  
            this.boss.move()
        }
        this.bulletsBoss.forEach(bullet => bullet.move())
        
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
                this.sounds.explo.currentTime = 0.5
                this.sounds.explo.play()
                this.explosionEnemy.show = true
                this.points += 50
                return false
            }

            return true
        })
    
        const newPoints = prevEnemies - this.enemies.length
        this.kill += newPoints
    }    

    checkCollisionsShip(){
        if(this.bulletsEnemies.some(bullet => this.ship.collidesWith(bullet))){
        
           this.bulletsEnemies = this.bulletsEnemies.filter(bullet => !this.ship.collidesWith(bullet))
           this.health -=35
           this.countHealth --
            this.sounds.explo.currentTime = 0.5
            this.sounds.explo.play()
        }

        if(this.health <= 0){
            this.stop()
            this.sounds.theme.pause()
            this.sounds.over.play()
        }

        this.collidesShip = false
    }

    checkCollisionsShipWithBoss() {
        if (this.boss.bullets.some(bullet => this.ship.collidesWith(bullet))) {
            this.boss.bullets = this.boss.bullets.filter(bullet => !this.ship.collidesWith(bullet))
            this.health -= 35
            this.countHealth --
            this.sounds.explo.currentTime = 0.5
            this.sounds.explo.play()
        }

        if (this.health <= 0) {
            this.stop()
            this.sounds.theme.pause()
            this.sounds.over.play()
        }

        this.collidesShip = false
    }

    checkCollisionsBossWithShip(){
        if (this.ship.bullets.some(bullet => this.boss.collidesWith(bullet))) {

            this.ship.bullets = this.ship.bullets.filter(bullet => !this.boss.collidesWith(bullet))
            this.healthBoss -= 30
            this.points += 50
            this.sounds.explo.currentTime = 0.5
            this.sounds.explo.play()
        }
        if (this.healthBoss <= 0) {
            this.boss.vy = 0
            this.sounds.explo.currentTime = 0.5
            this.sounds.explo.play()
            this.explosionEnemy.horizontalFrameIndex = 0
            this.explosionEnemy.verticalFrameIndex = 0
            this.explosionEnemy.x = this.boss.x
            this.explosionEnemy.y = this.boss.y
            this.explosionEnemy.show = true
            this.points += 3000

            setTimeout(() => {
                this.winStop()
                this.sounds.theme.pause()
                this.sounds.win.play()

            }, 2500);
            return false
        }

        this.collidesShip = false
    }

    checkCollisions() {
        this.checkCollisionsEnemy()
        this.checkCollisionsShip()
    }
}