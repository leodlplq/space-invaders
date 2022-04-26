class Projectile {
    constructor({ position, velocity }, ctx) {
        this.position = position
        this.velocity = velocity

        this.ctx = ctx

        this.radius = 3
    }

    draw() {
        this.ctx.beginPath()
        this.ctx.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,
            Math.PI * 2
        )
        this.ctx.fillStyle = 'red'
        this.ctx.fill()
        this.ctx.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.opacity -= 0.1
    }
}

class InvaderProjectile {
    constructor({ position, velocity }, ctx) {
        this.position = position
        this.velocity = velocity

        this.ctx = ctx

        this.width = 3
        this.height = 10
    }

    draw() {
        this.ctx.fillStyle = 'white'
        this.ctx.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

export { Projectile, InvaderProjectile }
