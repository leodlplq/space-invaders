import { loiUniformeAB } from "./tools/random.js"

export default class Boost{
    constructor(ctx, canvas,player, imageSrc, effect) {
        this.ctx = ctx
        this.position = {
            x: canvas.width / 2,
            y: Math.random() * 200 + 400,
        }

        this.velocity = {
            x: Math.random() - 0.5,
            y: Math.random() - 0.5,
        }

        this.rotation = 0
        this.opacity = 1

        const image = new Image()
        image.src = imageSrc ? imageSrc : './assets/images/bullet_icons.jpg'
        image.onload = () => {
            const scale = 0.1
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            
        }
        this.player = player
        this.lifetime = 0;
        this.effect = effect;
    }

    draw() {
        // this.ctx.fillStyle = 'red'
        // this.ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        // this.ctx.save()
        // this.ctx.globalAlpha = this.opacity
        // this.ctx.translate(
        //     this.position.x + this.width / 2,
        //     this.position.y + this.height / 2
        // )

        this.ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )

        // this.ctx.restore()
    }

    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
            this.lifetime++
        }
    }
}

