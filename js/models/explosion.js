class Explosion{
    constructor(ctx, x, y){
        this.ctx = ctx
        this.x = x
        this.y = y

        this.sprite = new Image()
        this.sprite.src = './images/explosion.png'
        this.sprite.isReady = false

        this.sprite.horizontalFrames = 5
        this.sprite.verticalFrames = 2

        this.sprite.horizontalFrameIndex = 0
        this.sprite.verticalFrameIndex = 0


        this.sprite.onload = () => {
            this.sprite.isReady = true
            this.sprite.frameWidth = Math.floor(this.sprite.width / this.sprite.horizontalFrames)
            this.sprite.frameHeight = Math.floor(this.sprite.height / this.sprite.verticalFrames)
            this.width = 150
            this.height = 150
        }
        this.sprite.drawCount = 0
    }

    isReady() {
        return this.sprite.isReady
    }

    draw() {
       
        if (this.isReady()) {
            this.ctx.drawImage(
                this.sprite,
                this.sprite.horizontalFrameIndex * this.sprite.frameWidth,
                this.sprite.verticalFrameIndex * this.sprite.frameHeight,
                this.sprite.frameWidth,
                this.sprite.frameHeight,
                this.x,
                this.y,
                this.width,
                this.height
            )
                        
            this.sprite.drawCount++
            this.animate()
        }
    }

    animate() {
        
        if (this.sprite.drawCount % MOVEMENT_FRAMES_EX === 0) {
            this.sprite.horizontalFrameIndex +=1
    
            if (this.sprite.drawCount % 5 === 0){
                this.sprite.horizontalFrameIndex = 0
                this.sprite.verticalFrameIndex = 1
            }

            this.sprite.drawCount = 0
        }

        this.sprite.drawCount +=1
    }
}