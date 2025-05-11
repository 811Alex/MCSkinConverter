import {addClassDiv, classElemShow} from './dom-util.js';

const parts = ["head", "body", "left-arm", "right-arm", "left-leg", "right-leg"];
const sides = ["top", "left", "front", "right", "back", "bottom"];

function init3dViewer(viewer){
  var pl = addClassDiv(viewer, "player");
  parts.forEach((part) => {
    var p = addClassDiv(pl, part);
    sides.forEach((side) => addClassDiv(p, side));
    var a = addClassDiv(p, "accessory");
    sides.forEach((side) => addClassDiv(a, side));
  });
}

function showViewer(name, show, is3d=true){
  classElemShow(name, show);
}

export {init3dViewer, showViewer};
