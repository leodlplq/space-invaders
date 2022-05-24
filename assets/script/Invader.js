import { InvaderProjectile } from './Projectile.js'
import { diceBetween, loiUniformeAB } from './tools/random.js'

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
            const scale = 0.45
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
    constructor(ctx, canvas, {
        minRow, maxRow, minCol, maxCol
        }) {
        this.canvas = canvas
        
        //Random grid size
        const rows = diceBetween(minRow,maxRow)
        const cols = diceBetween(minCol,maxCol)

        this.numberEnnemy = rows * cols

        this.width = cols * 30

        //Random grid starting position
        this.position = {
            x: loiUniformeAB(0, (this.canvas.width - this.width)),
            y: 0,
        }
        // console.log(this.position.x)

        this.velocity = {
            x: 3,
            y: 0,
        }

        this.invaders = []
        
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(
                    new Invader(ctx, canvas, {
                        position: {
                            x: this.position.x + (x * 30),
                            y: this.position.y + (y * 30),
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
