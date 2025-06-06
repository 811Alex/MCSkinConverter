import * as C from './modules/conversions.js';
import { initImgUtil, loadFile2Img, saveImg2File, highlightRect } from './modules/img-util.js';
import { addListener, hideSplashText } from './modules/dom-util.js';
import { init3dViewer, initSpinny, showViewer } from './modules/viewer.js';
import { initViewerRotation } from './modules/viewer-rotation.js';
import { initViewerResize } from './modules/2d-viewer-resize.js';

const DEBUG_MODE = false;

// Init
var spinny = document.getElementById("spinny");
var show3dSteve = document.getElementById("show3dSteve");
var show3dAlex = document.getElementById("show3dAlex");
var show2dViewer = document.getElementById("show2dViewer");
var skinViewers3D = Array.from(document.getElementsByClassName("skin-viewer-3d"));
var adjustCheckered = document.getElementById("adjustCheckered");

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
show2dViewer.addEventListener("change", () => {
  showViewer("skin", show2dViewer.checked, false);
  adjustCheckered.disabled = !show2dViewer.checked;
});

// Debug
if(window.location.host.includes("localhost") || DEBUG_MODE){
  console.log("Debug mode activated!");
  window.highlightRegion = C.highlightRegion;
  window.highlightRect = highlightRect;
}

function ready(){
  skinViewers3D.forEach(init3dViewer);  // Set up the 3D skin viewers
  skinViewers3D.forEach(initViewerRotation);
  initViewerResize();
  [show3dSteve, show3dAlex, show2dViewer].forEach((c) => c.dispatchEvent(new Event("change"))); // Set viewer visibility
  initImgUtil();
  initSpinny(spinny);
}