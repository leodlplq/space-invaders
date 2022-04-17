import Player from './Player.js'
import Projectile from './Projectile.js'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const player = new Player(c, canvas)
const projectiles = []
const speed = 5
const keys = {
    q: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    space: {
        pressed: false,
    },
}

const animate = () => {
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()

    projectiles.forEach((p, index) => {
        if (p.position.y + p.radius <= 0) {
            projectiles.splice(index, 1)
        } else {
            p.update()
        }
    })

    if (keys.q.pressed && player.position.x >= 0) {
        player.velocity.x = -speed
        player.rotation = -0.15
    } else if (
        keys.d.pressed &&
        player.position.x + player.width <= canvas.width
    ) {
        player.velocity.x = speed
        player.rotation = 0.15
    } else {
        player.velocity.x = 0
        player.rotation = 0
    }
}

animate()

addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'q':
            keys.q.pressed = true
            break
        case 'd':
            keys.d.pressed = true
            break
        case ' ':
            projectiles.push(
                new Projectile(
                    {
                        position: {
                            x: player.position.x + player.width / 2,
                            y: player.position.y,
                        },
                        velocity: {
                            x: 0,
                            y: -5,
                        },
                    },
                    c
                )
            )
            break

        default:
            break
    }
})

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'q':
            keys.q.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
        case ' ':
            break

        default:
            break
    }
})
