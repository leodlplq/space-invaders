import { InvaderProjectile } from './Projectile.js'

class Invader {
    constructor(ctx, canvas, { position }) {
        this.ctx = ctx

        this.velocity = {
            x: 0,
            y: 0,
        }

        const image = new Image()
        image.src = './assets/images/invader.png'
        image.onload = () => {
            const scale = 1
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: position.x,
                y: position.y,
            }
        }
    }

    draw() {
        // this.ctx.fillStyle = 'red'
        // this.ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        this.ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }

    update({ velocity }) {
        if (this.image) {
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }
    shoot(invaderProjectiles) {
        invaderProjectiles.push(
            new InvaderProjectile(
                {
                    position: {
                        x: this.position.x + this.width / 2,
                        y: this.position.y + this.height,
                    },
                    velocity: {
                        x: 0,
                        y: 5,
                    },
                },
                this.ctx
            )
        )
    }
}

class Grid {
    constructor(ctx, canvas) {
        this.canvas = canvas
        this.position = {
            x: 0,
            y: 0,
        }

        this.velocity = {
            x: 3,
            y: 0,
        }

        this.invaders = []

        const rows = Math.floor(Math.random() * 5 + 2) //TODO: a changer plus tard
        const cols = Math.floor(Math.random() * 10 + 5)

        this.width = cols * 30
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(
                    new Invader(ctx, canvas, {
                        position: {
                            x: x * 30,
                            y: y * 30,
                        },
                    })
                )
            }
        }
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0

        if (
            this.position.x + this.width >= this.canvas.width ||
            this.position.x <= 0
        ) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
        }
    }
}

export { Invader, Grid }
