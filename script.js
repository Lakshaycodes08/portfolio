const projects={
  eurosat:{label:"Applied machine learning",title:"Satellite land-use classifier",description:"An EfficientNet-B0 classifier trained on 27,000 EuroSAT images, reaching 95.7% accuracy with Grad-CAM views for interpretable predictions.",lesson:"A strong metric is only part of a useful ML product. Explanations, data handling, and a clear inference interface make the model easier to trust and test.",href:"https://huggingface.co/spaces/luxay08/eurosat-classifier"},
  stripe:{label:"Backend engineering",title:"Reliable payment flow",description:"A Fastify and TypeScript payment gateway using Stripe Payment Intents, verified webhooks, MySQL transactions, and idempotency keys.",lesson:"Payment correctness lives on the server. Webhook verification, transaction boundaries, and idempotency are core product behavior, not edge cases.",href:"https://github.com/Lakshaycodes08/stripe-payment-gateway"},
  canopyguard:{label:"Work in progress",title:"CanopyGuard AI",description:"",lesson:"",href:""},
  college2corporate:{label:"Work in progress",title:"College2Corporate",description:"",lesson:"",href:""}
};

const rows=[...document.querySelectorAll(".project-row")];
const wheel=document.querySelector(".project-list");
const wheelShell=document.querySelector(".project-wheel-shell");
const selection=document.querySelector(".wheel-selection");
const projectCount=document.querySelector("#projectCount");
const projectModal=document.querySelector("#projectModal");
const modalFields={index:document.querySelector("#modalIndex"),label:document.querySelector("#modalLabel"),title:document.querySelector("#modalTitle"),description:document.querySelector("#modalDescription"),lesson:document.querySelector("#modalLesson"),availability:document.querySelector("#modalAvailability"),link:document.querySelector("#modalProjectLink")};
let wheelIndex=0;
const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)");

function selectProject(key){
  rows.forEach(row=>{const active=row.dataset.project===key;row.classList.toggle("active",active);row.setAttribute("aria-selected",String(active))});
}

function setWheelIndex(index,updateProject=true){
  wheelIndex=(index+rows.length)%rows.length;
  rows.forEach((row,rowIndex)=>{
    let offset=rowIndex-wheelIndex;
    if(offset>rows.length/2)offset-=rows.length;
    if(offset<-rows.length/2)offset+=rows.length;
    const distance=Math.abs(offset);
    row.style.transform=`translate3d(0,calc(-50% + ${offset*77}px),${-distance*85}px) rotateX(${offset*-25}deg) scale(${1-distance*.075})`;
    row.style.opacity=distance===0?"1":".7";
    row.style.zIndex=String(3-distance);
    row.tabIndex=-1;
  });
  const activeRow=rows[wheelIndex];
  wheel.setAttribute("aria-activedescendant",activeRow.id);
  projectCount.textContent=`${String(wheelIndex+1).padStart(2,"0")} / ${String(rows.length).padStart(2,"0")}`;
  if(updateProject)selectProject(activeRow.dataset.project);
}

