function pileOuFace(){
      return Math.random() < 0.5
}

function de(nbFace){
      return Math.ceil(Math.random()*nbFace)
}

function otherRand(){

      let tab = [2,4,6,8,4,2,3,6,5,1,5,4,3];

      let total = tab.reduce((acc, cur)=>{
            return acc += cur
      }, 0)

      let tabDiv = tab.map(el=>el/total);


      const w = Math.random()

      let totalP = 0;
      let indexP = 0;

      while(w > totalP){
            totalP += tabDiv[indexP]
            indexP++
      }
      return indexP;
}



export {pileOuFace, de, otherRand}