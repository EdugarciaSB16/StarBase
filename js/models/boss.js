class Boss{
    constructor(ctx, x, y){
        this.ctx = ctx
        this.x = x
        this.y = y
        this.width = 135
        this.height = 100
        this.speed = 5
        this.vx = 0
        this.vy = 0

        this.img = new Image()
        this.img.src = './images/boss-enemy.png'
        this.img.isReady = false
        this.img.onload = () => {
            this.img.isReady = true
        }
    }

    clear(){

    }

    isReady(){
        return this.img.isReady
    }

    draw(){
        console.log('entra draw')
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

    }

}