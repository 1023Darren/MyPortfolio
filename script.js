// Hamburger toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('show'));

// Modals
const modalButtons = document.querySelectorAll('.modal-btn');
const modals = document.querySelectorAll('.modal');
const closeButtons = document.querySelectorAll('.close');

modalButtons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.getElementById(btn.dataset.target).style.display='block';
  });
});
closeButtons.forEach(btn=> btn.addEventListener('click', ()=> btn.closest('.modal').style.display='none'));
window.addEventListener('click', e=> { modals.forEach(m=> { if(e.target===m) m.style.display='none'; }); });

// Intro fade
window.addEventListener('load', ()=> setTimeout(()=>document.getElementById('intro').classList.add('fade-out'),3000));

// Intro hearts
const canvas=document.getElementById('heartCanvas');
const ctx=canvas.getContext('2d');
canvas.width=window.innerWidth; canvas.height=window.innerHeight;
class Heart{constructor(){this.x=Math.random()*canvas.width;this.y=Math.random()*canvas.height;this.vx=(Math.random()-0.5)*1.5;this.vy=(Math.random()-0.5)*1.5;this.size=15+Math.random()*15;} draw(){ctx.fillStyle='red';ctx.beginPath();ctx.moveTo(this.x,this.y);ctx.bezierCurveTo(this.x,this.y-this.size/2,this.x+this.size,this.y-this.size/2,this.x,this.y+this.size);ctx.bezierCurveTo(this.x-this.size,this.y-this.size/2,this.x,this.y-this.size/2,this.x,this.y);ctx.fill();} update(hs){this.x+=this.vx;this.y+=this.vy;if(this.x<0||this.x>canvas.width)this.vx*=-1;if(this.y<0||this.y>canvas.height)this.vy*=-1;hs.forEach(o=>{if(o!==this){let dx=o.x-this.x,dy=o.y-this.y,d=Math.sqrt(dx*dx+dy*dy);if(d<this.size){this.vx*=-1;this.vy*=-1;}}});}}
const heartsArray=[];for(let i=0;i<20;i++)heartsArray.push(new Heart());
function animate(){ctx.clearRect(0,0,canvas.width,canvas.height);heartsArray.forEach(h=>{h.update(heartsArray);h.draw();});requestAnimationFrame(animate);}
animate();
window.addEventListener('resize',()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;});

// Background hearts
const bgCanvas=document.getElementById('bgHearts');
const bgCtx=bgCanvas.getContext('2d');
bgCanvas.width=window.innerWidth; bgCanvas.height=window.innerHeight;
class BgHeart{constructor(){this.x=Math.random()*bgCanvas.width;this.y=Math.random()*bgCanvas.height;this.vx=(Math.random()-0.5)*0.5;this.vy=(Math.random()-0.5)*0.5;this.size=10+Math.random()*15;} draw(){bgCtx.fillStyle='rgba(255,0,0,0.4)';bgCtx.beginPath();bgCtx.moveTo(this.x,this.y);bgCtx.bezierCurveTo(this.x,this.y-this.size/2,this.x+this.size,this.y-this.size/2,this.x,this.y+this.size);bgCtx.bezierCurveTo(this.x-this.size,this.y-this.size/2,this.x,this.y-this.size/2,this.x,this.y);bgCtx.fill();} update(bs){this.x+=this.vx;this.y+=this.vy;if(this.x<0||this.x>bgCanvas.width)this.vx*=-1;if(this.y<0||this.y>bgCanvas.height)this.vy*=-1;bs.forEach(o=>{if(o!==this){let dx=o.x-this.x,dy=o.y-this.y,d=Math.sqrt(dx*dx+dy*dy);if(d<this.size){this.vx*=-1;this.vy*=-1;}}});}}
const bgHeartsArray=[];for(let i=0;i<30;i++)bgHeartsArray.push(new BgHeart());
function animateBg(){bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);bgHeartsArray.forEach(h=>{h.update(bgHeartsArray);h.draw();});requestAnimationFrame(animateBg);}
animateBg();
window.addEventListener('resize',()=>{bgCanvas.width=window.innerWidth;bgCanvas.height=window.innerHeight;});

// Game logic
const startGameBtn = document.getElementById('startGameBtn');
const playerNameInput = document.getElementById('playerName');
const displayName = document.getElementById('displayName');
const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const highscoreDisplay = document.getElementById('highscore');