function rollWheel(direction){setWheelIndex(wheelIndex+direction)}
const hoverCapable=window.matchMedia("(hover: hover) and (pointer: fine)");
let hoveringWheel=false,hoverInterval=0,hoverStart=0;
function stopHoverRevolve(){window.clearTimeout(hoverStart);window.clearInterval(hoverInterval);hoverStart=0;hoverInterval=0}
function startHoverRevolve(delay=650){
  stopHoverRevolve();
  if(!hoveringWheel||!hoverCapable.matches||reducedMotion.matches)return;
  hoverStart=window.setTimeout(()=>{
    rollWheel(1);
    hoverInterval=window.setInterval(()=>rollWheel(1),1450);
  },delay);
}
function pauseHoverRevolve(){if(!hoveringWheel)return;startHoverRevolve(3200)}
wheelShell.addEventListener("pointerenter",()=>{hoveringWheel=true;startHoverRevolve()});
wheelShell.addEventListener("pointerleave",()=>{hoveringWheel=false;stopHoverRevolve()});
let lastProjectTrigger=null;
function openProjectDialog(trigger){
  const project=projects[rows[wheelIndex].dataset.project];
  if(!project)return;
  hoveringWheel=false;stopHoverRevolve();
  lastProjectTrigger=trigger;
  modalFields.index.textContent=`${String(wheelIndex+1).padStart(2,"0")} / ${String(rows.length).padStart(2,"0")} · Project file`;
  modalFields.label.textContent=project.label;
  modalFields.title.textContent=project.title;
  modalFields.description.textContent=project.description;
  modalFields.lesson.textContent=project.lesson;
  const pending=!project.href;
  projectModal.classList.toggle("is-pending",pending);
  modalFields.description.hidden=pending;
  modalFields.lesson.closest(".modal-lesson").hidden=pending;
  modalFields.availability.hidden=!pending;
  projectModal.setAttribute("aria-describedby",pending?"modalAvailability":"modalDescription");
  if(project.href){modalFields.link.href=project.href;modalFields.link.removeAttribute("aria-disabled");modalFields.link.removeAttribute("tabindex")}
  else{modalFields.link.removeAttribute("href");modalFields.link.setAttribute("aria-disabled","true");modalFields.link.tabIndex=-1}
  projectModal.showModal();
  startMusic();
}
document.querySelector("#modalClose").addEventListener("click",()=>projectModal.close());
document.querySelector("#modalBack").addEventListener("click",()=>projectModal.close());
projectModal.addEventListener("click",event=>{if(event.target===projectModal)projectModal.close()});
projectModal.addEventListener("close",()=>lastProjectTrigger?.focus());
function confirmProject(){
  if(reducedMotion.matches)return;
  selection.classList.remove("is-confirming");
  void selection.offsetWidth;
  selection.classList.add("is-confirming");
}

rows.forEach((row,rowIndex)=>row.addEventListener("click",()=>{if(suppressClick)return;setWheelIndex(rowIndex);confirmProject();openProjectDialog(row)}));
wheel.addEventListener("keydown",event=>{
  pauseHoverRevolve();
  if(["Enter"," "].includes(event.key)&&event.target===wheel){event.preventDefault();confirmProject();openProjectDialog(wheel);return}
  if(!["ArrowDown","ArrowUp","PageDown","PageUp"].includes(event.key))return;
  event.preventDefault();
  rollWheel(["ArrowDown","PageDown"].includes(event.key)?1:-1);
});

let wheelDelta=0,wheelLocked=false;
wheel.addEventListener("wheel",event=>{
  event.preventDefault();
  pauseHoverRevolve();
  wheelDelta+=event.deltaY;
  if(wheelLocked||Math.abs(wheelDelta)<18)return;
  wheelLocked=true;rollWheel(wheelDelta>0?1:-1);wheelDelta=0;
  window.setTimeout(()=>{wheelLocked=false},190);
},{passive:false});

let dragging=false,dragAnchor=0,lastPointerY=0,lastPointerTime=0,pointerVelocity=0,suppressClick=false,dragMoved=false;
wheel.addEventListener("pointerdown",event=>{pauseHoverRevolve();dragging=true;dragMoved=false;dragAnchor=event.clientY;lastPointerY=event.clientY;lastPointerTime=performance.now();pointerVelocity=0});
wheel.addEventListener("pointermove",event=>{
  if(!dragging)return;
  const now=performance.now(),elapsed=Math.max(now-lastPointerTime,1);pointerVelocity=(event.clientY-lastPointerY)/elapsed;lastPointerY=event.clientY;lastPointerTime=now;
  const travel=event.clientY-dragAnchor;
  if(Math.abs(travel)>=36){dragMoved=true;if(!wheel.hasPointerCapture(event.pointerId))wheel.setPointerCapture(event.pointerId);rollWheel(travel<0?1:-1);dragAnchor=event.clientY}
});
function finishDrag(event){
  if(!dragging)return;dragging=false;
  if(wheel.hasPointerCapture(event.pointerId))wheel.releasePointerCapture(event.pointerId);
  if(dragMoved){suppressClick=true;window.setTimeout(()=>{suppressClick=false},100)}
  if(Math.abs(pointerVelocity)>.32)window.setTimeout(()=>rollWheel(pointerVelocity<0?1:-1),70);
}
wheel.addEventListener("pointerup",finishDrag);wheel.addEventListener("pointercancel",finishDrag);
setWheelIndex(0,false);

