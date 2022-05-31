import { Invader, Grid } from './Invader.js'
import { Boss } from './Boss.js'
import Particle from './Particle.js'
import Player from './Player.js'
import { Projectile, InvaderProjectile } from './Projectile.js'
import Boost from './Boost.js'
import { boostEffect } from './options/boostEffects.js'
import {loiGaussienneDecentree, sumRand, loiBetaDecentree, loiBinomiale} from './tools/random.js'


/* ***************************************************************************** */
/* *********************************** STATS *********************************** */
/* ***************************************************************************** */

const _statsContainer = document.querySelector('#stats')

let dataStats = {
    boost : {
        ammunition : 0,
        rapidfire : 0,
        shield : 0,
    },
    bossPV : [],
    bossApparition : [],
    nbEnnemyGrid: [],
}

function moyenne(tab) {
    let moyenne = 0
    for(let i=0; i<tab.length; i++) {
        moyenne+=tab[i]
    }

    return moyenne/tab.length
}

function ecartMoyen(tab) {
    let moyenne = 0
    for(let i=0; i<tab.length; i++) {
        moyenne+=tab[i]
    }
    moyenne = moyenne/tab.length

    let sum = 0
    for(let i=0; i<tab.length; i++) {
        sum += Math.abs(tab[i]-moyenne)
    }
    return sum/tab.length
}

function ecartType(tab) {
    let moyenne = 0
    for(let i=0; i<tab.length; i++) {
        moyenne+=tab[i]
    }
    moyenne = moyenne/tab.length

    let sum = 0
    for(let i=0; i<tab.length; i++) {
        sum += Math.pow(Math.abs(tab[i]-moyenne),2)
    }
    return Math.sqrt(sum/tab.length)
}

function showStats() {
    //ennemy grid
    let div = _statsContainer.querySelector(`#statsDetails > div:nth-child(2)`)
    div.querySelector(' #moyenne').innerHTML = moyenne(dataStats.nbEnnemyGrid)
    div.querySelector(' #ecartMoyen').innerHTML = ecartMoyen(dataStats.nbEnnemyGrid)
    div.querySelector(' #ecartType').innerHTML = ecartType(dataStats.nbEnnemyGrid)

    //boss
    if (dataStats.bossPV.length != 0) {
        div = _statsContainer.querySelector(`#statsDetails > div:nth-child(3) .partie-theorie-ctn div:nth-child(1)`)
        div.querySelector(' #moyenne').innerHTML = moyenne(dataStats.bossPV)
        div.querySelector(' #ecartMoyen').innerHTML = ecartMoyen(dataStats.bossPV)
        div.querySelector(' #ecartType').innerHTML = ecartType(dataStats.bossPV)

        div = _statsContainer.querySelector(`#statsDetails > div:nth-child(4) .partie-theorie-ctn div:nth-child(1)`)
        div.querySelector(' #moyenne').innerHTML = moyenne(dataStats.bossApparition)
        div.querySelector(' #ecartMoyen').innerHTML = ecartMoyen(dataStats.bossApparition)
        div.querySelector(' #ecartType').innerHTML = ecartType(dataStats.bossApparition)
    }
    div = _statsContainer.querySelector(`#statsDetails > div:nth-child(3) .partie-theorie-ctn div:nth-child(2)`)
    div.querySelector(' #moyenne').innerHTML = paramsBinomiale.n * paramsBinomiale.p
    div.querySelector(' #ecartType').innerHTML = Math.sqrt(paramsBinomiale.n * paramsBinomiale.p * (1-paramsBinomiale.p))

    div = _statsContainer.querySelector(`#statsDetails > div:nth-child(4) .partie-theorie-ctn div:nth-child(2)`)
    div.querySelector(' #moyenne').innerHTML = centreApparitionTimeBoss
    div.querySelector(' #ecartType').innerHTML = etendueApparitionTimeBoss

    //types de boost
    div = _statsContainer.querySelector(`#statsDetails > div:nth-child(1) .partie-theorie-ctn div:nth-child(1)`)
    div.querySelector(' #munitions').innerHTML = dataStats.boost.ammunition
    div.querySelector(' #tirConstant').innerHTML = dataStats.boost.rapidfire
    div.querySelector(' #bouclier').innerHTML = dataStats.boost.shield

    div = _statsContainer.querySelector(`#statsDetails > div:nth-child(1) .partie-theorie-ctn div:nth-child(2)`)
    div.querySelector(' #munitions').innerHTML = paramsBoost[0]
    div.querySelector(' #tirConstant').innerHTML = paramsBoost[1]
    div.querySelector(' #bouclier').innerHTML = paramsBoost[2]
}

