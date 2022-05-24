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
function dice(nbFace){
      return Math.ceil(Math.random()*nbFace)
}

function diceBetween(min, max) {
      return dice(max-min)+min
}

//fonction qui prend n un nombre >=2 fixé et p1,...,pn nombres positifs strictement tels que p1+p2+...+pn=1
//prend un tableau de nombres en paramètre, par exemple tab=[2,4,6,8,4,2,3,6,5,1,5,4,3]
//renvoit l'index choisi
function sumRand(tab){

      let total = tab.reduce((acc, cur)=>{
            return acc += cur
      }, 0)

      let tabDiv = tab.map(el=>el/total);


      const w = loiUniforme01()

      let totalP = 0;
      let indexP = 0;

      while(w > totalP){
            totalP += tabDiv[indexP]
            indexP++
      }
      return indexP-1;
}

//loi binomiale de paramètres n un entier naturel, 0 non compris et p compris entre [0,1]
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
//renvoit la probabilité que la probabilité se produise k fois (le nombre k d'accidents d'avion)
function loiPoisson(n, p, k){
      let lambda = n*p
      if(lambda<=0) throw new Error('Loi de Poisson : le paramètre lambda doit strictement supérieur à 0')

      const factorial = n => n ?  (n * factorial(n-1)) : 1

      return Math.exp(-lambda)*(Math.pow(lambda, k)/factorial(k))
}

//loi uniforme sur [0,1], renvoit un nombre aléatoire entre 0 et 1
function loiUniforme01(){
      return Math.random()
}

//loi uniforme sur [a,b], b>a
function loiUniformeAB(a,b){
      if(b<=a) {
            throw new Error('loi uniforme sur [a,b] : b doit être strictement supérieur à a')
      }
      else {
            return Math.random() * (b-a) + a
      }
}

//Gaussienne centrée sur 0
function loiGaussienne() {
      let teta = 2 * Math.PI * loiUniforme01()
      let R = Math.sqrt(-2*Math.log(loiUniforme01()))

      return R*Math.cos(teta)
}

// loi gaussienne étendu sur a, de moyenne b, et qui met le min ou max si le chiffre est en dehors de [min,max]
function loiGaussienneDecentree(a,b, min, max) {
      let random = a * loiGaussienne() + b

      if(random < min ) {
            random = min
      }
      if(random > max ) {
            random = max
      }

      return random
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

//loi Bêta centrée sur [0,1]
function loiBeta(n,m) {
      let Z1 = 0;
      let Z2 = 0;
      for(let i=0; i<n; i++) Z1+=loiExponentielle(1)
      for(let i=0; i<m; i++) Z2+=loiExponentielle(1)

      return Z1/(Z1+Z2)
}

//loi beta de parametre n et m, centrée sur b, étndu sur a
function loiBetaDecentree(n,m,a,b) {
      return a * loiBeta(n,m) + (b - a/2)
}

/* ********************************************** */
/* ********************************************** */

export {pileOuFace, loiBernouilli, loiRademacher, dice, diceBetween, sumRand, loiBinomiale, loiGeometrique, loiPoisson, loiUniforme01, loiUniformeAB, loiGaussienne, loiGaussienneDecentree, loiExponentielle, loiBeta, loiBetaDecentree}