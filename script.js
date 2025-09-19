// Hamburger toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click',()=>{navLinks.classList.toggle('show');});

// Modals
const modalButtons=document.querySelectorAll('.modal-btn');
const modals=document.querySelectorAll('.modal');
const closeButtons=document.querySelectorAll('.close');

modalButtons.forEach(btn=>{btn.addEventListener('click',()=>{document.getElementById(btn.dataset.target).style.display='block';});});
closeButtons.forEach(btn=>{btn.addEventListener('click',()=>{btn.closest('.modal').style.display='none';});});
window.addEventListener('click',(e)=>{modals.forEach(modal=>{if(e.target===modal){modal.style.display='none';}});});

// Game logic
const catchBtn=document.getElementById('catch-btn');
const gameArea=document.getElementById('game-area');
const scoreDisplay=document.getElementById('score');
let score=0;
catchBtn.addEventListener('click',()=>{
  score++; scoreDisplay.textContent=score;
  const areaWidth=gameArea.clientWidth-catchBtn.offsetWidth;
  const areaHeight=gameArea.clientHeight-catchBtn.offsetHeight;
  catchBtn.style.left=Math.floor(Math.random()*areaWidth)+'px';
  catchBtn.style.top=Math.floor(Math.random()*areaHeight)+'px';
});

// Intro fade-out
window.addEventListener('load',()=>{
  const intro=document.getElementById('intro');
  setTimeout(()=>{intro.classList.add('fade-out');},3000);
});

// Floating hearts with basic physics
const canvas=document.getElementById('heartCanvas');
const ctx=canvas.getContext('2d');
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

class Heart{
  constructor(){
    this.x=Math.random()*canvas.width;
    this.y=Math.random()*canvas.height;
    this.vx=(Math.random()-0.5)*1.5;
    this.vy=(Math.random()-0.5)*1.5;
    this.size=15+Math.random()*15;
  }
  draw(){
    ctx.fillStyle='red';
    ctx.beginPath();
    ctx.moveTo(this.x,this.y);
    ctx.bezierCurveTo(this.x,this.y-this.size/2,this.x+this.size,this.y-this.size/2,this.x,this.y+this.size);
    ctx.bezierCurveTo(this.x-this.size,this.y-this.size/2,this.x,this.y-this.size/2,this.x,this.y);
    ctx.fill();
  }
  update(hearts){
    this.x+=this.vx; this.y+=this.vy;

    // bounce walls
    if(this.x<0||this.x>canvas.width) this.vx*=-1;
    if(this.y<0||this.y>canvas.height) this.vy*=-1;

    // simple collision
    hearts.forEach(other=>{
      if(other!==this){
        let dx=other.x-this.x;
        let dy=other.y-this.y;
        let dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<this.size){
          this.vx*=-1; this.vy*=-1;
        }
      }
    });
  }
}

const heartsArray=[];
for(let i=0;i<20;i++) heartsArray.push(new Heart());

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  heartsArray.forEach(h=>{h.update(heartsArray); h.draw();});
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize',()=>{
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
});
