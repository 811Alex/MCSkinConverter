const MIN_SIZE = 64;
const NS_RESIZE_TOP = 10; // pixels from the top to do vertical (instead of horizontal) resize

var show2dViewerContainer = document.getElementById("container-2d-viewer");
var show2dViewer = document.getElementById("skin-viewer-2d");
var show2dViewerResizeCorner = document.getElementById("container-2d-viewer-resize-corner");
var dragging = false;
var dragIsNS = true;
var dragStartMousePos, dragStartContainerSize, dragStartContainerTop;

function initViewerResize(){
  show2dViewerResizeCorner.addEventListener("mousedown", mouseDown);
  window.addEventListener("mousemove", mouseMove);
  window.addEventListener("mouseup", mouseUp);
  setResizeCursor();
}

function mouseDown(e){
  e.preventDefault();
  dragging = true;
  dragIsNS = isNSResize();
  dragStartMousePos = dragIsNS ? e.clientY : e.clientX;
  dragStartContainerSize = show2dViewer.clientWidth;
  dragStartContainerTop = show2dViewerContainer.offsetTop;
  document.documentElement.classList.add(dragIsNS ? "resizeNSCursorOverride" : "resizeEWCursorOverride");
}

function mouseMove(e){
  if(e.buttons == 0 || !dragging) return;
  e.preventDefault();
  let newSize = (dragIsNS ? e.clientY : e.clientX) - dragStartMousePos + dragStartContainerSize;
  show2dViewerContainer.style.height = show2dViewerContainer.style.width = (newSize < MIN_SIZE ? MIN_SIZE : newSize) + "px";
  if(dragStartContainerTop != show2dViewerContainer.offsetTop){ // wrap changed, update cursor & abort
    setResizeCursor();
    stopDrag();
  }
}

function mouseUp(e){
  if(!dragging) return;
  e.preventDefault();
  stopDrag();
}

function stopDrag(){
  dragging = false;
  document.documentElement.classList.remove("resizeEWCursorOverride", "resizeNSCursorOverride");
}

function isNSResize(){  // vertical resize
  return show2dViewerContainer.offsetTop == NS_RESIZE_TOP;
}

function setResizeCursor(){ // update resize corner cursor
  let isNS = isNSResize();
  show2dViewerResizeCorner.classList.add(isNS ? "resizeNSCursor" : "resizeEWCursor");
  show2dViewerResizeCorner.classList.remove(isNS ? "resizeEWCursor" : "resizeNSCursor");
}

export {initViewerResize};
