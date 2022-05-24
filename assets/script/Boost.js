import { loiUniformeAB, loiBetaDecentree, loiExponentielle } from "./tools/random.js"

export default class Boost{
    constructor(ctx, canvas,player, imageSrc, effect) {
        this.ctx = ctx
        this.position = {
            x: loiBetaDecentree(2,2, canvas.width-300 , canvas.width/2),
            y: loiUniformeAB(400,600)
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
        let expRandom = loiExponentielle(0.5)*100 + 100
        this.death = expRandom > 600 ? 600 : expRandom
        console.log(this.death)

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

