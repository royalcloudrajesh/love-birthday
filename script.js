let stage = 0;
const app = document.getElementById("app");

/* 🎵 AUDIO */
const bgMusic = document.getElementById("bgMusic");
const romanticMusic = document.getElementById("romanticMusic");

const sfx = {
  gift: document.getElementById("sfxGift"),
  click: document.getElementById("sfxClick"),
  heart: document.getElementById("sfxHeart"),
  wrong: document.getElementById("sfxWrong"),
  correct: document.getElementById("sfxCorrect"),
  whoosh: document.getElementById("sfxWhoosh"),
  celebrate: document.getElementById("sfxCelebrate")
};

/* 🕒 SAFE TIMERS (Prevents sounds/games from leaking into other pages) */
let activeIntervals = [];
let activeTimeouts = [];

function setSafeInterval(fn, ms) {
  let id = setInterval(fn, ms);
  activeIntervals.push(id);
  return id;
}

function setSafeTimeout(fn, ms) {
  let id = setTimeout(fn, ms);
  activeTimeouts.push(id);
  return id;
}

function clearAllTimers() {
  // Clear timeouts and intervals
  activeIntervals.forEach(clearInterval);
  activeTimeouts.forEach(clearTimeout);
  activeIntervals = [];
  activeTimeouts = [];
  
  // FORCE STOP the heart sound so it absolutely doesn't play on the next page
  sfx.heart.pause();
  sfx.heart.currentTime = 0;
}

function play(sound){
  sound.currentTime = 0;
  sound.play();
}

function next(){
  play(sfx.whoosh);
  clearAllTimers(); // Completely kills all running games and sounds from previous page
  stage++;
  loadStage();
}

function restart(){
  bgMusic.pause();
  bgMusic.currentTime = 0;
  romanticMusic.pause();
  romanticMusic.currentTime = 0;
  clearAllTimers();
  stage = 0;
  loadStage();
}

/* ================= STAGES ================= */

