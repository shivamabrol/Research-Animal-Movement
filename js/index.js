//do button click isolation

const colorArray = [
  "white",
  "red",
  "gray",
  "black",
  "maroon",
  "purple",
  "fuchsia",
  "green",
  "lime",
  "olive",
  "yellow",
  "navy",
  "silver",
  "blue",
  "teal",
  "aqua",
  "orange",
  "aliceblue",
  "antiquewhite",
  "aquamarine",
];

var svgPanZoom = $("svg#map").svgPanZoom();

var svg = d3.select("svg#map");

var image = d3.select("image#myimg");

// zoomFactor: number (0.25)
svgPanZoom.events.mouseWheel = false;
svgPanZoom.events.doubleClick = false;
// svgPanZoom.events.drag = false;

document.getElementById("reset").addEventListener("click", function () {
  // code to be executed when button is clicked
  svgPanZoom.reset();
});

document.getElementById("zoom-in").addEventListener("click", function () {
  // code to be executed when button is clicked

  svgPanZoom.zoomIn(1);
  // Get the image element
});

document.getElementById("zoom-out").addEventListener("click", function () {
  // code to be executed when button is clicked
  svgPanZoom.zoomOut(1);
});

document.getElementById("left").addEventListener("click", function () {
  // code to be executed when button is clicked
  // simulating hold event
  setTimeout(function () {
    svgPanZoom.panLeft(5);
  }, 200);
  // console.log(svgPanZoom.getViewBox());
});
document.getElementById("right").addEventListener("click", function () {
  // code to be executed when button is clicked
  svgPanZoom.panRight(5);
});
document.getElementById("up").addEventListener("click", function () {
  // code to be executed when button is clicked
  svgPanZoom.panUp(5);
});
document.getElementById("down").addEventListener("click", function () {
  // code to be executed when button is clicked
  svgPanZoom.panDown(5);
});

// document.getElementById("mapimg").addEventListener("drag", function (event) {
//   console.log(svgPanZoom.getViewBox());
// });

document.getElementById("update").addEventListener("click", function () {
  // code to be executed when button is clicked
  // svgPanZ/oom.panDown(5);
  showPoints(svgPanZoom.getViewBox(), "blue", "none");
});

document.getElementById("cols").addEventListener("click", function () {
  alterPoints();
});

//top left
// Latitude : 9.181898
// Longitude: -79.870619

//right bottom
// Latitude : 9.13252
// Longitude: -79.819153

var left = 624079.8465020715;
var right = 629752.8465020715;

var top = 1015157.5668793379;
var bottom = 1009715.5668793379;

function filterDataCharts(id) {
  // set the dimensions and margins of the graph
  var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  // append the svg object to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3
    .select("#scatter-plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // get the data

  d3.csv("../data/sliced.csv") //updted the data
    .then((data) => {
      // format the data
      data.forEach(function (d) {
        d.x = +d.x;
        d.y = +d.y;
      });

      // scale the range of the data
      x.domain(
        d3.extent(data, function (d) {
          return d.x;
        })
      );
      y.domain([
        0,
        d3.max(data, function (d) {
          return d.y;
        }),
      ]);

      // add the dots
      svg
        .selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function (d) {
          return x(d.x);
        })
        .attr("cy", function (d) {
          return y(d.y);
        });

      // add the X Axis
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // add the Y Axis
      svg.append("g").call(d3.axisLeft(y));
    });
}

function columnColorPoints(id) {
  colors = ["red", "blue", "white", "green", "yellow"];
  var div = document.getElementById("colvals");
  div.innerHTML = "";

  d3.selectAll("circle")
    // .filter(function(d, i) { return i === 2; })
    .remove();

  d3.csv("../data/sliced.csv") //updted the data
    .then((data) => {
      let vals = [];
      data.forEach((d) => {
        vals.push(d[id]);
      });
      let unique = vals.filter((item, i, ar) => ar.indexOf(item) === i);
      console.log(unique);

      //*Plotting all the unique colors as buttons for further isolation
      showPoints(svgPanZoom.getViewBox(), unique, id);

      //Plotting some charts based on the particular column clicked
      // filterDataCharts(data, id);

      unique.forEach((d1) => {
        // console.log(d1);
        var btn = document.createElement("BUTTON");
        // Set the text of the button
        btn.innerHTML = d1;
        btn.style.margin = "10px";

        // Add Bootstrap classes to the button
        btn.classList.add("btn", "btn-primary");

        // Add an event listener to the button
        btn.addEventListener("click", function () {
          isolate(data, id, d1);
          // console.log("this is the work");
          //*Add new button for specific color isolation
        });

        // Select the element where you want to append the button

        // Append the button to the selected element
        div.appendChild(btn);
      });
    });
}

function isolate(data, selectedColumn, selectedValue) {
  console.log(selectedValue, selectedColumn);
  d3.selectAll("circle").remove();

  const svg = d3.select("svg#map");

  showPointsColumn(svgPanZoom.getViewBox(), selectedColumn, selectedValue);
}

