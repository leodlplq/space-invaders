export default class Player {
    constructor(ctx, canvas) {
        this.ctx = ctx
        
        this.velocity = {
            x: 0,
            y: 0,
        }

        this.rotation = 0
        this.opacity = 1
        this.ammunition = 100;

        const image = new Image()
        image.src = './assets/images/spaceship.png'
        image.onload = () => {
            const scale = 0.15
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 50,
            }
        }

        this.rapidFire = false
        this.nbRapidShot = 0;

        this.shield = false
    }

    draw() {
        if(this.shield){
            this.ctx.fillStyle = 'red'
            this.ctx.fillRect(this.position.x, this.position.y, this.width, this.height + 10)
        }
        this.ctx.save()
        this.ctx.globalAlpha = this.opacity
        this.ctx.translate(
            this.position.x + this.width / 2,
            this.position.y + this.height / 2
        )
        this.ctx.rotate(this.rotation)
        this.ctx.translate(
            -this.position.x - this.width / 2,
            -this.position.y - this.height / 2
        )

        this.ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )

        this.ctx.restore()
    }

    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
        }
    }

    addAmunition(nb){
        this.ammunition += nb
    }

    rapidFireFunction(){
        if(this.rapidFire){
            console.log(this.nbRapidShot)
            if(this.nbRapidShot > 500){
                this.rapidFire = false
                this.nbRapidShot = 0
            }
        }
        
    }
}
