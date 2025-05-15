import {addClassDiv, classElemShow} from './dom-util.js';
import { randBool, randWUnit } from './util.js';

const parts = ["head", "body", "left-arm", "right-arm", "left-leg", "right-leg"];
const sides = ["top", "left", "front", "right", "back", "bottom"];
var visibilityCheckboxes = document.getElementById("viewer-visibility");
const SPINNY_MIN = 8;
const SPINNY_MAX = 12;

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
  let checked = visibilityCheckboxes.querySelectorAll(":checked");
  if(checked.length == 1) checked[0].disabled = true;
  else checked.forEach(c => c.disabled = false);
}

function initSpinny(spinny){
  for(let i = 0; i < SPINNY_MAX; i++)
    addClassDiv(spinny, '').innerText = "SPINNY";
}

function randomizeSpinny(){
  let hiddenNum = randWUnit('', SPINNY_MAX - SPINNY_MIN);
  let els = [...spinny.children];
  els.slice(0, hiddenNum).forEach(el => el.classList.add("hidden"));
  els.slice(hiddenNum).map(el => {
    el.classList.remove("hidden");
    return el.style;
  }).forEach(s => {
    s.top = s.bottom = s.left = s.right = null;
    s[randBool() ? "top" : "bottom"] = randWUnit('%', 50, 1);
    s[randBool() ? "left" : "right"] = randWUnit('%', 50, 1);
    s.animationDirection = randBool() ? "normal" : "reverse";
    s.animationDuration = randWUnit('ms', 850, 350);
    s.fontSize = randWUnit('rem', 1.7, 1.2, true);
    s.setProperty('--hue', randWUnit('', 360));
  });
}

export {init3dViewer, showViewer, initSpinny, randomizeSpinny};
