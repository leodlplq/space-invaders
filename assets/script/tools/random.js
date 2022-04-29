//c'est une loi de Bernouilli avec p = 0.5
function pileOuFace(){
      return Math.random() < 0.5
}

// Loi de Bernouilli, de paramètre p appartenant à ]0,1[ (si le rand est entre 0 et p on renvoit pile, si entre p et 1 on renvoit face)
function bernouilli(p){
      if(p>0 && p<1){
            return Math.random() < p
      }
      else {
            throw new Error(' pile ou face : le paramètre p doit être 0 et 1')
      }
}

//Loi de Rademacher
function rademacher(p){
      return (2*bernouilli(p))-1
}

//dé équilibré
function de(nbFace){
      return Math.ceil(Math.random()*nbFace)
}

//fonction qui prend n un nombre >=2 fixé et p1,...,pn nombres positifs strictement tels que p1+p2+...+pn=1
//prend un tableau de nombres en paramètre, par exemple tab=[2,4,6,8,4,2,3,6,5,1,5,4,3]
function sumRand(tab){

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

//loi exponentielle sans vieillissement, de paramètre têta supérieur à 0
function loiExponentielle(teta){
      if(teta>0){
            return (-1/teta) * Math.log(Math.random())
      }
      else {
            throw new Error('loi exponentielle sans vieillissement : le paramètre têta doit être strictement supérieur à 0')
      }
}



export {pileOuFace, bernouilli, rademacher, de, sumRand, loiExponentielle}