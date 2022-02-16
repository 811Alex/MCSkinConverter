import {classElemEnable} from './dom-util.js'

var skinViewer2D = document.getElementById("skin-viewer-2d");
var skinViewers3D = Array.from(document.getElementsByClassName("skin-viewer-3d"));
var fileElem = document.getElementById("fileElem");
var saveButton = document.getElementById("saveButton");
var downloadAnchor = document.createElement("a");
var imgElem = document.createElement("img");
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

skinViewer2D.addEventListener("load", set3dViewerSkin);
imgElem.addEventListener("load", loadImg2Canvas);

function initImgUtil(){
  loadImg2Canvas(); // init canvas
  imgElem.src = skinViewer2D.src; // init imgElem, only required when debugging
}

function loadFile2Img(){ // load file into img element
  let file = fileElem.files[0];
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = ()=>skinViewer2D.src = imgElem.src = reader.result;
  classElemEnable("procBtn");
  classElemEnable("ActionBtn",false);
}

function loadImg2Canvas(){
  canvas.width = imgElem.width;
  canvas.height = imgElem.height;
  ctx.drawImage(imgElem,0,0);
}

function loadCanvas2Img(){
  skinViewer2D.src = imgElem.src = canvas.toDataURL();
}

function set3dViewerSkin(){ // set 3D viewer skins to be the same as the 2D viewer
  if(fileElem.files.length == 0) return;
  skinViewers3D.forEach((viewer)=>{
    viewer.querySelectorAll("*").forEach((c)=>{
      c.style.backgroundImage = "url("+skinViewer2D.src+")";
    })
  });
}

function saveImg2File(){ // save data as file
  let filename = fileElem.files[0].name.split('.').slice(0, -1).join('.')+"-converted.png"  // append "-converted" before extension
  downloadAnchor.href = canvas.toDataURL();
  downloadAnchor.download = filename;
  downloadAnchor.click();
}

function processImg(func){  // execute necessary code before & after the specified image processing function
  saveButton.value="Processing...";
  func();
  loadCanvas2Img();
  saveButton.value="Save";
  classElemEnable("procBtn",false);
  classElemEnable("ActionBtn");
}

function canvasCopy(c){
  let n = document.createElement("canvas");
  n.getContext("2d").drawImage(c, 0, 0);
  return n;
}

function clearRect(x,y,w,h){
  ctx.clearRect(x,y,w,h);
}

function moveRect(sx,sy,sw,sh,x,y,w=-1,h=-1,copyMode=false){ // move/stretch image region
  let oldCanvas = canvasCopy(canvas);
  if(!copyMode) ctx.clearRect(sx,sy,sw,sh);
  w = w<0 ? sw : w;
  h = h<0 ? sh : h;
  ctx.drawImage(oldCanvas,sx,sy,sw,sh,x,y,w,h); // draw from original
}

function shiftRect(x,y,w,h,pixelsToMove,copyMode=false){ // shift rectangle of pixels on the x axis (use negative pixelsToMove to shift left)
  moveRect(x,y,w,h,x+pixelsToMove,y,-1,-1,copyMode);
}

function redrawRect(x,y,w,h){
  moveRect(x,y,w,h,x,y);
}

function highlightRect(x,y,w,h,s=19){ // highlight region (for debugging)
  processImg(()=>{
    ctx.filter = "invert(1)";
    redrawRect(x,y,w,h);
    ctx.filter = "none";
    if(s>0) setTimeout(()=>highlightRect(x,y,w,h,s-1),250);
  });
}

export {initImgUtil, loadFile2Img, loadImg2Canvas, loadCanvas2Img, saveImg2File, processImg, canvasCopy, clearRect, moveRect, shiftRect, redrawRect, highlightRect};
