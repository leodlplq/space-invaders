import { debounce } from "./tools/debounce.js";
import Player from "./Player.js"

export default class Game{
    constructor(color){
        this.color = color;
        this.canvas = document.querySelector('canvas')
        this.ctx = this.canvas.getContext('2d')

        this.width = window.innerWidth
        this.height = window.innerHeight

        this.player = new Player(this.ctx)

        this.initEvent()
        this.draw()
    }

    initEvent(){
        
        window.addEventListener('resize', ()=>this.handleResizeWindow());
    }

    draw(){
        console.log("dessine")
        // var gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
        // gradient.addColorStop(0, 'green');
        // gradient.addColorStop(1, 'red');
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(0, 0,this.width, this.height)

        this.player.draw()
    }

    handleResizeWindow(){
        this.width = window.innerWidth
        this.height = window.innerHeight
        
        this.canvas.width = this.width
        this.canvas.height = this.height

        // console.log("resize ", this.width, this.height, this.canvas.width, this.canvas.height)

        this.draw()
    }
   
}