/* ***************************************************************************** */
/* ***************************************************************************** */
/* ***************************************************************************** */


const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const _score = document.querySelector('#score')
const _ammunition = document.querySelector("#ammunition")

canvas.width = innerWidth
canvas.height = innerHeight

let game = {
    over: false,
    active: false,
}

/** PARAMS */

let paramsNbEnemy = {
    minRow:2,
    maxRow:7,
    minCol:5,
    maxCol:15
}

let paramsMomentBoost = {
    alpha: 5,
    beta: 2, 
    etendu: 300,
    centre: 450
}

let paramsBoost = [20,1,3]

let paramsExpo = {
    lambda:0.5,
    min:100
}

let paramsBinomiale = {
    n: 400,
    p:0.5
}

/** END PARAMS */


const player = new Player(c, canvas)
const projectiles = []
const grids = []
const invaderProjectiles = []
let boss
const bossProjectiles = []
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
let randomIntervalBoost
getRandomIntervalBoost()
let frameBoost = 0
let score = 0

let frameWave = 0
let centreApparitionTimeBoss = 2000
let etendueApparitionTimeBoss = 300
let timeApparitionBoss = createTimeBoss()
// console.log('TIME BOSS : ', timeApparitionBoss)
let bossPhase = false
let bossActive = false
let backgroundColor = 'black'

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

function calculate(){
    return projectiles.length + grids.length+ invaderProjectiles.length+ bossProjectiles.length + particles.length + boosts.length
}

let reqAnim;

function stopAnimation() {
    window.cancelAnimationFrame(reqAnim);
}

