class Bullet {
    constructor(ctx, x, y){
        this.ctx = ctx
        this.x = x
        this.y = y

        this.vx = SPEED
        this.xy = SPEED

        this.sprite = new Image()
        this.sprite.src = './images/bullet.png'
        this.sprite.isReady = false

        this.width = 20
        this.height = 10    


        this.sprite.onload = () =>{
            this.sprite.isReady = true
        }
    }

    isReady(){
        return this.sprite.isReady
    }

    draw(){
        if(this.isReady()){
            this.ctx.drawImage(
                this.sprite,
                this.x,
                this.y,
                this.width,
                this.height
            )
        }
    }

    move(){
        this.x += this.vx
    }
    
     collidesWith(element) {
        return this.x < element.x + element.width &&
            this.x + this.width > element.x &&
            this.y < element.y + element.height &&
            this.y + this.height > element.y
    }
}