function loadStage(){

  /* PAGE 1 */
  if(stage===0){
    app.innerHTML=`
    <div class="screen centered">
      <img src="images/gift.png" width="200">
      <h2>Click for Surprise 🎁</h2>
      <button onclick="startGift()">Open</button>
    </div>`;
  }

  /* PAGE 2 – PUZZLE */
  if(stage===1){
    app.innerHTML=`
    <div class="screen">
      <h3>Arrange the Puzzle 🧩</h3>
      <div class="puzzle" id="puzzle"></div>
      <button id="nextBtn" class="hidden" onclick="next()">More Surprise 💝</button>
    </div>`;
    puzzleGame();
  }

  /* PAGE 3 – CATCH HEART */
  if(stage===2){
    app.innerHTML=`
    <div class="screen" id="heartGame">
      <h3>Catch My Heart ❤️</h3>
      <div id="bucket">🪣</div>
      <button id="nextBtn" class="hidden" onclick="next()">More Surprise 💝</button>
    </div>`;
    catchHearts();
  }

  /* PAGE 4 – PHOTO */
  if(stage===3){
    app.innerHTML=`
    <div class="screen" id="photoGame">
      <h3>Find My Photo 📸</h3>
      <p>Click MY photo 5 times</p>
      <button id="nextBtn" class="hidden" onclick="next()">More Surprise 💝</button>
    </div>`;
    findMyPhoto();
  }

  /* PAGE 5 – WHO LOVES YOU MOST (Changed to correct.mp3) */
  if(stage===4){
    const ops=["Dad","Mom","Son","Brother","Sister-in-law","Mother-in-law","Friend"];
    app.innerHTML=`
    <div class="screen">
    <h3>Who Loves You Most? 😘</h3>
    ${ops.map(o=>`
    <button class="loveBtn"
    onmouseover="this.innerText='My Husband ❤️'; play(sfx.correct);"
    onclick="next()">${o}</button>`).join("")}
    </div>`;
  }

  /* PAGE 6 – MEMORY */
  if(stage===5){
    app.innerHTML=`
    <div class="screen">
    <h3>Find the Hearts 💓</h3>
    <div class="cards" id="cards"></div>
    <button id="nextBtn" class="hidden" onclick="next()">More Surprise 💝</button>
    </div>`;
    memoryGame();
  }

  /* PAGE 7 (Read Carefully - Starts Romantic Music) */
  if(stage===6){
    romanticMusic.volume = 0.5;
    romanticMusic.play().catch(e => console.log("Audio playback blocked:", e));

    const text = "You are my today, tomorrow & forever ❤️";
    const words = text.split(" ");
    const delay = 0.7; 
    const wordsHTML = words.map((w, i) => `<span class="fade-word" style="animation-delay: ${i * delay}s">${w}</span>`).join(" ");
    const totalTime = words.length * delay;

    app.innerHTML=`
    <div class="screen centered">
      <h3>Read Carefully 👀</h3>
      <p style="font-size: 18px; font-weight: bold; line-height: 1.6;">${wordsHTML}</p>
      <div class="bigEmoji fade-word" style="animation-delay: ${totalTime}s">💞💖💘</div>
      <button id="btn7" class="hidden" onclick="next()">More Surprise 💝</button>
    </div>`;

    setSafeTimeout(() => {
      document.getElementById("btn7").classList.remove("hidden");
    }, (totalTime + 1.5) * 1000);
  }

  /* PAGE 8 (You Are My Everything - Music Continues) */
  if(stage===7){
    const text = "You Are My Everything";
    const words = text.split(" ");
    const delay = 0.7; 
    const wordsHTML = words.map((w, i) => `<span class="fade-word" style="animation-delay: ${i * delay}s">${w}</span>`).join(" ");
    const totalTime = words.length * delay;

    app.innerHTML=`
    <div class="screen centered">
      <h3>${wordsHTML}</h3>
      
      <div class="earth-container">
        <!-- Wrapper handles fade in, child handles continuous rotation -->
        <div class="fade-word" style="animation-delay: ${totalTime}s">
          <div class="rotate-earth">🌍</div>
        </div>
        
        <!-- Heart pops out from the middle and stands next to the Earth -->
        <div class="zoom-heart" style="animation-delay: ${totalTime + 1.0}s">❤️</div>
      </div>

      <button id="btn8" class="hidden" onclick="next()">More Surprise 💝</button>
    </div>`;

    setSafeTimeout(() => {
      document.getElementById("btn8").classList.remove("hidden");
    }, (totalTime + 2.5) * 1000);
  }

  /* PAGE 9 (Loading - Syncs Heartbeat Sound to Animation) */
  if(stage===8){
    romanticMusic.pause(); // Stop romantic music to build suspense

    // Play heartbeat instantly, then loop every 1s to match CSS pulse animation
    play(sfx.heart);
    setSafeInterval(() => {
      if(stage === 8) play(sfx.heart);
    }, 1000);

    app.innerHTML=`
    <div class="screen centered">
    <h3>My Heart Is Loading… ❤️</h3>
    <div class="loader">💓💓💓</div>
    <button id="loadBtn" class="hidden" onclick="next()">More Surprise 💝</button>
    </div>`;
    
    setSafeTimeout(() => {
      document.getElementById("loadBtn").classList.remove("hidden");
    }, 3000);
  }

  /* PAGE 10 – FINAL (Added Name) */
  if(stage===9){
    bgMusic.volume = 0.4;
    bgMusic.play().catch(e => console.log(e));
    play(sfx.celebrate);

    app.innerHTML=`
    <div class="final">
    <img src="images/birthday.jpg">
    <h1>Happy Birthday My Love Yamini 🎂❤️</h1>
    <button onclick="restart()">Replay ♾️</button>
    </div>`;
    celebrate();
  }
}

/* ================= GAMES ================= */

function startGift(){
  play(sfx.gift);
  next();
}

