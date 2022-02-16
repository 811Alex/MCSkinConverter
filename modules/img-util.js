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

function loadFile2Img(file){ // load file into img element
  var file = fileElem.files[0];
  var reader = new FileReader();
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
  skinViewers3D.forEach((viewer)=>{
    viewer.querySelectorAll("*").forEach((c)=>{
      c.style.backgroundImage = "url("+skinViewer2D.src+")";
    })
  });
}

function saveImg2File(){ // save data as file
  var filename = fileElem.files[0].name.split('.').slice(0, -1).join('.')+"-converted.png"  // append "-converted" before extension
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

function clear(x,y,w,h){
  ctx.clearRect(x,y,w,h);
}

function shift(x,y,w,h,pixelsToMove,copyMode=false){ // shift rectangle of pixels on the x axis (use negative pixelsToMove to shift left)
  var clearx = x-pixelsToMove + ((pixelsToMove<0) ? w-1 : 1); // where we should clear when we're done (changes according to shift direction)
  var data = ctx.getImageData(x,y,w,h);
  ctx.putImageData(data,x+pixelsToMove,y);
  if(!copyMode) ctx.clearRect(clearx,y,pixelsToMove,h);  // clear what's left of the old rectangle
}

export {loadFile2Img, loadImg2Canvas, loadCanvas2Img, saveImg2File, processImg, clear, shift};