function showPointsColumn(corners, selectedColumn, selectedValue) {
  console.log(corners);
  var height = bottom - top;
  var width = right - left;

  // Define the input domain and output range
  var xScale = d3
    .scaleLinear()
    .domain([624079.8465020715, 629752.8465020715])
    .range([0, 800]);
  // 643249.2264808861
  var yScale = d3
    .scaleLinear()
    .domain([1009715.5668793379, 1015157.5668793379])
    .range([0, 800]);

  var left = xScale.invert(corners.x);
  var top = yScale.invert(corners.y);
  var right = xScale.invert(corners.x + corners.width);
  var bottom = yScale.invert(corners.y + corners.height);
  console.log(corners.width / 1000);
  //   console.log(left, right, top, bottom);
  const svg = d3.select("svg#map");

  svg.selectAll(".selected").remove();

  d3.csv("../data/sliced.csv") //updted the data
    .then((data) => {
      data = data.filter((d) => d[selectedColumn] == selectedValue);
      console.log(data);
      var dot = svg
        .selectAll("circle")
        .classed("selected", true)
        .data(data)
        .enter()
        .append("circle")
        // .attr("cx", (d) => xScale(d.UTM_X))
        .attr("cx", function (d) {
          return xScale(d.UTM_lat) - 100;
        })
        .attr("cy", function (d) {
          // console.log(yScale(d.UTM_lon));
          return yScale(d.UTM_lon);
        })
        .attr("r", function (d) {
          if (d[selectedColumn] == selectedValue) {
            return corners.width / 800;
          }
          return corners.width / 800;
        })
        // .attr()
        .style("opacity", function (d) {
          return 1;
        })
        .attr("fill", function (d) {
          if (selectedColumn == "none") {
            return "red";
          }
          return colorArray[d[selectedColumn]];
          // return Math.floor(Math.random() * 10);
        });
    });
}

function showPoints(corners, colorSize, column) {
  console.log(corners);
  var height = bottom - top;
  var width = right - left;

  // Define the input domain and output range
  var xScale = d3
    .scaleLinear()
    .domain([624079.8465020715, 629752.8465020715])
    .range([0, 1000]);
  // 643249.2264808861
  var yScale = d3
    .scaleLinear()
    .domain([1009715.5668793379, 1015157.5668793379])
    .range([1000, 0]);

  var left = xScale.invert(corners.x);
  var top = yScale.invert(corners.y);
  var right = xScale.invert(corners.x + corners.width);
  var bottom = yScale.invert(corners.y + corners.height);
  console.log(corners.width / 1000);
  //   console.log(left, right, top, bottom);
  const svg = d3.select("svg#map");

  svg.selectAll(".selected").remove();

  d3.csv("../data/sliced.csv") //updted the data
    .then((data) => {
      var dot = svg
        .selectAll("circle")
        .classed("selected", true)
        .data(data)
        .enter()
        .append("circle")
        // .attr("cx", (d) => xScale(d.UTM_X))
        .attr("cx", function (d) {
          return xScale(d.UTM_lat);
        })
        .attr("cy", function (d) {
          // console.log(yScale(d.UTM_lon));
          return yScale(d.UTM_lon);
        })
        .attr("r", function (d) {
          if (corners.width < 200) {
            return corners.width / 800;
          }
          return corners.width / 800;
        })
        // .attr()
        .style("opacity", function (d) {
          return 1;
        })
        .attr("fill", function (d) {
          if (column == "none") {
            return "red";
          }
          return colorArray[d[column]];
          // return Math.floor(Math.random() * 10);
        });
    });
}

function alterPoints() {
  let div = document.getElementById("item3");
  let cols = ["col_int", "col_int2", "col_int3", "col_bool"];
  let cols2 = ["RB1", "RB2", "RB3"];

  cols.forEach((d1) => {
    // console.log(d1);x
    var btn = document.createElement("BUTTON");
    // Set the text of the button
    btn.innerHTML = d1;
    btn.style.margin = "10px";

    // Add Bootstrap classes to the button
    btn.classList.add("btn", "btn-primary");

    // Add an event listener to the button
    btn.addEventListener("click", function () {
      columnColorPoints(d1);
    });

    // Select the element where you want to append the button
    var div = document.getElementById("item3");

    // Append the button to the selected element
    div.appendChild(btn);
  });

  cols2.forEach((d1) => {
    // console.log(d1);
    var btn = document.createElement("BUTTON");
    // Set the text of the button
    btn.innerHTML = d1;
    btn.style.margin = "10px";

    // Add Bootstrap classes to the button
    btn.classList.add("btn", "btn-success");

    // Add an event listener to the button
    btn.addEventListener("click", function () {
      columnColorPoints(d1);
    });

    // Select the element where you want to append the button
    var div = document.getElementById("item3");

    // Append the button to the selected element
    div.appendChild(btn);
  });
}
