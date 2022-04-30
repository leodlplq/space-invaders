//c'est une loi de Bernouilli avec p = 0.5
function pileOuFace(){
      return Math.random() < 0.5
}

// Loi de Bernouilli, de paramètre p appartenant à [0,1] (si le rand est entre 0 et p on renvoit pile, si entre p et 1 on renvoit face)
function loiBernouilli(p){
      if(p>=0 && p<=1){
            return Math.random() < p
      }
      else {
            throw new Error('Loi de Bernouilli : le paramètre p doit être entre 0 et 1')
      }
}

//Loi de Rademacher
function loiRademacher(p){
      return (2*loiBernouilli(p))-1
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

//loi binomiale de paramètres n un entier naturel 0 non compris et p compris entre [0,1]
//renvoit le nombre de fois où la probabilité p se réalise, sur n tirages
function loiBinomiale(n,p){
      let cardinal = 0
      for(let i=0; i<n; i++){
            if(loiBernouilli(p)==true) cardinal++
      }
      return cardinal
}

//loi géométrique de paramètre p compris entre [0,1]
function loiGeometrique(p){
      if(p<=0 || p>1) throw new Error('Loi géométrique : le paramètre p doit être entre 0 (non inclus) et 1')

      let k = 1
      let hasWon = false
      while(hasWon==false){
            if(loiBernouilli(p)==true) {
                  hasWon=true
            }
            else{
                  k++
            }
      }

      return k
}

//loi de Poisson de paramètre lambda>0, pour les évènements rares. n le nombre d'événements (nombre de vols d'avions dans l'année), p la probabilité de l'événement entre 0 et 1 (probabilité de s'écraser)
//renvoit la probabilité que la probabilités se produise k fois (le nombre k d'accidents d'avion)
function loiPoisson(n, p, k){
      let lambda = n*p
      if(lambda<=0) throw new Error('Loi de Poisson : le paramètre lambda doit strictement supérieur à 0')

      const factorial = n => n ?  (n * factorial(n-1)) : 1

      return Math.exp(-lambda)*(Math.pow(lambda, k)/factorial(k))
}

//loi uniforme sur [0,1], renvoit 1 si la variable aléatoire est entre 0 et 1, sinon renvoit 0
function loiUniforme01(min, max){
      let random = Math.floor(Math.random() * (max - min + 1)) + min
      return (random >=0 && random <=1) ? 1 : 0
}

//loi uniforme sur [a,b], b>a, renvoit 1/(b-a) si la variable aléatoire est entre a et b, sinon renvoit 0
function loiUniformeAB(a,b, min, max){
      if(b<=a) {
            throw new Error('loi uniforme sur [a,b] : b doit être strictement supérieur à a')
      }
      else {
            let random = Math.floor(Math.random() * (max - min + 1)) + min
            return (random >=a && random <=b) ? 1/(b-a) : 0
      }
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


export {pileOuFace, loiBernouilli, loiRademacher, de, sumRand, loiBinomiale, loiGeometrique, loiPoisson, loiUniforme01, loiUniformeAB, loiExponentielle}