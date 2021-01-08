class Boss{
    constructor(ctx, x, y){
        this.ctx = ctx
        this.x = x
        this.y = y
        this.width = 150  
        this.height = 100
        this.speed = 5
        this.vx = -3
        this.vy = 0

        this.img = new Image()
        this.img.src = './images/boss-enemy.png'
        this.img.isReady = false
        this.img.onload = () => {
            this.img.isReady = true
        }
        this.canMove = true
        this.ext = new ExhaustBoss(this.ctx, this.x, this.y + 45)
        this.bullets = []
        this.canFire = true

    }

    clear(){
        this.bullets = this.bullets.filter(bullet => bullet.x < this.ctx.canvas.width)
    }

    isReady(){
        return this.img.isReady
    }

    draw(){
        if (this.isReady()) {
            this.ctx.drawImage(
                this.img,
                this.x,
                this.y,
                this.width,
                this.height
            )
        this.ext.draw()
        this.bullets.forEach(bullet => bullet.draw())
        this.shoot()
        
        }        
    }

    move(){
        this.y += this.vy
        this.ext.x = this.x + 140
        this.ext.y = this.y + 45
        this.bullets.forEach(bullet => bullet.move())

        if (this.y + this.height >= this.ctx.canvas.height) {
            this.y = this.ctx.canvas.height - this.height
        } else if (this.y <= 0) {
            this.y = 0
        }
        
        if(this.x >= 600){
            this.x += this.vx
            
        }else{
            
        if (this.canMove) {
            if ((Math.floor(Math.random() * 2)) === 1) {
                this.vy = -1.5
            } else {
                this.vy = 1.5
            } 
            this.canMove = false
            setTimeout(() => this.canMove = true, 2000)
        }
    }}

    shoot(){
        if(this.canFire){
            this.bullets.push(new Bullet_Enemy(this.ctx, this.x, this.y + 70))
            this.canFire = false

            setTimeout(() => {
                this.canFire = true
            }, 1000);
        }
    }

    collidesWith(element) {
        return this.x < element.x + element.width &&
            this.x + this.width > element.x &&
            this.y < element.y + element.height &&
            this.y + this.height > element.y
    }
}