const animate = () => {
    if(game.over) {
        canvas.style.display = 'none';
        _statsContainer.style.display = 'flex';

        showStats()
        console.log(dataStats)
        
        stopAnimation()
        return
    }

    console.log(calculate())
    if (!game.active) return
    reqAnim = window.requestAnimationFrame(animate)
    c.fillStyle = backgroundColor
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    // console.log(invaderProjectiles)

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

            // console.log('hit')

            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
            }, 0)
            
            if(!player.shield){
                
                setTimeout(() => {
                    invaderProjectiles.splice(index, 1)
                    player.opacity = 0
                    game.over = true
                }, 0)

                setTimeout(() => {
                    game.active = false
                }, 2000)
                
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

    //Boss Projectiles
    bossProjectiles.forEach((bossProjectile, index) => {
        if (
            bossProjectile.position.y + bossProjectile.height >=
            canvas.height
        ) {
            setTimeout(() => {
                bossProjectiles.splice(index, 1)
            }, 0)
        } else {
            bossProjectile.update()
        }

        //projectile hits player
        if (
            bossProjectile.position.y + bossProjectile.height >=
                player.position.y &&
            bossProjectile.position.x + bossProjectile.width >=
                player.position.x &&
            bossProjectile.position.x <= player.width + player.position.x
        ) {
            createParticles({
                object: player,
                color: 'white',
                fades: true,
            })
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
            grid.invaders[
                Math.floor(Math.random() * grid.invaders.length)
            ].shoot(invaderProjectiles)
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
       if(boost.lifetime > boost.death){
            boosts.splice(boostIndex, 1)
        }
    })
  
   //RAPID FIRE
    if(player.rapidFire){
        shoot()
        player.nbRapidShot++
        player.rapidFireFunction()
    }

    //DISPLAY BOSS
    if(boss){
        boss.update()
        if(boss.pv>80){
            if (frame % 100 === 0) {
                boss.shoot(invaderProjectiles, player)
            }
        }
        else{
            if (frame % 40 === 0) {
                boss.shoot(invaderProjectiles, player)
            }
            if(frame % 10 === 0) {
                backgroundColor = backgroundColor == 'black' ? 'rgb(82, 24, 17)' : 'black'
            }
            if(boss.image.src != window.location.origin+'/assets/images/invader-boss-angry.png') {
                boss.image.src  = './assets/images/invader-boss-angry.png'
                // console.log('change IMG', boss.image.src)
            }
        }
        
        //projectile hit boss
        // console.log(boss)
        projectiles.forEach((projectile, j) => {
            if (
                boss && 
                projectile.position.y - projectile.radius <=
                    boss.position.y + boss.height &&
                projectile.position.x + projectile.radius >=
                    boss.position.x &&
                projectile.position.x - projectile.radius <=
                    boss.position.x + boss.width &&
                projectile.position.y + projectile.radius >=
                    boss.position.y
            ) {
                setTimeout(() => {

                    const projectileFound = projectiles.find(
                        (projectile2) => projectile2 === projectile
                    )

                    //remove invader and projectile
                    if (projectileFound) {
                        score += 100
                        _score.innerHTML = score
                        createParticles({
                            object: boss,
                            fades: true,
                            color:'red'
                        })
                        projectiles.splice(j, 1)

                        //remove boss pv 
                        boss.pv -= 1
                        // console.log(boss.pv)
                        if(boss.pv <= 0){
                            score += 2000
                            InitNewWave()
                        }
                    }
                }, 0)
            }
        })
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
    if (frameWave % randomInterval === 0 && !bossPhase) {
        grids.push(new Grid(c, canvas, paramsNbEnemy))
        randomInterval = Math.floor(Math.random() * 500) + 1000

        dataStats.nbEnnemyGrid.push(grids[grids.length-1].numberEnnemy)
    }

    //giving bullets
    if(frame % randomIntervalBullet === 0){
        player.ammunition += Math.floor(Math.random() * 20) + 10 
        randomIntervalBullet = Math.floor(Math.random() * 500) + 200
    }

    //spawning boost
    if(frameBoost > randomIntervalBoost){
        createRandomEffect()
        getRandomIntervalBoost()
        frameBoost=0
    }

    //spawning Boss
    if (frameWave % timeApparitionBoss === 0 && frameWave!=0 && !bossPhase) {
        bossPhase = true;
        console.log('C\'EST CENSE ETRE LE BOSS')
        annonceBoss()
    }
    if(bossPhase && grids.length == 0 && bossActive == false) {

        boss = new Boss(c, canvas, paramsBinomiale)

        console.log('LE BOSSS', boss.pv)
        dataStats.bossPV.push(boss.pv)
        dataStats.bossApparition.push(timeApparitionBoss)

        bossActive = true
    }

    if(boss) console.log(boss.pv)


    frame++
    frameWave++
    frameBoost++
}

const launchGame = ()=>{
    console.log('PARAMS ENEMIES', paramsNbEnemy)
    createStarsBackground()
    animate()
}


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

    let random = sumRand(paramsBoost)
    boosts.push(new Boost(c, canvas,player, boostEffect[random].src, boostEffect[random].effect, paramsBoost ))


    dataStats.boost[boostEffect[random].name]++

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


/* ------ INTERMEDIATE FUNCTIONS ------ */

function createTimeBoss() {
    return Math.round(loiGaussienneDecentree(etendueApparitionTimeBoss,centreApparitionTimeBoss, 1500, 2500))
}

function getRandomIntervalBoost() {
    randomIntervalBoost = loiBetaDecentree(
                                    paramsMomentBoost.alpha,
                                    paramsMomentBoost.beta,
                                    paramsMomentBoost.etendu,
                                    paramsMomentBoost.centre
                                    )
}

function InitNewWave() {
    frameWave = 0
    boss = undefined
    bossPhase = false
    bossActive = false
    timeApparitionBoss = createTimeBoss()
    // console.log('TIME BOSS : ', timeApparitionBoss)
    backgroundColor = 'black'
}

function annonceBoss() {
    backgroundColor = 'rgb(82, 24, 17)'
    setTimeout(() => {backgroundColor = 'black'}, 1000);
}


const _game = document.querySelector('.game')

/* MENU PART */
const _menu = document.querySelector('.menu')
const _mainMenu = document.querySelector('.main-menu')
const _paramsMenu = document.querySelector('.params-menu')
const _launchGameBtn = document.querySelector('.launch')
const _paramsBtn = document.querySelector('.params')

const _gobackBtn = document.querySelector('.goback')

_launchGameBtn.addEventListener('click', (e)=>{
    e.preventDefault()
    _menu.style.display = "none"
    _game.style.display = 'block'
    game.active = true
    launchGame()
})

_paramsBtn.addEventListener('click', (e)=>{
    e.preventDefault()
    _mainMenu.style.display = 'none'
    _paramsMenu.style.display = 'flex'
})

_gobackBtn.addEventListener('click', (e)=>{
    e.preventDefault()
    _mainMenu.style.display = 'flex'
    _paramsMenu.style.display = 'none'
})

/** PARAMS PART */
/** PARAMS : NB ENNEMIS */
const _minRowRange = document.querySelector('#minRow')
const _minRowRangeValue = document.querySelector('#minRowValue')
const _maxRowRange = document.querySelector('#maxRow')
const _maxRowRangeValue = document.querySelector('#maxRowValue')
const _minColRange = document.querySelector('#minCol')
const _minColRangeValue = document.querySelector('#minColValue')
const _maxColRange = document.querySelector('#maxCol')
const _maxColRangeValue = document.querySelector('#maxColValue')

_minRowRange.addEventListener('input', (e)=>{
    _minRowRangeValue.innerHTML = e.target.value
    paramsNbEnemy.minRow = parseInt(e.target.value)
})
_maxRowRange.addEventListener('input', (e)=>{
    _maxRowRangeValue.innerHTML = e.target.value
    paramsNbEnemy.maxRow = parseInt(e.target.value)
})
_minColRange.addEventListener('input', (e)=>{
    _minColRangeValue.innerHTML = e.target.value
    paramsNbEnemy.minCol = parseInt(e.target.value)
})
_maxColRange.addEventListener('input', (e)=>{
    _maxColRangeValue.innerHTML = e.target.value
    paramsNbEnemy.maxCol = parseInt(e.target.value)
})

/** PARAMS : MOMENT APPARITION BOOST */
const _alpha = document.querySelector('#alpha')
const _alphaValue = document.querySelector('#alphaValue')
const _beta = document.querySelector('#beta')
const _betaValue = document.querySelector('#betaValue')
const _centre = document.querySelector('#centre')
const _centreValue = document.querySelector('#centreValue')
const _etendu = document.querySelector('#etendu')
const _etenduValue = document.querySelector('#etenduValue')

_alpha.addEventListener('input', (e)=>{
    _alphaValue.innerHTML = e.target.value
    paramsMomentBoost.alpha = parseInt(e.target.value)
})
_beta.addEventListener('input', (e)=>{
    _betaValue.innerHTML = e.target.value
    paramsMomentBoost.beta = parseInt(e.target.value)
})
_centre.addEventListener('input', (e)=>{
    _centreValue.innerHTML = e.target.value
    paramsMomentBoost.centre = parseInt(e.target.value)
})
_etendu.addEventListener('input', (e)=>{
    _etenduValue.innerHTML = e.target.value
    paramsMomentBoost.etendu = parseInt(e.target.value)
})

/**PARAMS TYPE BOOST */
const _inputBoost = document.querySelectorAll('input[name="boost"]')
_inputBoost.forEach(input=>{
    input.addEventListener('input', (e)=>{
        switch (e.target.value) {
            case "boost-facile":
                    paramsBoost = [1,1,1]
                break;

            case "boost-mid":
                    paramsBoost = [20,1,3]
                break;
            case "boost-hard":
                    paramsBoost = [50,1,1]
                break;
        
            default:
                break;
        }
    })
})

/** PARAMS DUREE BOOST */
const _lambda = document.querySelector('#lambda')
const _lambdaValue = document.querySelector('#lambdaValue')
const _expoMin = document.querySelector('#expoMin')
const _expoMinValue = document.querySelector('#expoMinValue')
_lambda.addEventListener('input', (e)=>{
    _lambdaValue.innerHTML = e.target.value
    paramsExpo.lambda = parseInt(e.target.value)
})
_expoMin.addEventListener('input', (e)=>{
    _expoMinValue.innerHTML = e.target.value
    paramsExpo.min = parseInt(e.target.min)
})

/**PARAMS NOMBRE PV BOSS */
const _binomialeN = document.querySelector('#binomialeN')
const _binomialeNValue = document.querySelector('#binomialeNValue')
const _binomProba = document.querySelector('#binomProba')
const _binomProbaValue = document.querySelector('#binomProbaValue')
_binomialeN.addEventListener('input', (e)=>{
    _binomialeNValue.innerHTML = e.target.value
    paramsBinomiale.n = parseInt(e.target.value)

})

_binomProba.addEventListener('input', (e)=>{
    _binomProbaValue.innerHTML = e.target.value
    paramsBinomiale.p = parseInt(e.target.value)
    
})