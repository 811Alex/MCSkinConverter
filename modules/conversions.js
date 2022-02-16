import {processImg, clearRect, shiftRect, highlightRect} from './img-util.js'

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

function highlightRegion(i){ // highlight region (for debugging)
  var r = CI[i];
  highlightRect(r[0],r[1],r[2],r[3]);
}

function s2aS(){ // convert Steve to Alex (squeeze)
  processImg(()=>CI.forEach((v)=>shiftRect(v[0],v[1],v[2],v[3],-1))); // Shift pixels
}

function s2aC(){ // convert Steve to Alex (cut)
  processImg(()=>{
    CI.forEach((v)=>{ // Shift pixels
      if(v[2]>1) shiftRect(v[0]+1,v[1],v[2]-1,v[3],-1);
    });
    CI.forEach((v)=>{ // Cleanup
      if(v[2]==1) clearRect(v[0]-1,v[1],v[2]+1,v[3]);
    });
  });
}

function a2sF(){ // convert Alex to Steve (fill)
  processImg(()=>CI.slice().reverse().forEach((v)=>shiftRect(v[0]-1,v[1],v[2],v[3],1,true))); // Shift pixels, starting from left to right (using slice to work on a copy)
}

function a2sS(){ // convert Alex to Steve (stretch)
  processImg(()=>CI.slice().reverse().forEach((v)=>shiftRect(v[0]-2,v[1],v[2]+1,v[3],1,true))); // Shift pixels, starting from left to right (using slice to work on a copy)
}

export {highlightRegion, s2aS, s2aC, a2sF, a2sS};
