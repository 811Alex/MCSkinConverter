const DELAY_PER_DEGREE = 33;
const DRAG_MULTIPLIER = 2;
const VELOCITY_MULTIPLIER = 12;
const FRICTION = 0.7;

var viewerPauseBtns = Array.from(document.getElementsByClassName("viewer-pause-btn"));
var rotations = [];
var viewers = [];
var velocities = [];
var dragging = null;
var dragStartXDeg = 0;
var dragStartRot = 0;
var dragStartScreenW = window.innerWidth;
var lastTime = Date.now();
var lastX = null;

function initViewerRotation(...v){
  v.forEach((viewer) => {
    let id = rotations.length;
    rotations.push(0);
    viewers.push(viewer);
    velocities.push(0);
    viewer.addEventListener("mouseenter", () => viewer.classList.add("hoverSpin"));
    viewer.addEventListener("mouseleave", () => viewer.classList.remove("hoverSpin"));
    viewer.addEventListener("mousedown", (e) => mouseDown(e, id));
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);
    setInterval(() => passiveRotation(id), DELAY_PER_DEGREE);
    initViewerPauseBtn(viewer);
  });
}

function passiveRotation(id){
  let classes = new Array(...viewers[id].classList);
  if(classes.includes("hidden")) return;
  let r = classes.find((c) => ["pauseSpin", "dragSpin", "hoverSpin"].includes(c)) ? rotations[id] : --rotations[id];  // rotate if not paused by class
  let velocity = velocities[id];
  if(Math.abs(velocity) >= FRICTION)  // if there's enough velocity, slow it down and add to rotation
    r += (velocities[id] += velocity>0 ? -FRICTION : FRICTION);
  if(r != 0) setRotation(id, r);
}

function setRotation(id, degrees){
  rotations[id] = degrees = degrees % 360;
  Array.from(viewers[id].getElementsByClassName("player"))
      .forEach((p) => p.style.transform = "rotateY(" + degrees + "deg)");
}

function mouseX2Deg(x){
  return (x+1)/dragStartScreenW*360;
}

function mouseX2Velocity(x){  // note: first call will always return 0
  let v = 0;
  let now = Date.now();
  if(lastX != null){
    let dt = now - lastTime;
    let dx = x - lastX;
    v = Math.round(dx/dt*VELOCITY_MULTIPLIER);
  }
  lastTime = now;
  lastX = x;
  return v;
}

function mouseDown(e, id){
  e.preventDefault();
  dragging = id;
  dragStartRot = rotations[id];
  dragStartScreenW = window.innerWidth;
  dragStartXDeg = mouseX2Deg(e.clientX);
  viewers[id].classList.add("dragSpin");
  document.documentElement.classList.add("draggingCursorOverride");
  velocities[dragging] = 0;
}

function mouseMove(e){
  if(e.buttons == 0 || dragging == null) return;
  e.preventDefault();
  let mx = e.clientX;
  let r = (mouseX2Deg(mx) - dragStartXDeg) * DRAG_MULTIPLIER + dragStartRot;
  setRotation(dragging, r);
  velocities[dragging] = mouseX2Velocity(mx);
}

function mouseUp(e){
  if(dragging == null) return;
  e.preventDefault();
  viewers[dragging].classList.remove("dragSpin");
  dragging = null;
  lastX = null; // reset mouseX2Velocity()
  document.documentElement.classList.remove("draggingCursorOverride");
}

function initViewerPauseBtn(viewer){
  let type = viewer.classList.contains("alex") ? "alex" : "steve";
  let btn = viewerPauseBtns.find(b => b.classList.contains(type));
  btn.addEventListener("click", () => {
    if(viewer.classList.contains("pauseSpin")){
      viewer.classList.remove("pauseSpin");
      btn.classList.remove("pausePressed");
    }else{
      viewer.classList.add("pauseSpin");
      btn.classList.add("pausePressed");
    }
  });
}

export {initViewerRotation};
