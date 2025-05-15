import { getRatioToBase, ratioAdjust, processImg, clearRect, moveRect, shiftRect, highlightRect, isEmptyRect, flipRect } from './img-util.js'

// Conversion instructions (x, y, w, h)
const CI = [
  [55, 16, 1, 32], // right arm, last column, back
  [51, 16, 1, 4],  // right arm, last column, bottom, main layer
  [51, 32, 1, 4],  // right arm, last column, bottom, second layer
  [47, 16, 8, 32], // right arm, big middle region
  [63, 48, 1, 16], // left arm, last column, back, second layer
  [59, 48, 1, 4],  // left arm, last column, bottom, second layer
  [55, 48, 8, 16], // left arm, big middle region, second layer
  [47, 48, 1, 16], // left arm, last column, back, main layer
  [43, 48, 1, 4],  // left arm, last column, bottom, main layer
  [39, 48, 8, 16]  // left arm, big middle region, main layer
];

// Arm FBLR regions (x, y, w, h)
const FBLR = [
  [40, 20, 16, 12],  // right arm, main layer
  [40, 36, 16, 12],  // right arm, second layer
  [32, 52, 16, 12],  // left arm, main layer
  [48, 52, 16, 12]   // left arm, second layer
];

// Arm top & bottom regions (x, y, w, h)
const TB = [
  [44, 16, 8, 4],    // right arm, main layer
  [44, 32, 8, 4],    // right arm, second layer
  [36, 48, 8, 4],    // left arm, main layer
  [52, 48, 8, 4]     // left arm, second layer
];

// Arm front & back regions (x, y, w, h, isBack)
const FB = [
  [52, 20, 4, 12, true],    // right arm, main layer, back
  [44, 20, 4, 12, false],   // right arm, main layer, front
  [52, 36, 4, 12, true],    // right arm, second layer, back
  [44, 36, 4, 12, false],   // right arm, second layer, front
  [44, 52, 4, 12, true],    // left arm, main layer, back
  [36, 52, 4, 12, false],   // left arm, main layer, front
  [60, 52, 4, 12, true],    // left arm, second layer, back
  [52, 52, 4, 12, false]    // left arm, second layer, front
];

// Leg FBLR regions (x, y, w, h)
const LEGS = [
  [0,  16, 16, 16], // right leg, main layer
  [0,  32, 16, 16], // right leg, second layer
  [16, 48, 16, 16], // left leg, main layer
  [0,  48, 16, 16]  // left leg, second layer
];

// Legacy skin upgrade mirroring instructions (x, y, w, h) - left leg rectangles, offset for left arm
const MI = [
  [20, 48, 4, 4],   // top
  [24, 48, 4, 4],   // bottom
  [28, 52, 4, 12],  // back
  [16, 52, 12, 12]  // left + front + right
];

const LA_LL_X_OFFSET = 16; // left arm offset relative to left leg

const g4 = a => a.slice(0, 4);

function highlightRegion(i){ // highlight region (for debugging)
  highlightRect(...g4(ratioAdjust(CI)[i]));
}

function commonShift(ins, dx, dw, pixelsToMove, copyMode=false, reverseOrder=false){
  if(reverseOrder) ins = ins.slice().reverse(); // using slice to work on a copy
  ins.forEach((v) => shiftRect(v[0]+dx, v[1], v[2]+dw, v[3], pixelsToMove, copyMode));
}

function isSteve(){
  let ratio = getRatioToBase();
  return ratioAdjust(FBLR.concat(TB), ratio).find((v) => !isEmptyRect(v[0]+v[2]-ratio, v[1], ratio, v[3]));
}

function s2aS(){ // convert Steve to Alex (squeeze)
  processImg((ratio, aCI) => commonShift(aCI, 0, 0, -ratio), CI, true); // Shift pixels
}

function s2aC(){ // convert Steve to Alex (cut)
  processImg((ratio, aCI) => {
    commonShift(aCI.filter((v) => v[2]>ratio), ratio, -ratio, -ratio);                             // Shift pixels
    aCI.filter((v) => v[2]==ratio).forEach((v) => clearRect(v[0]-ratio, v[1], v[2]+ratio, v[3]));  // Cleanup
  }, CI, true);
}

function s2aSFHD(){  // convert Steve to Alex (HD squeeze full)
  processImg((ratio, aARM) => aARM.forEach((v) => moveRect(...g4(v), v[0], v[1], v[2]-2*ratio)), FBLR.concat(TB), true);
}

function s2aSHD(){  // convert Steve to Alex (HD squeeze)
  processImg((ratio, aARM) => aARM.forEach((v) => {
    moveRect(...g4(v), v[0], v[1], v[2]-ratio*(v[3]>4*ratio ? 1 : 2));                         // Squeeze region
    if(v.length>4 && v[4]) shiftRect(v[0]-4*ratio, v[1], v[2]+4*ratio, v[3], -ratio, false);   // Shift pixels
  }), FB.concat(TB).slice().reverse(), true);
}

function a2sF(){ // convert Alex to Steve (fill)
  processImg((ratio, aCI) => commonShift(aCI, -ratio, 0, ratio, true, true), CI); // Shift pixels, starting from left to right
}

function a2sS(){ // convert Alex to Steve (stretch)
  processImg((ratio, aCI) => commonShift(aCI, -2*ratio, ratio, ratio, true, true), CI); // Shift pixels, starting from left to right
}

function a2sC(){ // convert Alex to Steve (circular)
  processImg((ratio, aCI) => aCI.slice().reverse().forEach((v) => {
    if(v[2]>ratio) shiftRect(v[0], v[1], v[2]-ratio, v[3], ratio);  // shift pixels
    else{ // copy pixels
      shiftRect(v[0]-3*ratio, v[1], v[2], v[3], 3*ratio, true);
      shiftRect(v[0]-(v[3]>4*ratio ? 11 : 7)*ratio, v[1], v[2], v[3], 3*ratio, true);
    }
  }), CI);
}

function a2sSFHD(){  // convert Alex to Steve (HD stretch full)
  processImg((ratio, aARM) => aARM.forEach((v) => moveRect(v[0], v[1], v[2]-2*ratio, v[3], ...g4(v))), FBLR.concat(TB));
}

function a2sSHD(){  // convert Alex to Steve (HD stretch)
  processImg((ratio, aARM) => aARM.forEach((v) => {
    if(v.length>4 && v[4]) shiftRect(v[0]-5*ratio, v[1], v[2]+3*ratio, v[3], ratio, false);  // Shift pixels
    moveRect(v[0], v[1], v[2]-ratio*(v[3]>4*ratio ? 1 : 2), v[3], ...g4(v));                 // Stretch region
  }), FB.concat(TB));
}

function upgradeLegacy(){
  processImg((ratio, ALM) => {
    ALM.forEach((r, k, a) => {if(k % 2 == 0) moveRect(...g4(r), ...g4(a[k + 1]), true);});  // for right parts, copy to matching left parts
    ratioAdjust(MI.concat(MI.map(r => [r[0] + LA_LL_X_OFFSET, ...(r.slice(1, 4))])), ratio).forEach(r => flipRect(...g4(r), true)); // mirror left arm & leg parts
  }, TB.concat(FBLR).concat(LEGS).filter((_, k) => k % 2 == 0), false, false);  // grab main layer arm & leg parts
}

export {highlightRegion, isSteve, s2aS, s2aC, s2aSFHD, s2aSHD, a2sF, a2sS, a2sC, a2sSFHD, a2sSHD, upgradeLegacy};