let playerName = "";
let score = 0;
let highscore = 0;
let buttons = [];
let btnSpeeds = [];
let buttonsClicked = 0;
let gameRunning = false;
const BUTTON_COUNT = 3;

startGameBtn.addEventListener('click', () => {
  const name = playerNameInput.value.trim();
  if (!name) return alert("Enter a name!");
  playerName = name;
  displayName.textContent = playerName;
  score = 0;
  scoreDisplay.textContent = score;
  gameArea.innerHTML = '';
  gameRunning = true;
  buttonsClicked = 0;
  createButtons();
  requestAnimationFrame(gameLoop);
});

function createButtons() {
  gameArea.innerHTML = ''; // clear previous buttons
  buttons = [];
  btnSpeeds = [];
  buttonsClicked = 0;

  for (let i = 0; i < BUTTON_COUNT; i++) {
    const btn = document.createElement('button');
    btn.className = 'catch-btn';
    btn.textContent = 'Click Me!';

    // Random position
    btn.style.left = Math.random() * (gameArea.clientWidth - 60) + 'px';
    btn.style.top = Math.random() * (gameArea.clientHeight - 40) + 'px';

    // Random speed
    btnSpeeds.push({
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2
    });

    btn.addEventListener('click', e => {
      e.stopPropagation();
      btn.style.display = 'none'; // vanish
      buttonsClicked++;
      score++;
      scoreDisplay.textContent = score;
      if (score > highscore) {
        highscore = score;
        highscoreDisplay.textContent = highscore;
      }

      // When all buttons clicked, create new ones after short delay
      if (buttonsClicked >= BUTTON_COUNT) {
        setTimeout(createButtons, 500);
      }
    });

    gameArea.appendChild(btn);
    buttons.push(btn);
  }
}

function gameLoop() {
  if (!gameRunning) return;

  const w = gameArea.clientWidth;
  const h = gameArea.clientHeight;

  buttons.forEach((btn, i) => {
    if (btn.style.display === 'none') return; // skip vanished buttons
    let x = parseFloat(btn.style.left);
    let y = parseFloat(btn.style.top);

    x += btnSpeeds[i].vx;
    y += btnSpeeds[i].vy;

    // Bounce off walls
    if (x < 0 || x > w - btn.offsetWidth) btnSpeeds[i].vx *= -1;
    if (y < 0 || y > h - btn.offsetHeight) btnSpeeds[i].vy *= -1;

    btn.style.left = Math.max(0, Math.min(x, w - btn.offsetWidth)) + "px";
    btn.style.top = Math.max(0, Math.min(y, h - btn.offsetHeight)) + "px";
  });

  requestAnimationFrame(gameLoop);
}

// Clicking outside buttons ends game
gameArea.addEventListener('click', e => {
  if (!e.target.classList.contains('catch-btn') && gameRunning) {
    alert("Missed! Game Over.");
    score = 0;
    scoreDisplay.textContent = score;
    gameRunning = false;
    gameArea.innerHTML = '';
  }
});
function gameLoop() {
  if (!gameRunning) return;
  const w = gameArea.clientWidth;
  const h = gameArea.clientHeight;

  buttons.forEach((btn, i) => {
    let x = parseFloat(btn.style.left);
    let y = parseFloat(btn.style.top);
    x += btnSpeeds[i].vx;
    y += btnSpeeds[i].vy;

    if (x < 0 || x > w - btn.offsetWidth) btnSpeeds[i].vx *= -1;
    if (y < 0 || y > h - btn.offsetHeight) btnSpeeds[i].vy *= -1;

    btn.style.left = Math.max(0, Math.min(x, w - btn.offsetWidth)) + "px";
    btn.style.top = Math.max(0, Math.min(y, h - btn.offsetHeight)) + "px";
  });

  requestAnimationFrame(gameLoop);
}
function saveScore(name,score){
  const data=new FormData();
  data.append('name',name);
  data.append('score',score);
  fetch('save_score.php',{method:'POST',body:data})
    .then(r=>r.json())
    .then(res=>{if(res.status==='success') updateLeaderboard(res.scores);});
}

function fetchLeaderboard(){
  fetch('scores.json')
    .then(r=>r.json())
    .then(data=>updateLeaderboard(data));
}

function updateLeaderboard(scores){
  leaderboardDiv.innerHTML=`Player: ${playerName} | Score: ${score} | Highscore: ${highscore}<br>Last Players:<br>`;
  scores.slice().reverse().forEach(s=>{leaderboardDiv.innerHTML+=`${s.name} : ${s.score}<br>`;});
}
