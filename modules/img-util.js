import { classElemEnable, classElemShow, hideSplashText, showHDMode, hintConversion, showLegacyUpgrade } from './dom-util.js'
import { isSteve, upgradeLegacy } from './conversions.js'

var skinViewer2D = document.getElementById("skin-viewer-2d");
var skinViewers3D = Array.from(document.getElementsByClassName("skin-viewer-3d"));
var adjustCheckered = document.getElementById("adjustCheckered");
var fileElem = document.getElementById("fileElem");
var saveButton = document.getElementById("saveButton");
var downloadAnchor = document.createElement("a");
var imgElem = document.createElement("img");
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var skinLoaded = false;
var initialized = false;
var convertedToAlex = false;
var legacyUpgrade = false;

function initImgUtil(){
  skinViewer2D.addEventListener("load", set3dViewerSkin);
  adjustCheckered.addEventListener("change", () => recalcCheckered(!adjustCheckered.checked));
  imgElem.addEventListener("load", loadImg2Canvas);
  imgElem.src = skinViewer2D.src; // init imgElem & canvas by extension
}

function loadFile2Img(){ // load file into img element
  skinLoaded = false;
  legacyUpgrade = false;
  convertedToAlex = false;
  classElemEnable("ActionBtn", false);
  classElemEnable("procBtn", false);
  classElemShow("procBtnHD", false);
  hideSplashText();
  let file = fileElem.files[0];
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => skinViewer2D.src = imgElem.src = reader.result;
}

function forceLoadImg2Canvas(heightOverride=null, widthOverride=null){
  canvas.width = widthOverride ?? imgElem.width;
  canvas.height = heightOverride ?? imgElem.height;
  ctx.drawImage(imgElem, 0, 0);
}

function loadImg2Canvas(){
  if(initialized){
    if(!hasSkin()) return;
    if(isValidSkin()){
      if(isLegacy()){
        forceLoadImg2Canvas(imgElem.width); // expand height to match width
        legacyUpgrade = true;
        upgradeLegacy();
        return; // upgradeLegacy() will trigger this function again when done
      }else forceLoadImg2Canvas();
      if(!skinLoaded){
        let hd = isHD();
        showHDMode(hd);
        if(adjustCheckered.checked) recalcCheckered();
        if(legacyUpgrade) saveButton.disabled = false;
        showLegacyUpgrade(legacyUpgrade);
        classElemEnable("procBtn");
        classElemShow("procBtnHD", hd);
        hintConversion(isSteve());
        skinLoaded = true;
      }
    }else{
      fileElem.value = null;
      alert("Invalid skin!");
    }
  }else{
    forceLoadImg2Canvas();
    initialized = true;
  }
}

function loadCanvas2Img(){
  skinViewer2D.src = imgElem.src = canvas.toDataURL("image/jpg", 0);
}

function set3dViewerSkin(){ // set 3D viewer skins to be the same as the 2D viewer
  if(!hasSkin() || !isValidSkin()) return;
  skinViewers3D.forEach((viewer) =>
      viewer.querySelectorAll("*").forEach((c) =>
          c.style.backgroundImage = "url(" + skinViewer2D.src + ")"));
}

function saveImg2File(){ // save data as file
  let filename = fileElem.files[0].name.split('.').slice(0, -1).join('.') + "-" + (convertedToAlex ? "Alex" : "Steve") + ".png";  // append "-converted" before extension
  downloadAnchor.href = canvas.toDataURL();
  downloadAnchor.download = filename;
  downloadAnchor.click();
}

function hasSkin(){
  return fileElem.files.length > 0;
}

function recalcCheckered(reset=false){
  if(!hasSkin()) return;
  let pos = reset ? 1.5625 : 100/imgElem.width;
  let size = reset ? 3.125 : 2*pos;
  skinViewer2D.style.backgroundSize = size + "% " + size + "%";
  skinViewer2D.style.backgroundPosition = "0 0, " + pos + "% " + pos + "%";
}

function getRatio(){
  return imgElem.width / imgElem.height;
}

function getRatioToBase(){  // get loaded image width to normal skin width (64) ratio
  return imgElem.width / 64;
}

function isValidSkin(){
  let r = getRatio();
  return (r == 1 || r == 2) && getRatioToBase() % 1 == 0;
}

function isLegacy(){
  return getRatio() == 2;
}

function isHD(){
  return getRatioToBase() > 1;
}

function ratioAdjust(arr, ratio=-1){  // pixel region array, adjusted for skin ratio
  if(ratio < 0) ratio = getRatioToBase();
  return arr.map(r => r.map(e => e*ratio));
}

function processImg(func, ci=[], isToAlex=false, isProc=true){  // execute necessary code before & after the specified image processing function (the function will recieve the skin ratio and ratio adjusted ci)
  saveButton.value = "Processing...";
  let ratio = getRatioToBase();
  func(ratio, ratioAdjust(ci, ratio));
  loadCanvas2Img();
  saveButton.value = "Save";
  if(!isProc) return; // automatic process - not triggered by user selection
  convertedToAlex = isToAlex;
  classElemEnable("procBtn", false);
  classElemEnable("ActionBtn", hasSkin());
}

function canvasCopy(c){
  let n = document.createElement("canvas");
  n.width = c.width;
  n.height = c.height;
  n.getContext("2d").drawImage(c, 0, 0);
  return n;
}

function clearRect(x, y, w, h){
  ctx.clearRect(x, y, w, h);
}

function flipRect(x, y, w, h, flipH=false, flipV=false){
  let fCanvas = canvasCopy(canvas);
  let mx = flipH ? -1 : 1;
  let my = flipV ? -1 : 1;
  clearRect(x, y, w, h);
  ctx.save();
  ctx.scale(mx, my);
  ctx.drawImage(fCanvas, x, y, w, h, x * mx, y * my, w * mx, h * my);
  ctx.restore();
}

function moveRect(sx, sy, sw, sh, x, y, w=-1, h=-1, copyMode=false){ // move/stretch image region
  let oldCanvas = canvasCopy(canvas);
  if(!copyMode) clearRect(sx, sy, sw, sh);
  w = w<0 ? sw : w;
  h = h<0 ? sh : h;
  clearRect(x, y, w, h);
  ctx.drawImage(oldCanvas, sx, sy, sw, sh, x, y, w, h); // draw from original
}

function shiftRect(x, y, w, h, pixelsToMove, copyMode=false){ // shift rectangle of pixels on the x axis (use negative pixelsToMove to shift left)
  moveRect(x, y, w, h, x+pixelsToMove, y, -1, -1, copyMode);
}

function redrawRect(x, y, w, h){
  moveRect(x, y, w, h, x, y);
}

function highlightRect(x, y, w, h, s=19){ // highlight region (for debugging)
  processImg(() => {
    ctx.filter = "invert(1)";
    redrawRect(x, y, w, h);
    ctx.filter = "none";
    if(s > 0) setTimeout(() => highlightRect(x, y, w, h, s-1), 250);
  });
}

function isEmptyRect(x, y, w, h){
  let data = ctx.getImageData(x, y, w, h).data;
  for(let i = 3; i < data.length; i += 4)
    if(data[i] > 0) return false;
  return true;
}

export {initImgUtil, loadFile2Img, loadImg2Canvas, loadCanvas2Img, saveImg2File, getRatio, getRatioToBase, isValidSkin, isLegacy, isHD, ratioAdjust, processImg, canvasCopy, clearRect, flipRect, moveRect, shiftRect, redrawRect, highlightRect, isEmptyRect};
