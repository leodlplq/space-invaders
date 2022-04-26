export default class Particle {
    constructor({ position, velocity, radius, color, fades }, ctx) {
        this.position = position
        this.velocity = velocity

        this.ctx = ctx

        this.radius = radius
        this.color = color

        this.opacity = 1
        this.fades = fades
    }

    draw() {
        this.ctx.save()
        this.ctx.globalAlpha = this.opacity
        this.ctx.beginPath()
        this.ctx.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,
            Math.PI * 2
        )
        this.ctx.fillStyle = this.color
        this.ctx.fill()
        this.ctx.closePath()

        this.ctx.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.fades) {
            this.opacity -= 0.01
        }
    }
}
