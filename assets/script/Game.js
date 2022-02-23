import { debounce } from "./tools/debounce.js";

export default class Game{
    constructor(color){
        this.color = color;
        this.canvas = document.querySelector('canvas')
        this.ctx = this.canvas.getContext('2d')

        this.width = window.innerWidth
        this.height = window.innerHeight

        this.initEvent()
        this.draw()
    }

    initEvent(){
        
        window.addEventListener('resize', ()=>this.handleResizeWindow());
    }

    draw(){
        console.log("dessine")
        var gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
        gradient.addColorStop(0, 'green');
        gradient.addColorStop(1, 'red');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0,this.width, this.height)

        this.ctx.fillStyle = "white";
        this.ctx.fillRect(this.width - 100, this.height-100, 100, 100)
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