import {pileOuFace, loiBernouilli, loiRademacher, dice, diceBetween, sumRand, loiBinomiale, loiGeometrique, loiPoisson, loiUniforme01, loiUniformeAB, loiGaussienne, loiGaussienneDecentree, loiExponentielle, loiBeta, loiBetaDecentree} from "./tools/random.js"

/* --------------- */
/* --- RANDOMS --- */
/* --------------- */
// for(let i=0; i<100; i++)console.log(sumRand([1,2,4]))
// for(let i=0; i<10; i++)console.log(loiExponentielle(0.2))
// for(let i=0; i<10; i++)console.log(pileOuFace(0.5))
// for(let i=0; i<10; i++)console.log(loiBernouilli(0.1))
// for(let i=0; i<10; i++)console.log(loiRademacher(0.5))
// for(let i=0; i<10; i++)console.log(loiUniformeAB(0,2))
// console.log(loiBinomiale(100,0.1))
// console.log(loiGeometrique(0.1))

//n nombre de joueurs au loto, p la probabilité de gagner, k la probabilité qu'il y ait k gagnant au loto
// console.log(loiPoisson(7*Math.pow(10,6),1/(5*Math.pow(10,6)),1))

// for(let i=0; i<100; i++) console.log(loiBeta(5,1))

// let mean=0
// for(let i=0; i<100; i++) {
//     console.log(loiGaussienneDecentree(2,5,0,10))
//     mean += loiGaussienneDecentree(2,5,0,10)
// }
// console.log(mean/100)

// let mean=0
// for(let i=0; i<100; i++) {
//     // console.log(loiBetaDecentree(2,2,2,5))
//     mean += loiBetaDecentree(2,2,3,5)
// }
// console.log(mean/100)