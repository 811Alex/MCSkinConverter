import {ratioAdjust, processImg, clearRect, shiftRect, highlightRect} from './img-util.js'

// Conversion intructions
const CI = [
  [55,16,1,32], // right arm, last column, back
  [51,16,1,4],  // right arm, last column, bottom, main layer
  [51,32,1,4],  // right arm, last column, bottom, second layer
  [47,16,8,32], // right arm, big middle region
  [63,48,1,16], // left arm, last column, back, second layer
  [59,48,1,4],  // left arm, last column, bottom, second layer
  [55,48,8,16], // left arm, big middle region, second layer
  [47,48,1,16], // left arm, last column, back, main layer
  [43,48,1,4],  // left arm, last column, bottom, main layer
  [39,48,8,16]  // left arm, big middle region, main layer
];

// Arm regions
const ARM = [
  [40,16,16,16],  // right arm, main layer
  [40,32,16,16],  // right arm, second layer
  [32,48,16,16],  // left arm, main layer
  [48,48,16,16],  // left arm, second layer
];

function highlightRegion(i){ // highlight region (for debugging)
  let r = ratioAdjust(CI)[i];
  highlightRect(r[0],r[1],r[2],r[3]);
}

function commonShift(ins, dx, dw, pixelsToMove, copyMode=false, reverseOrder=false){
  if(reverseOrder) ins = ins.slice().reverse(); // using slice to work on a copy
  ins.forEach((v)=>shiftRect(v[0]+dx,v[1],v[2]+dw,v[3],pixelsToMove,copyMode));
}

function s2aS(){ // convert Steve to Alex (squeeze)
  processImg((ratio, aCI)=>commonShift(aCI,0,0,-ratio), CI); // Shift pixels
}

function s2aC(){ // convert Steve to Alex (cut)
  processImg((ratio, aCI)=>{
    commonShift(aCI.filter((v)=>v[2]>ratio),ratio,-ratio,-ratio);  // Shift pixels
    aCI.filter((v)=>v[2]==ratio).forEach((v)=>clearRect(v[0]-ratio,v[1],v[2]+ratio,v[3]));  // Cleanup
  }, CI);
}

function a2sF(){ // convert Alex to Steve (fill)
  processImg((ratio, aCI)=>commonShift(aCI,-ratio,0,ratio,true,true), CI); // Shift pixels, starting from left to right
}

function a2sS(){ // convert Alex to Steve (stretch)
  processImg((ratio, aCI)=>commonShift(aCI,-2*ratio,ratio,ratio,true,true), CI); // Shift pixels, starting from left to right
}

function a2sC(){ // convert Alex to Steve (circular)
  processImg((ratio, aCI)=>{
    aCI.slice().reverse().forEach((v)=>{
      if(v[2]>ratio) shiftRect(v[0],v[1],v[2]-ratio,v[3],ratio);  // shift pixels
      else{ // copy pixels
        shiftRect(v[0]-3*ratio,v[1],v[2],v[3],3*ratio,true);
        shiftRect(v[0]-(v[3]>4*ratio?11:7)*ratio,v[1],v[2],v[3],3*ratio,true);
      }
    });
  }, CI);
}

export {highlightRegion, s2aS, s2aC, a2sF, a2sS, a2sC};
