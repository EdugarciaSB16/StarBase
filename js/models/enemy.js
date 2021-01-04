class Enemy{
    constructor(ctx, x, y){
        this.ctx = ctx
        this.x = x
        this.y = y
        this.width = 150
        this.height = 120
        
        this.vx= -3

        this.img = new Image()
        this.img.src = "./images/alien.png"
        this.img.isReady = false
        this.img.onload = () => {
            this.img.isReady = true
        }

    }

    isReady(){
        return this.img.isReady
    }

    draw() {
        if (this.isReady()) {
            this.ctx.drawImage(
                this.img,
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