const header=document.querySelector(".site-header");
const navToggle=document.querySelector(".nav-toggle");
function setMenuOpen(open){header.classList.toggle("menu-open",open);navToggle.setAttribute("aria-expanded",String(open));navToggle.setAttribute("aria-label",open?"Close navigation":"Open navigation")}
navToggle.addEventListener("click",()=>setMenuOpen(!header.classList.contains("menu-open")));
document.querySelectorAll(".site-nav a").forEach(link=>link.addEventListener("click",()=>setMenuOpen(false)));
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&header.classList.contains("menu-open")){setMenuOpen(false);navToggle.focus()}});
document.addEventListener("pointerdown",event=>{if(header.classList.contains("menu-open")&&!header.contains(event.target))setMenuOpen(false)});
window.matchMedia("(min-width: 721px)").addEventListener("change",event=>{if(event.matches)setMenuOpen(false)});

const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");revealObserver.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach((element,index)=>{element.style.transitionDelay=`${Math.min(index%4,3)*70}ms`;revealObserver.observe(element)});
const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)document.querySelectorAll(".site-nav a").forEach(link=>link.classList.toggle("active",link.getAttribute("href")===`#${entry.target.id}`))}),{rootMargin:"-45% 0px -45% 0px"});
document.querySelectorAll("main>section").forEach(section=>sectionObserver.observe(section));

// Football / FIFA Audio Controller (Freed from Desire)
const bgAudio = document.querySelector("#bgMusic");
const musicToggle = document.querySelector("#musicToggle");
let audioStarted = false;
let userManuallyPaused = false;

function setMusicPlayingState(playing) {
  if (!musicToggle) return;
  musicToggle.classList.toggle("is-playing", playing);
  musicToggle.setAttribute("aria-pressed", String(playing));
  const tag = musicToggle.querySelector(".music-tag");
  if (tag) tag.textContent = playing ? "PLAYING" : "FIFA SOUND";
}

function startMusic() {
  if (!bgAudio || userManuallyPaused) return;
  if (bgAudio.paused) {
    bgAudio.volume = 0;
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          audioStarted = true;
          setMusicPlayingState(true);
          let vol = 0;
          const fade = setInterval(() => {
            vol = Math.min(vol + 0.05, 0.42);
            bgAudio.volume = vol;
            if (vol >= 0.42) clearInterval(fade);
          }, 80);
        })
        .catch(() => {
          // Handled gracefully if browser blocks before gesture
        });
    }
  }
}

function toggleMusic() {
  if (!bgAudio) return;
  if (bgAudio.paused) {
    userManuallyPaused = false;
    bgAudio.volume = 0.42;
    bgAudio.play().then(() => {
      audioStarted = true;
      setMusicPlayingState(true);
    }).catch(console.error);
  } else {
    userManuallyPaused = true;
    bgAudio.pause();
    setMusicPlayingState(false);
  }
}

if (musicToggle) {
  musicToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMusic();
  });
}

// Start music on first interaction (click anywhere on page)
function handleFirstInteraction() {
  if (!audioStarted && !userManuallyPaused) {
    startMusic();
  }
}
document.addEventListener("click", handleFirstInteraction, { once: true });
document.addEventListener("keydown", handleFirstInteraction, { once: true });

// Pause music when tab is hidden, resume when tab is active
document.addEventListener("visibilitychange", () => {
  if (!bgAudio) return;
  if (document.hidden) {
    if (!bgAudio.paused) {
      bgAudio.pause();
      setMusicPlayingState(false);
    }
  } else if (audioStarted && !userManuallyPaused) {
    bgAudio.play().then(() => setMusicPlayingState(true)).catch(() => {});
  }
});
