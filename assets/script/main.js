
import Game from "./Game.js"
import {pileOuFace, de, nonUniformRandom} from "./tools/random.js"

//new Game("green");

document.querySelector("#piece").addEventListener('click', ()=>{
      console.log(pileOuFace() ? "pile": "face");
})

document.querySelector("#de").addEventListener('click', ()=>{
      console.log(de(6));
})

document.querySelector("#other").addEventListener('click', ()=>{
      let tab = [1,100,1]
      let obj = {}
      for(let i = 0; i < 100000; i++){
            let index = nonUniformRandom(tab);
            obj[index] == undefined ? obj[index] = 0 : obj[index] = obj[index]+1
      }
      console.log(tab)
      console.log(obj)
      // console.log(nonUniformRandom(tab));
})






