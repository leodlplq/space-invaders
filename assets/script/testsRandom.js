import {pileOuFace, bernouilli, rademacher, de, sumRand, loiExponentielle} from "./tools/random.js"

// document.querySelector("#piece").addEventListener('click', ()=>{
//       console.log(pileOuFace() ? "pile": "face");
// })

// document.querySelector("#de").addEventListener('click', ()=>{
//       console.log(de(6));
// })

// document.querySelector("#other").addEventListener('click', ()=>{
//       console.log(otherRand());
// })

/* --------------- */
/* --- RANDOMS --- */
/* --------------- */
for(let i=0; i<10; i++)console.log(loiExponentielle(1))
for(let i=0; i<10; i++)console.log(pileOuFace(0.5))
for(let i=0; i<10; i++)console.log(rademacher(0.5))