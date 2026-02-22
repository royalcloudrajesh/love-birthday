let stage = 0;
const app = document.getElementById("app");

/* 🎵 AUDIO */
const bgMusic = document.getElementById("bgMusic");
const sfx = {
  gift: document.getElementById("sfxGift"),
  click: document.getElementById("sfxClick"),
  heart: document.getElementById("sfxHeart"),
  wrong: document.getElementById("sfxWrong"),
  correct: document.getElementById("sfxCorrect"),
  whoosh: document.getElementById("sfxWhoosh"),
  celebrate: document.getElementById("sfxCelebrate")
};

function play(sound){
  sound.currentTime = 0;
  sound.play();
}

function next(){
  play(sfx.whoosh);
  stage++;
  loadStage();
}

function restart(){
  stage = 0;
  loadStage();
}

/* ================= LOAD STAGES ================= */
function loadStage() {

  /* PAGE 1 */
  if(stage===0){
    app.innerHTML=`
    <div class="screen centered">
      <img src="images/gift.png" width="200">
      <h2>Click for Surprise 🎁</h2>
      <button onclick="startGift()">Open</button>
    </div>`;
  }

  /* PAGE 2 */
  if(stage===1){
    app.innerHTML=`
    <div class="screen">
      <h3>Arrange the Puzzle 🧩</h3>
      <div class="puzzle" id="puzzle"></div>
      <button id="nextBtn" class="hidden" onclick="next()">More Surprise 💝</button>
    </div>`;
    puzzleGame();
  }

  /* PAGE 3 */
  if(stage===2){
    app.innerHTML=`
    <div class="screen" id="heartGame">
      <h3>Catch My Heart ❤️</h3>
      <div id="bucket">🪣</div>
      <button id="nextBtn" class="hidden" onclick="next()">More Surprise 💝</button>
    </div>`;
    catchHearts();
  }

  /* PAGE 4 */
  if(stage===3){
    app.innerHTML=`
    <div class="screen" id="photoGame">
      <h3>Find My Photo 📸</h3>
      <p>Click MY photo 5 times</p>
      <button id="nextBtn" class="hidden" onclick="next()">More Surprise 💝</button>
    </div>`;
    findMyPhoto();
  }

  /* PAGE 5 */
  if(stage===4){
    const ops=["Dad","Mom","Son","Brother","Sister-in-law","Mother-in-law","Friend"];
    app.innerHTML=`
    <div class="screen">
      <h3>Who Loves You Most? 😘</h3>
      ${ops.map(o=>`
        <button class="loveBtn"
        onmouseover="this.innerText='My Husband ❤️'"
        onclick="next()">${o}</button>`).join("")}
    </div>`;
  }

  /* PAGE 6 */
  if(stage===5){
    app.innerHTML=`
    <div class="screen">
      <h3>Find the Hearts 💓</h3>
      <div class="cards" id="cards"></div>
      <button id="nextBtn" class="hidden" onclick="next()">More Surprise 💝</button>
    </div>`;
    memoryGame();
  }

  /* PAGE 7 */
  if(stage===6){
    app.innerHTML=`
    <div class="screen centered">
      <h3>Read Carefully 👀</h3>
      <p>You are my today, tomorrow & forever ❤️</p>
      <div style="font-size:28px">💞💖💘</div>
      <button onclick="next()">More Surprise 💝</button>
    </div>`;
  }

  /* PAGE 8 */
  if(stage===7){
    app.innerHTML=`
    <div class="screen centered">
      <h3>You Are My Everything 🌍</h3>
      <div style="font-size:30px">❤️🌎❤️</div>
      <button onclick="next()">More Surprise 💝</button>
    </div>`;
  }

  /* PAGE 9 */
  if(stage===8){
    app.innerHTML=`
    <div class="screen centered">
      <h3>My Heart Is Loading… ❤️</h3>
      <div class="loader">💓💓💓</div>
      <button id="loadBtn" class="hidden" onclick="next()">More Surprise 💝</button>
    </div>`;
    setTimeout(()=>loadBtn.classList.remove("hidden"),3000);
  }

  /* FINAL */
  if(stage===9){
    play(sfx.celebrate);
    app.innerHTML=`
    <div class="final">
      <img src="images/birthday.jpg">
      <h1>Happy Birthday My Love 🎂❤️</h1>
      <button onclick="restart()">Replay ♾️</button>
    </div>`;
    celebrate();
  }
}

/* 🎁 START MUSIC */
function startGift(){
  play(sfx.gift);
  bgMusic.volume = 0.4;
  bgMusic.play();
  next();
}

