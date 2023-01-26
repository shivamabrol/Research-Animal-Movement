//map working

var svgPanZoom = $("svg#map").svgPanZoom();
// zoomFactor: number (0.25)
svgPanZoom.events.mouseWheel = false;
svgPanZoom.events.doubleClick = false;
// svgPanZoom.events.drag = false;

document.getElementById("reset").addEventListener("click", function () {
  // code to be executed when button is clicked
  svgPanZoom.reset();
  console.log(svgPanZoom.getViewBox());
});

document.getElementById("zoom-in").addEventListener("click", function () {
  // code to be executed when button is clicked

  svgPanZoom.zoomIn(1);
  // Get the image element
  console.log(svgPanZoom.getViewBox());
});

document.getElementById("zoom-out").addEventListener("click", function () {
  // code to be executed when button is clicked
  svgPanZoom.zoomOut(1);
  console.log(svgPanZoom.getViewBox());
});

document.getElementById("left").addEventListener("click", function () {
  // code to be executed when button is clicked
  svgPanZoom.panLeft(5);
  console.log(svgPanZoom.getViewBox());
});
document.getElementById("right").addEventListener("click", function () {
  // code to be executed when button is clicked
  svgPanZoom.panRight(5);
  console.log(svgPanZoom.getViewBox());
});
document.getElementById("up").addEventListener("click", function () {
  // code to be executed when button is clicked
  svgPanZoom.panUp(5);
  console.log(svgPanZoom.getViewBox());
});
document.getElementById("down").addEventListener("click", function () {
  // code to be executed when button is clicked
  svgPanZoom.panDown(5);
  console.log(svgPanZoom.getViewBox());
});

document.getElementById("mapimg").addEventListener("drag", function (event) {
  console.log(svgPanZoom.getViewBox());
});

document.getElementById("update").addEventListener("click", function () {
  // code to be executed when button is clicked
  // svgPanZ/oom.panDown(5);
  console.log(svgPanZoom.getViewBox());
});
