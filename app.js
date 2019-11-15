;(()=>{
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
  // Init
  var fileElem = document.getElementById("fileElem");
  var imgElem = document.getElementById("imgElem");
  var imgMon = document.getElementById("imgMon");
  var s2aSButton = document.getElementById("s2aSButton");
  var s2aCButton = document.getElementById("s2aCButton");
  var a2sFButton = document.getElementById("a2sFButton");
  var a2sSButton = document.getElementById("a2sSButton");
  var saveButton = document.getElementById("saveButton");
  var resetButton = document.getElementById("resetButton");
  var downloadAnchor = document.getElementById("downloadAnchor");
  var viewers = { // 3D Skin Viewers
    "steve":document.getElementById("skin-viewer-3d-steve"),
    "alex":document.getElementById("skin-viewer-3d-alex")
  };
  //var canvas = document.getElementById("canvas");
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  // Events
  window.addEventListener("load", ready);
  fileElem.addEventListener("change", loadFile2Img);
  imgElem.addEventListener("load", loadImg2Canvas);
  imgMon.addEventListener("load", set3dViewerSkin);
  s2aSButton.addEventListener("click", s2aS);
  s2aCButton.addEventListener("click", s2aC);
  a2sFButton.addEventListener("click", a2sF);
  a2sSButton.addEventListener("click", a2sS);
  saveButton.addEventListener("click", saveImg2File);
  resetButton.addEventListener("click", loadFile2Img);

  function ready(){
    const parts = ["head","body","left-arm","right-arm","left-leg","right-leg"];
    const sides = ["top","left","front","right","back","bottom"];
    // Set up the 3D skin viewers
    Object.values(viewers).forEach((viewer)=>{
      var pl = addClassDiv(viewer,"player");
      parts.forEach((part)=>{
        var p = addClassDiv(pl,part);
        sides.forEach((side)=>addClassDiv(p,side));
        var a = addClassDiv(p,"accessory");
        sides.forEach((side)=>addClassDiv(a,side));
      })
    });
    loadImg2Canvas(); // init canvas
  }

  function addClassDiv(node, className){ // add div element to node, with a specified class
    var child = document.createElement("div");
    child.className = className;
    node.appendChild(child);
    return child;
  }

  function set3dViewerSkin(){ // set 3D viewer skins to be the same as the 2D viewer (imgMon)
    Object.values(viewers).forEach((viewer)=>{
      viewer.querySelectorAll("*").forEach((c)=>{
        c.style.backgroundImage = "url("+imgMon.src+")";
      })
    });
  }

  function classElemEnable(className,enabled=true){ // enables / disables elements of a class
    Array.from(document.getElementsByClassName(className)).forEach((b)=>b.disabled=!enabled);
  }

  function loadFile2Img(file){ // load file into img element
    var file = fileElem.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = ()=>imgMon.src = imgElem.src = reader.result;
    classElemEnable("procBtn");
    classElemEnable("ActionBtn",false);
  }

  function loadImg2Canvas(){
    canvas.width = imgElem.width;
    canvas.height = imgElem.height;
    ctx.drawImage(imgElem,0,0);
  }

  function loadCanvas2Img(){
    imgMon.src = imgElem.src = canvas.toDataURL();
  }

  function s2aS(){ // convert Steve to Alex (squeeze)
    processImg(()=>CI.forEach((v)=>shift(v[0],v[1],v[2],v[3],-1))); // Shift pixels
  }

  function s2aC(){ // convert Steve to Alex (cut)
    processImg(()=>{
      CI.forEach((v)=>{ // Shift pixels
        if(v[2]>1) shift(v[0]+1,v[1],v[2]-1,v[3],-1);
      });
      CI.forEach((v)=>{ // Cleanup
        if(v[2]==1) ctx.clearRect(v[0]-1,v[1],v[2]+1,v[3]);
      });
    });
  }

  function a2sF(){ // convert Alex to Steve (fill)
    processImg(()=>CI.slice().reverse().forEach((v)=>shift(v[0]-1,v[1],v[2],v[3],1,true))); // Shift pixels, starting from left to right (using slice to work on a copy)
  }

  function a2sS(){ // convert Alex to Steve (stretch)
    processImg(()=>CI.slice().reverse().forEach((v)=>shift(v[0]-2,v[1],v[2]+1,v[3],1,true))); // Shift pixels, starting from left to right (using slice to work on a copy)
  }

  function processImg(func){  // execute necessary code before & after the specified image processing function
    saveButton.value="Processing...";
    func();
    loadCanvas2Img();
    saveButton.value="Save";
    classElemEnable("procBtn",false);
    classElemEnable("ActionBtn");
  }

  function shift(x,y,w,h,pixelsToMove,copyMode=false){ // shift rectangle of pixels on the x axis (use negative pixelsToMove to shift left)
    var clearx = x-pixelsToMove + ((pixelsToMove<0) ? w-1 : 1); // where we should clear when we're done (changes according to shift direction)
    var data = ctx.getImageData(x,y,w,h);
    ctx.putImageData(data,x+pixelsToMove,y);
    if(!copyMode) ctx.clearRect(clearx,y,pixelsToMove,h);  // clear what's left of the old rectangle
  }

  function saveImg2File(){ // save data as file
    downloadAnchor.href = canvas.toDataURL();
    downloadAnchor.click();
  }
})();
