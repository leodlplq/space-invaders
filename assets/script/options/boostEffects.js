export const boostEffect = [
    {
        "name" : "ammunition",
        "effect": function(){ this.player.addAmunition(20) },
        "src": './assets/images/bullet_icons.jpg'
    }, 
    {
        "name" : "rapidfire",
        "effect": function(){
            this.player.rapidFire =true
            this.player.rapidFireFunction() 
        },
        "src": './assets/images/rapidfire_icon.jpg'
    },
    {
        "name" : "shield",
        "effect": function(){
            this.player.shield = true
        },
        "src": './assets/images/shield.png'
    },
]
