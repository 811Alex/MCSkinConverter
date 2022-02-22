import * as C from './modules/conversions.js';
import {initImgUtil, loadFile2Img, saveImg2File, highlightRect} from './modules/img-util.js';
import {addClassDiv, classElemShow, addListener, hideSplashText} from './modules/dom-util.js';
import {initViewerRotation} from './modules/viewer-rotation.js';
import {initViewerResize} from './modules/2d-viewer-resize.js';

const DEBUG_MODE = false;

// Init
var show3dSteve = document.getElementById("show3dSteve");
var show3dAlex = document.getElementById("show3dAlex");
var show2dViewer = document.getElementById("show2dViewer");
var skinViewers3D = Array.from(document.getElementsByClassName("skin-viewer-3d"));

// Events
window.addEventListener("load", ready);
addListener("fileElem", "change", loadFile2Img);
addListener("s2aSButton", "click", C.s2aS);
addListener("s2aCButton", "click", C.s2aC);
addListener("s2aSHDButton", "click", C.s2aSHD);
addListener("s2aSFHDButton", "click", C.s2aSFHD);
addListener("a2sFButton", "click", C.a2sF);
addListener("a2sSButton", "click", C.a2sS);
addListener("a2sCButton", "click", C.a2sC);
addListener("a2sSHDButton", "click", C.a2sSHD);
addListener("a2sSFHDButton", "click", C.a2sSFHD);
addListener("saveButton", "click", saveImg2File);
addListener("resetButton", "click", loadFile2Img);
addListener("splash-text", "mouseover", hideSplashText);
// Viewer visibility
show3dSteve.addEventListener("change", () => showViewer("steve", show3dSteve.checked));
show3dAlex.addEventListener("change", () => showViewer("alex", show3dAlex.checked));
show2dViewer.addEventListener("change", () => showViewer("skin", show2dViewer.checked, false));

// Debug
if(window.location.host.includes("localhost") || DEBUG_MODE){
  console.log("Debug mode activated!");
  window.highlightRegion = C.highlightRegion;
  window.highlightRect = highlightRect;
}

function ready(){
  const parts = ["head", "body", "left-arm", "right-arm", "left-leg", "right-leg"];
  const sides = ["top", "left", "front", "right", "back", "bottom"];
  // Set up the 3D skin viewers
  skinViewers3D.forEach((viewer) => {
    var pl = addClassDiv(viewer, "player");
    parts.forEach((part) => {
      var p = addClassDiv(pl, part);
      sides.forEach((side) => addClassDiv(p, side));
      var a = addClassDiv(p, "accessory");
      sides.forEach((side) => addClassDiv(a, side));
    })
  });
  initViewerRotation(...skinViewers3D);
  initViewerResize();
  // Set viewer visibility
  [show3dSteve, show3dAlex, show2dViewer].forEach((c) => c.dispatchEvent(new Event("change")));
  initImgUtil();
}

function showViewer(name, show, is3d=true){
  classElemShow(name, show);
  if(!is3d) return;
  classElemShow("separator-steve-alex", show3dSteve.checked && show3dAlex.checked);
  classElemShow("no3d", !(show3dSteve.checked || show3dAlex.checked));
}
