class Ship{
    constructor(ctx, x, y){
        this.ctx = ctx
        this.x = x
        this.y = y
        this.width = 135
        this.height = 100
        this.speed = 5
        
        this.vx = 0
        this.vy = 0
        this.canFire = true
        
        this.movements = {
            up: false,
            down: false,
            left: false,
            right: false
        }
        
        this.img = new Image()
        this.img.src = "./images/ships-s.png"
        this.img.isReady = false
        this.img.onload = () =>{
            this.img.isReady = true
        }
        
        this.bullets = []
        this.ext = new Exhaust(this.ctx, this.x, this.y + 45)

        this.sounds = {
            theme: new Audio('./sounds/laser.mp3')
        }
    }

    clear(){
        this.bullets = this.bullets.filter(bullet => bullet.x < this.ctx.canvas.width)
    }

    isReady(){
        return this.img.isReady
    }

    draw(){
        if(this.isReady()){
            this.ctx.drawImage(
                this.img,
                this.x,
                this.y,
                this.width,
                this.height
            )
            this.bullets.forEach(bullet => bullet.draw()) 
            this.ext.draw()
        }
    }

    move(){
        this.bullets.forEach(bullet => bullet.move())
        this.ext.x = this.x
        this.ext.y = this.y + 45

        if (this.movements.up) {
            this.vy = -this.speed
        } else if (this.movements.down) {
            this.vy = this.speed
        } else {
            this.vy = 0
        }

        if (this.movements.right) {
            this.vx = this.speed
        } else if (this.movements.left) {
            this.vx = -this.speed
        } else {
            this.vx = 0
        }

        this.x += this.vx
        this.y += this.vy

        if (this.x + this.width >= this.ctx.canvas.width) {
            this.x = this.ctx.canvas.width - this.width
        } else if (this.x <= 0) {
            this.x = 0
        }

        if (this.y + this.height >= this.ctx.canvas.height) {
            this.y = this.ctx.canvas.height - this.height
        } else if (this.y <= 0) {
            this.y = 0
        }
    }

    onKeyEvent(event) {
        const status = event.type === 'keydown'

        switch (event.keyCode) {
            case KEY_UP:
                this.movements.up = status
                break;
            case KEY_RIGHT:
                this.movements.right = status
                break;
            case KEY_DOWN:
                this.movements.down = status
                break;
            case KEY_LEFT:
                this.movements.left = status
                break;

            case KEY_BULLET:
                if(this.canFire){
                    this.bullets.push(new Bullet(this.ctx, this.x + this.width, this.y + 55))
                
                this.canFire = false
                this.sounds.theme.currentTime = 0
                this.sounds.theme.play()

                setTimeout(() => {
                    this.canFire = true
                }, 500);
            }
                break;
         }
    }
    
    collidesWith(element) {
        return this.x < element.x + element.width &&
            this.x + this.width > element.x &&
            this.y < element.y + element.height &&
            this.y + this.height > element.y
    }
}