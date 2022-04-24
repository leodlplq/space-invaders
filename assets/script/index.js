import { Invader, Grid } from './Invader.js'
import Player from './Player.js'
import { Projectile, InvaderProjectile } from './Projectile.js'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const player = new Player(c, canvas)
const projectiles = []
const grids = []
const invaderProjectiles = []
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

let frame = 0
let randomInterval = Math.floor(Math.random() * 500) + 500

const animate = () => {
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()

    invaderProjectiles.forEach((invaderProjectile) => {
        invaderProjectile.update()
    })

    projectiles.forEach((p, index) => {
        if (p.position.y + p.radius <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        } else {
            p.update()
        }
    })

    grids.forEach((grid, gridIndex) => {
        grid.update()
        grid.invaders.forEach((invader, i) => {
            invader.update({ velocity: grid.velocity })

            projectiles.forEach((projectile, j) => {
                if (
                    projectile.position.y - projectile.radius <=
                        invader.position.y + invader.height &&
                    projectile.position.x + projectile.radius >=
                        invader.position.x &&
                    projectile.position.x - projectile.radius <=
                        invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >=
                        invader.position.y
                ) {
                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(
                            (invader2) => invader2 === invader
                        )
                        const projectileFound = projectiles.find(
                            (projectile2) => projectile2 === projectile
                        )

                        //remove invader and projectile
                        if (invaderFound && projectileFound) {
                            grid.invaders.splice(i, 1)
                            projectiles.splice(j, 1)

                            if (grid.invaders.length > 0) {
                                const firstInvader = grid.invaders[0]
                                const lastInvader =
                                    grid.invaders[grid.invaders.length - 1]
                                grid.width =
                                    lastInvader.position.x -
                                    firstInvader.position.x +
                                    lastInvader.width

                                grid.position.x = firstInvader.position.x
                            } else {
                                grids.splice(gridIndex, 1)
                            }
                        }
                    }, 0)
                }
            })
        })
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

    //spawing ennemies
    if (frame % randomInterval === 0) {
        grids.push(new Grid(c, canvas))
        randomInterval = Math.floor(Math.random() * 500) + 500
    }

    //spawn projectiles

    frame++
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
