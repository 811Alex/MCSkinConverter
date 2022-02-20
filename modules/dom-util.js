var splashText = document.getElementById("splash-text");
var hdMode = document.getElementById("HDMode");

function addClassDiv(node, className){ // add div element to node, with a specified class
  var child = document.createElement("div");
  child.className = className;
  node.appendChild(child);
  return child;
}

function classElemEnable(className, enabled=true){ // enables / disables elements of a class
  Array.from(document.getElementsByClassName(className)).forEach((b) => b.disabled = !enabled);
}

function classElemShow(className, show=true){  // enables / disables visibility of elements of a class
  Array.from(document.getElementsByClassName(className)).forEach((t) => {
    var c = t.classList;
    if(show) c.remove("hidden");
    else c.add("hidden");
  });
}

function addListener(elemId, eventType, listener){
  document.getElementById(elemId).addEventListener(eventType, listener);
}

function hideSplashText(){
  splashText.classList.add("hidden");
}

function showHDMode(show){
  hdMode.classList = show ? "" : "invisible";
}

export {addClassDiv, classElemEnable, classElemShow, addListener, hideSplashText, showHDMode};
