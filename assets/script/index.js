import { Invader, Grid } from './Invader.js'
import Particle from './Particle.js'
import Player from './Player.js'
import { Projectile, InvaderProjectile } from './Projectile.js'
import Boost from './Boost.js'
import { boostEffect } from './options/boostEffects.js'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const _score = document.querySelector('#score')
const _ammunition = document.querySelector("#ammunition")

canvas.width = innerWidth
canvas.height = innerHeight

let game = {
    over: false,
    active: true,
}


const player = new Player(c, canvas)
const projectiles = []
const grids = []
const invaderProjectiles = []
const particles = []
const boosts= []
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
let randomInterval = Math.floor(Math.random() * 500) + 1000
let randomIntervalBullet = Math.floor(Math.random() * 500) + 200
let score = 0

//SPACE BACKGROUND CREATE WITH PARTICLES
const createStarsBackground = () => {
    for (let i = 0; i < 100; i++) {
        particles.push(
            new Particle(
                {
                    position: {
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                    },
                    velocity: {
                        x: 0,
                        y: Math.random() * 0.5,
                    },
                    radius: Math.random() * 2,
                    color: 'white',
                },
                c
            )
        )
    }
}




const animate = () => {
    if (!game.active) return
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    console.log(invaderProjectiles)

    _ammunition.innerHTML = player.ammunition
    particles.forEach((particle, index) => {
        //PUT STAR BACKGROUND PARTICLES BACK TO TOP WHEN OUT OF SCREEN
        if (particle.position.y - particle.radius >= canvas.height) {
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius
        }

        //DESTROY PARTICLE IF INVISIBLE
        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(index, 1)
            }, 0)
        } else {
            particle.update()
        }
    })

    invaderProjectiles.forEach((invaderProjectile, index) => {
        if (
            invaderProjectile.position.y + invaderProjectile.height >=
            canvas.height
        ) {
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
            }, 0)
        } else {
            invaderProjectile.update()
        }

        //projectile hits player
        if (
            invaderProjectile.position.y + invaderProjectile.height >=
                player.position.y &&
            invaderProjectile.position.x + invaderProjectile.width >=
                player.position.x &&
            invaderProjectile.position.x <= player.width + player.position.x
        ) {
            console.log('hit')

            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
            }, 0)
            
            if(!player.shield){
                
                // setTimeout(() => {
                //     invaderProjectiles.splice(index, 1)
                //     player.opacity = 0
                //     game.over = true
                // }, 0)

                // setTimeout(() => {
                //     game.active = false
                // }, 2000)
                
                createParticles({
                    object: player,
                    color: 'white',
                    fades: true,
                })

                
            } else{
                player.shield = false
            }
            
        }
    })

    //DISPLAY PROJECTILE OR DELETE THEM IF OUT OF VIEW
    projectiles.forEach((p, index) => {
        if (p.position.y + p.radius <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        } else {
            p.update()
        }
    })

    //DISPLAYING ENNEMIES
    grids.forEach((grid, gridIndex) => {
        grid.update()
        if (frame % 100 === 0 && grid.invaders.length > 0) {
            // grid.invaders[
            //     Math.floor(Math.random() * grid.invaders.length)
            // ].shoot(invaderProjectiles)
        }
        grid.invaders.forEach((invader, i) => {
            invader.update({ velocity: grid.velocity })

            //projectile hit ennemies
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
                            score += 100
                            _score.innerHTML = score
                            createParticles({
                                object: invader,
                                fades: true,
                            })
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

    //DISPLAY BOOST
    boosts.forEach((boost,boostIndex)=>{
        boost.update()
        projectiles.forEach((projectile, j) => {
            if (
                projectile.position.y - projectile.radius <=
                    boost.position.y + boost.height &&
                projectile.position.x + projectile.radius >=
                    boost.position.x &&
                projectile.position.x - projectile.radius <=
                    boost.position.x + boost.width &&
                projectile.position.y + projectile.radius >=
                    boost.position.y
            ) {
                setTimeout(() => {
                    const boostFound = boosts.find(
                        (boost2) => boost2 === boost
                    )
                    const projectileFound = projectiles.find(
                        (projectile2) => projectile2 === projectile
                    )

                    //remove invader and projectile
                    if (boostFound && projectileFound) {
                        projectiles.splice(j, 1)
                        boost.effect()
                        boosts.splice(boostIndex, 1)
                    }
                }, 0)
            }
        })

        if(boost.lifetime > 300){
            boosts.splice(boostIndex, 1)
        }
    })
    


    //RAPID FIRE
    if(player.rapidFire){
        shoot()
        player.nbRapidShot++
        player.rapidFireFunction()
    }

    //PLAYER'S MOVEMENT
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
        randomInterval = Math.floor(Math.random() * 500) + 1000
    }

    //giving bullets
    if(frame % randomIntervalBullet === 0){
        player.ammunition += Math.floor(Math.random() * 20) + 10 
        randomIntervalBullet = Math.floor(Math.random() * 500) + 200
    }

    //spawning boost
    if(frame % 500 === 0 && frame != 0){
        createRandomEffect()
    }

    //spawn projectiles
    frame++
}

createStarsBackground()
animate()


//EVENT LISTENER FOR KEYDOWN (PLAYER MOVEMENTS + SHOOTING)
addEventListener('keydown', ({ key }) => {
    if (!game.over) {
        switch (key) {
            case 'q':
                keys.q.pressed = true
                break
            case 'd':
                keys.d.pressed = true
                break
            case ' ':
                if(player.ammunition > 0){
                    shoot()

                    player.ammunition--
                }
                
                break

            default:
                break
        }
    }
})

//KEY IS NOT PRESSED ANYMORE
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
        case "b":
            createRandomEffect();
            break;

        default:
            break
    }
})

//PARTICLES WHEN KILLING ENNEMIES OR PLAYER DYING
const createParticles = ({ object, color, fades }) => {
    for (let i = 0; i < 15; i++) {
        particles.push(
            new Particle(
                {
                    position: {
                        x: object.position.x + object.width / 2,
                        y: object.position.y + object.height / 2,
                    },
                    velocity: {
                        x: (Math.random() - 0.5) * 2,
                        y: (Math.random() - 0.5) * 2,
                    },
                    radius: Math.random() * 3,
                    color: color || '#BAA0DE',
                    fades: fades,
                },
                c
            )
        )
    }
}

const createRandomEffect = () => {
    let random = Math.floor(Math.random() * boostEffect.length)
    boosts.push(new Boost(c, canvas,player, boostEffect[random].src, boostEffect[random].effect ))
}

const shoot = ()=>{
    projectiles.push(
        new Projectile(
            {
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y,
                },
                velocity: {
                    x: 0,
                    y: -7,
                },
            },
            c
        )
    )
}


