import {processImg, clear, shift} from './img-util.js'

// Conversion intructions
const CI = [
  [55,16,1,32], // region #1
  [51,16,1,4],
  [51,32,1,4],
  [47,16,8,32],
  [63,48,1,16], // region #2
  [59,48,1,4],
  [55,48,8,16],
  [47,48,1,16], // region #3
  [43,48,1,4],
  [39,48,8,16]
];

function s2aS(){ // convert Steve to Alex (squeeze)
  processImg(()=>CI.forEach((v)=>shift(v[0],v[1],v[2],v[3],-1))); // Shift pixels
}

function s2aC(){ // convert Steve to Alex (cut)
  processImg(()=>{
    CI.forEach((v)=>{ // Shift pixels
      if(v[2]>1) shift(v[0]+1,v[1],v[2]-1,v[3],-1);
    });
    CI.forEach((v)=>{ // Cleanup
      if(v[2]==1) clear(v[0]-1,v[1],v[2]+1,v[3]);
    });
  });
}

function a2sF(){ // convert Alex to Steve (fill)
  processImg(()=>CI.slice().reverse().forEach((v)=>shift(v[0]-1,v[1],v[2],v[3],1,true))); // Shift pixels, starting from left to right (using slice to work on a copy)
}

function a2sS(){ // convert Alex to Steve (stretch)
  processImg(()=>CI.slice().reverse().forEach((v)=>shift(v[0]-2,v[1],v[2]+1,v[3],1,true))); // Shift pixels, starting from left to right (using slice to work on a copy)
}

export {s2aS, s2aC, a2sF, a2sS};
