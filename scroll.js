const scroll = {
    _other:{
        timer: null,
        diferenca: null,
    },
    status : 'parado',
    desaceleracao : 0,
    _velocity : 0,
    _velocityBase : 0,
    set velocity(val){
        this._velocity = val
    },
    get velocity(){
        if(scroll.status == 'parado' && this._velocity != 0){
            this._velocity = this._velocity - this.desaceleracao;
            
            let diff = (this.desaceleracao > 0 ? this.desaceleracao : this.desaceleracao * -1);
            if(this._velocity < diff && this._velocity > diff*-1) this.velocity = 0;
        }
        
        return this._velocity;
    },
    animate: [],
    update(){
        if(scroll.animate.length > 0){
            for(let i = 0; i < scroll.animate.length; i++){
               if(typeof scroll.animate[i] == 'function'){
                   scroll.animate[i]();
               }
            }
        }
        window.requestAnimationFrame(scroll.update);
    }  
}

window.requestAnimationFrame(scroll.update);


document.addEventListener('wheel', function(){
    if(scroll._other.timer != null){
        window.clearTimeout(scroll._other.timer);
        scroll.status = 'movendo';
    }
    
    let value = (event.deltaY > 0? 1 : -1);
    value = value / (scroll._other.diferenca != null ? ((Date.now() - scroll._other.diferenca)/1000).toFixed(2) : 1);
    
    scroll.velocity = value;
    scroll._other.diferenca = new Date();
    
    scroll._other.timer = window.setTimeout(function(){
        scroll.status = 'parado';
        scroll.desaceleracao = (scroll.velocity * (Date.now() - scroll._other.diferenca)/1000) * .5;
    }, 50);
})

var scrollStart = {
    min:0,
    max:0,
    start(){
        let target = document.getElementById("select-menu");
        let min = target.getElementsByClassName("content")[0].getBoundingClientRect();
        scrollStart.min = (window.innerHeight - min.height);

        target.style.top = scrollStart.min + 'px'
    }
}


scrollStart.start();

scroll.animate.push(function(){
    
    let target = document.getElementById("select-menu");
    let old = parseFloat((target.style.top == '' ? 0 : target.style.top));

    let min = target.getElementsByClassName("content")[0].getBoundingClientRect();
    scrollStart.min = (window.innerHeight - min.height);

    let max = target.getBoundingClientRect();
    scrollStart.max = (max.height - window.innerHeight) *-1; 

    let value = (old + scroll.velocity);

    if(scroll.velocity == 0){
        target.style.transition = 'all .5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        value = (value > scrollStart.min ? scrollStart.min : value);
        value = (value < scrollStart.max ? scrollStart.max : value);
    }
    if(scroll.status == "movendo") target.style.removeProperty('transition');
    
    target.style.top = value + 'px'
    target.style.left = (window.innerWidth - target.getBoundingClientRect().width) / 2 + 'px'
    
    
})