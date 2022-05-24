import { InvaderProjectile } from './Projectile.js'
import { loiBinomiale, loiRademacher } from './tools/random.js'

class Boss {
    constructor(ctx, canvas) {
        this.ctx = ctx
        const image = new Image()
        image.src = './assets/images/invader-boss.png'
        image.onload = () => {
            const scale = 0.6
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: canvas.width*0.5 - this.width*0.5,
                y: canvas.width*0.06,
            }
        }

        this.pv = loiBinomiale(100,50/100)
        console.log('PV : ',this.pv)
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

    update() {
        if (this.image) {
            this.draw()
        }
    }
    shoot(invaderProjectiles, player) {
        let diffHauteur = (player.position.y+player.height/2) - (this.position.y+this.height)
        let ecartLargeur = (player.position.x+player.width/2) - (this.position.x+this.width/2)
        let projectileSpeedY = 5
        let projectileSpeedX = ecartLargeur/(diffHauteur/projectileSpeedY)

        invaderProjectiles.push(
            new InvaderProjectile(
                {
                    position: {
                        x: this.position.x + this.width / 2,
                        y: this.position.y + this.height,
                    },
                    velocity: {
                        // x: loiRademacher(0.5),
                        x: projectileSpeedX+loiRademacher(0.5)*0.2,
                        y: projectileSpeedY,
                    },
                },
                this.ctx
            )
        )
        
    }
}

export { Boss }