/* ================= PUZZLE ================= */
function puzzleGame(){
  const puzzle=document.getElementById("puzzle");
  puzzle.innerHTML="";
  const size=2, pieceSize=140;
  let order=[0,1,2,3].sort(()=>Math.random()-0.5);

  order.forEach(pos=>{
    let p=document.createElement("div");
    p.className="piece";
    p.dataset.correct=pos;
    p.style.backgroundPosition=`${-(pos%2)*pieceSize}px ${-Math.floor(pos/2)*pieceSize}px`;
    p.draggable=true;
    p.ondragstart=()=>window.drag=p;
    p.ondragover=e=>e.preventDefault();
    p.ondrop=()=>{
      play(sfx.click);
      let d=window.drag;
      [p.style.backgroundPosition,d.style.backgroundPosition]=
      [d.style.backgroundPosition,p.style.backgroundPosition];
      [p.dataset.correct,d.dataset.correct]=
      [d.dataset.correct,p.dataset.correct];
      if([...puzzle.children].every((x,i)=>x.dataset.correct==i))
        document.getElementById("nextBtn").classList.remove("hidden");
    };
    puzzle.appendChild(p);
  });
}

/* ================= HEART GAME ================= */
function catchHearts(){
  let caught=0;
  const g=document.getElementById("heartGame");
  const b=document.getElementById("bucket");

  g.onmousemove=e=>{
    let r=g.getBoundingClientRect();
    b.style.left=Math.max(0,Math.min(260,e.clientX-r.left-20))+"px";
  };

  let int=setInterval(()=>{
    let h=document.createElement("img");
    h.src="images/heart.png";
    h.className="fall";
    h.style.left=Math.random()*260+"px";
    g.appendChild(h);

    let chk=setInterval(()=>{
      let hr=h.getBoundingClientRect(), br=b.getBoundingClientRect();
      if(hr.bottom>=br.top && hr.left<br.right && hr.right>br.left){
        play(sfx.heart);
        caught++; h.remove(); clearInterval(chk);
        if(caught===10){
          clearInterval(int);
          document.getElementById("nextBtn").classList.remove("hidden");
        }
      }
    },50);
    setTimeout(()=>h.remove(),4000);
  },700);
}

/* ================= PHOTO GAME ================= */
function findMyPhoto(){
  let hits=0;
  const g=document.getElementById("photoGame");
  let i=setInterval(()=>{
    let img=document.createElement("img");
    let me=Math.random()<0.3;
    img.src=me?"images/me.jpg":"images/random1.jpg";
    img.className="fall";
    img.style.left=Math.random()*260+"px";
    g.appendChild(img);

    img.onclick=()=>{
      if(me){
        play(sfx.correct);
        if(++hits===5){
          clearInterval(i);
          document.getElementById("nextBtn").classList.remove("hidden");
        }
      } else {
        play(sfx.wrong);
      }
      img.remove();
    };
    setTimeout(()=>img.remove(),4000);
  },700);
}

/* ================= MEMORY GAME ================= */
function memoryGame(){
  const cards=document.getElementById("cards");
  let deck=["💓","💓","😊","🌸","🌍","⭐","🎁","🎈","🍫","💍"];
  deck=[...deck,...deck].sort(()=>Math.random()-0.5);
  let open=[],lock=false;

  deck.forEach(v=>{
    let c=document.createElement("div");
    c.className="card";
    c.onclick=()=>{
      if(lock||c.innerText) return;
      c.innerText=v; open.push(c);
      play(sfx.click);
      if(open.length===2){
        lock=true;
        setTimeout(()=>{
          if(open[0].innerText==="💓"&&open[1].innerText==="💓"){
            play(sfx.correct);
            document.getElementById("nextBtn").classList.remove("hidden");
          }
          if(open[0].innerText!==open[1].innerText){
            play(sfx.wrong);
            open.forEach(x=>x.innerText="");
          }
          open=[]; lock=false;
        },800);
      }
    };
    cards.appendChild(c);
  });
}

/* 🎆 FINAL EFFECTS */
function celebrate(){
  for(let i=0;i<30;i++){
    let f=document.createElement("div");
    f.className="flower";
    f.innerText="🌸";
    f.style.left=Math.random()*100+"%";
    document.body.appendChild(f);
  }
  for(let i=0;i<10;i++){
    let c=document.createElement("div");
    c.className="cracker";
    c.innerText="🎆";
    c.style.left=Math.random()*100+"%";
    c.style.top=Math.random()*100+"%";
    document.body.appendChild(c);
  }
}

loadStage();