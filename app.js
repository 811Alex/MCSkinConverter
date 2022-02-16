import * as C from './modules/conversions.js';
import {initImgUtil, loadFile2Img, saveImg2File, highlightRect} from './modules/img-util.js';
import {addClassDiv, classElemShow} from './modules/dom-util.js';

const debugMode = false;

// Init
var fileElem = document.getElementById("fileElem");
var s2aSButton = document.getElementById("s2aSButton");
var s2aCButton = document.getElementById("s2aCButton");
var a2sFButton = document.getElementById("a2sFButton");
var a2sSButton = document.getElementById("a2sSButton");
var saveButton = document.getElementById("saveButton");
var resetButton = document.getElementById("resetButton");
var show3dSteve = document.getElementById("show3dSteve");
var show3dAlex = document.getElementById("show3dAlex");
var show2dViewer = document.getElementById("show2dViewer");
var skinViewers3D = Array.from(document.getElementsByClassName("skin-viewer-3d"));

// Events
window.addEventListener("load", ready);
fileElem.addEventListener("change", loadFile2Img);
s2aSButton.addEventListener("click", C.s2aS);
s2aCButton.addEventListener("click", C.s2aC);
a2sFButton.addEventListener("click", C.a2sF);
a2sSButton.addEventListener("click", C.a2sS);
saveButton.addEventListener("click", saveImg2File);
resetButton.addEventListener("click", loadFile2Img);
// Viewer visibility
show3dSteve.addEventListener("change", ()=>showViewer("steve",show3dSteve.checked));
show3dAlex.addEventListener("change", ()=>showViewer("alex",show3dAlex.checked));
show2dViewer.addEventListener("change", ()=>showViewer("skin",show2dViewer.checked,false));

// Debug
if(window.location.host.includes("localhost") || debugMode){
  console.log("Debug mode activated!");
  window.highlightRegion = C.highlightRegion;
  window.highlightRect = highlightRect;
}

function ready(){
  const parts = ["head","body","left-arm","right-arm","left-leg","right-leg"];
  const sides = ["top","left","front","right","back","bottom"];
  // Set up the 3D skin viewers
  skinViewers3D.forEach((viewer)=>{
    var pl = addClassDiv(viewer,"player");
    parts.forEach((part)=>{
      var p = addClassDiv(pl,part);
      sides.forEach((side)=>addClassDiv(p,side));
      var a = addClassDiv(p,"accessory");
      sides.forEach((side)=>addClassDiv(a,side));
    })
  });
  // Set viewer visibility
  [show3dSteve,show3dAlex,show2dViewer].forEach((c)=>c.dispatchEvent(new Event("change")));
  initImgUtil();
}

function showViewer(name,show,is3d=true){
  classElemShow(name,show);
  if(!is3d) return;
  classElemShow("separator-steve-alex",show3dSteve.checked && show3dAlex.checked);
  classElemShow("no3d",!(show3dSteve.checked || show3dAlex.checked));
}