/* PUZZLE */
function puzzleGame(){
  const puzzle=document.getElementById("puzzle");
  let order=[0,1,2,3].sort(()=>Math.random()-0.5);

  order.forEach(i=>{
    let p=document.createElement("div");
    p.className="piece";
    p.dataset.i=i;
    p.style.backgroundPosition=`${-(i%2)*140}px ${-Math.floor(i/2)*140}px`;

    p.draggable=true;
    p.ondragstart=()=>window.drag=p;
    p.ondragover=e=>e.preventDefault();
    p.ondrop=()=>swap(p);

    p.ontouchstart=()=>window.drag=p;
    p.ontouchend=()=>swap(p);

    function swap(target){
      if(!window.drag) return;
      play(sfx.click);
      let d=window.drag;
      [target.style.backgroundPosition,d.style.backgroundPosition]=
      [d.style.backgroundPosition,target.style.backgroundPosition];
      [target.dataset.i,d.dataset.i]=[d.dataset.i,target.dataset.i];
      window.drag=null;
      if([...puzzle.children].every((x,i)=>x.dataset.i==i))
        document.getElementById("nextBtn").classList.remove("hidden");
    }
    puzzle.appendChild(p);
  });
}

/* CATCH HEART */
function catchHearts(){
  let caught=0;
  const g=document.getElementById("heartGame");
  const b=document.getElementById("bucket");

  function move(x){
    let r=g.getBoundingClientRect();
    b.style.left=Math.max(0,Math.min(260,x-r.left-20))+"px";
  }

  g.onmousemove=e=>move(e.clientX);
  g.ontouchmove=e=>{
    e.preventDefault();
    move(e.touches[0].clientX);
  };

  let drop = setSafeInterval(()=>{
    if(stage !== 2) return; 

    let h=document.createElement("img");
    h.src="images/heart.png";
    h.className="fall";
    h.style.left=Math.random()*260+"px";
    g.appendChild(h);

    let chk = setSafeInterval(()=>{
      if(stage !== 2) { clearInterval(chk); return; }

      let hr=h.getBoundingClientRect(), br=b.getBoundingClientRect();
      if(hr.bottom>=br.top && hr.left<br.right && hr.right>br.left){
        play(sfx.heart);
        caught++; h.remove(); clearInterval(chk);
        if(caught===10){
          clearInterval(drop);
          document.getElementById("nextBtn").classList.remove("hidden");
        }
      }
    },50);

    setSafeTimeout(()=>h.remove(), 4000);
  },700);
}

/* PHOTO */
function findMyPhoto(){
  let hits=0;
  let i = setSafeInterval(()=>{
    if(stage !== 3) return; 

    let img=document.createElement("img");
    let me=Math.random()<0.3;
    img.src=me?"images/me.jpg":"images/random1.jpg";
    img.className="fall bigImg";
    img.style.left=Math.random()*260+"px";
    document.getElementById("photoGame").appendChild(img);

    img.onclick=()=>{
      if(me){
        play(sfx.correct);
        hits++;
        if(hits===5){
          clearInterval(i);
          document.getElementById("nextBtn").classList.remove("hidden");
        }
      }else play(sfx.wrong);
      img.remove();
    };
    setSafeTimeout(()=>img.remove(), 4000);
  },700);
}

/* MEMORY */
function memoryGame(){
  const cards=document.getElementById("cards");
  let symbols=[
    "💓","💓","🌸","🌸","😊","😊","🎁","🎁",
    "⭐","⭐","🍫","🍫","💍","💍","🎈","🎈",
    "🌍","🌍","❤️","❤️"
  ].sort(()=>Math.random()-0.5);

  let open=[],lock=false,found=false;

  symbols.forEach(sym=>{
    let c=document.createElement("div");
    c.className="card";
    c.onclick=()=>{
      if(lock||c.innerText) return;
      c.innerText=sym;
      play(sfx.click);
      open.push(c);
      if(open.length===2){
        lock=true;
        setSafeTimeout(()=>{
          if(open[0].innerText===open[1].innerText){
            play(sfx.correct);
            if(sym==="💓"&&!found){
              found=true;
              document.getElementById("nextBtn").classList.remove("hidden");
            }
          }else{
            play(sfx.wrong);
            open.forEach(x=>x.innerText="");
          }
          open=[];lock=false;
        },900);
      }
    };
    cards.appendChild(c);
  });
}

/* FINAL EFFECT */
function celebrate(){
  for(let i=0;i<50;i++){
    let f=document.createElement("div");
    f.className="flower";
    f.innerText="🌹";
    f.style.left=Math.random()*100+"%";
    f.style.animationDuration=(4+Math.random()*4)+"s";
    document.body.appendChild(f);
  }
}

loadStage();