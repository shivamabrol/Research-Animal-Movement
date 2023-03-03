//do button click isolation
var pointsPlotted = false;
const colorArray = [
  "#1abc9c",
  "#16a085",
  "#2ecc71",
  "#27ae60",
  "#3498db",
  "#2980b9",
  "#9b59b6",
  "#8e44ad",
  "#f1c40f",
  "#f39c12",
  "#e67e22",
  "#d35400",
  "#e74c3c",
  "#c0392b",
];

const names = [
  "Daniel",
  "Magnolia",
  "Jessy",
  "Drogon",
  "Viserion",
  "Rhaegal",
  "John",
  "Rhaegal_2",
  "Viserion_2",
  "Samwell",
  "Gendry",
  "Gendry_2",
  "Daenerys",
  "Olenna",
  "John Snow",
  "Samwell Tarly",
  "Olenna Tyrell",
];

var svgPanZoom = $("svg#map").svgPanZoom();

var svg = d3.select("svg#map");

var image = d3.select("image#myimg");

var xScale = d3
  .scaleLinear()
  .domain([624079.8465020715, 629752.8465020715])
  .range([0, 1000]);

var yScale = d3
  .scaleLinear()
  .domain([1009715.5668793379, 1015157.5668793379])
  .range([1000, 0]);

// zoomFactor: number (0.25)
svgPanZoom.events.mouseWheel = false;
svgPanZoom.events.doubleClick = false;
svgPanZoom.events.drag = false;

document.getElementById("reset").addEventListener("click", function () {
  // code to be executed when button is clicked
  svgPanZoom.reset();
  svg.selectAll(".points").remove();
  svg.selectAll(".lines").remove();
  svg.selectAll(".fruits").remove();
});

document.getElementById("zoom-in").addEventListener("click", function () {
  // code to be executed when button is clicked

  svgPanZoom.zoomIn(0.5);
  // Get the image element
});

document.getElementById("zoom-out").addEventListener("click", function () {
  // code to be executed when button is clicked
  svgPanZoom.zoomOut(1);
});

document.getElementById("left").addEventListener("mousedown", function () {
  // code to be executed when button is clicked
  // simulating hold event
  setTimeout(function () {
    svgPanZoom.panLeft(5);
  }, 200);
  // console.log(svgPanZoom.getViewBox());
});

document.getElementById("fruit").addEventListener("click", function () {
  // code to be executed when button is clicked

  plotFruitTrees();

  // console.log(svgPanZoom.getViewBox());
});

document.getElementById("lines-remove").addEventListener("click", function () {
  // code to be executed when button is clicked
  svg.selectAll(".lines").remove();
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

document.getElementById("bci").addEventListener("click", function () {
  // code to be executed when button is clicked
  plotBCIdata();
});

document.getElementById("lines-add").addEventListener("click", function () {
  // code to be executed when button is clicked
  plotLinesBCI();
});

document.getElementById("startstamp").addEventListener("change", function () {
  // code to execute when the input value changes
  var inputValue = document.getElementById("startstamp").value;
  plotBCIdata();
});

document.getElementById("endstamp").addEventListener("change", function () {
  // code to execute when the input value changes
  var inputValue = document.getElementById("startstamp").value;
  plotBCIdata();
});

document
  .getElementById("start-location")
  .addEventListener("click", function () {
    plotCircles();
  });

document.getElementById("find-paths").addEventListener("click", function () {
  plotCircles();
});

// document.getElementById("start-clock").addEventListener("click", function () {
//   // code to be executed when button is clicked
//   clockPlot();
// });

document
  .getElementById("movement-range")
  .addEventListener("change", function () {
    // code to execute when the input value changes
    moveRange();
  });

const container = document.getElementById("names");

container.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn-primary")) {
    plotBCIdata((individual = event.target.innerHTML.trim()));
  }
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

function plotFruitTrees() {
  var corners = svgPanZoom.getViewBox();

  const svg = d3.select("svg#map");

  // svg.selectAll(".selected").remove();

  d3.csv("../data/fruit_tree.csv") //updted the data
    .then((data) => {
      var dot = svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        // .attr("cx", (d) => xScale(d.UTM_X))
        .attr("class", "fruits")
        .attr("cx", function (d) {
          return xScale(parseFloat(d["utm-easting"]));
        })
        .attr("cy", function (d) {
          return yScale(parseFloat(d["utm-northing"]));
        })
        .attr("r", function (d) {
          return parseInt(d.Area) / 300;
        })
        .style("opacity", function (d) {
          return 1;
        })
        .attr("fill", function (d) {
          return "pink";
        });
    });

  if (pointsPlotted === true) {
    plotBCIdata();
  }
}

function plotBCIdata(
  individual = "all",
  starttime = "2000-07-07 22:07:07.000",
  endtime = "2100-07-07 22:07:07.000"
) {
  pointsPlotted = true;
  // starttime = document.getElementById()
  // console.log([individual, starttime, endtime]);

  starttime =
    document.getElementById("startstamp").value == ""
      ? starttime
      : document.getElementById("startstamp").value;
  endtime =
    document.getElementById("endstamp").value == ""
      ? endtime
      : document.getElementById("endstamp").value;
  console.log([individual, starttime, endtime]);

  const svg = d3.select("svg#map");
  svg.selectAll(".points").remove();

  d3.csv("../data/Dead-Reackon-Sample-1.csv") //updted the data
    .then((data) => {
      var data = data.filter(function (d) {
        return d["timestamp"] >= starttime && d["timestamp"] <= endtime;
      });
      if (individual != "all") {
        data = data.filter(function (d) {
          return d["individual-local-identifier"] == individual;
        });
      }

      var dot = svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "points")
        .attr("id", function (d) {
          return d["individual-local-identifier"];
        })
        .attr("cx", function (d) {
          return xScale(parseFloat(d["utm-easting"]));
        })
        .attr("cy", function (d) {
          return yScale(parseFloat(d["utm-northing"]));
        })
        .attr("r", function (d) {
          return parseInt(svgPanZoom.getViewBox().width) / 600;
        })
        .style("opacity", function (d) {
          // console.log(individual);
          if (individual == "all") {
            return 1;
          } else {
            if (d["individual-local-identifier"] == individual) {
              return 1;
            }
            return 0;
          }
        })
        .attr("fill", function (d) {
          return colorArray[
            names.indexOf(d["individual-local-identifier"]) % names.length
          ];
        });
    });
}

// Add brushing
svg.call(
  d3
    .brush() // Add the brush feature using the d3.brush function
    .extent([
      [0, 0],
      [1000, 1000],
    ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
);

// Function that is triggered when brushing is performed
function updateChart(e1) {
  extent = e1.selection;
  start = e1.selection[0];
  end = e1.selection[1];

  d3.csv("../data/Dead-Reackon-Sample-1.csv") //updted the data
    .then((data) => {
      const filteredData = data.filter(function (d) {
        var horizontal = xScale(d["utm-easting"]);
        var vertical = yScale(d["utm-northing"]);
        return (
          horizontal > start[0] &&
          horizontal < end[0] &&
          vertical > start[1] &&
          vertical < end[1] &&
          d["individual-local-identifier"] == "Daniel"
        );
      });

      plotSeparatePaths(filteredData);
    });
}

function plotSeparatePaths(data) {
  const margin = { top: 30, right: 30, bottom: 30, left: 30 },
    width = 300 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg2 = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  var x = d3
    .scaleLinear()
    .domain([624079.8465020715, 629752.8465020715])
    .range([0, width]);

  svg2
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3
    .scaleLinear()
    .domain([1009715.5668793379, 1015157.5668793379])
    .range([height, 0]);
  svg2.append("g").call(d3.axisLeft(y));

  // Add dots
  svg2
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d["utm-easting"]);
    })
    .attr("cy", function (d) {
      return y(d["utm-northing"]);
    })
    .attr("r", 1.5)
    .style("fill", "#69b3a2");
}

function plotLinesBCI() {
  // svg.selectAll("*").remove();

  const line = d3
    .line()
    .x(function (d) {
      return xScale(d["utm-easting"]);
    })
    .y(function (d) {
      return yScale(d["utm-northing"]);
    });

  const svg = d3.select("svg#map");

  d3.csv("../data/Dead-Reackon-Sample-1.csv") //updted the data
    .then((data) => {
      const circles = d3.selectAll("circle");

      // Filter the selection to only include circles with a non-empty ID
      const circlesWithId = circles.filter(function () {
        return d3.select(this).attr("id") !== null;
      });

      var opacityScale = d3
        .scalePow()
        .exponent(0.5)
        .domain([
          0,
          d3.max(data, function (d, i) {
            if (i > 0) {
              // Calculate the length of the line
              var dx = data[i]["utm-easting"] - data[i - 1]["utm-easting"];
              var dy = data[i]["utm-northing"] - data[i - 1]["utm-northing"];
              return Math.sqrt(dx * dx + dy * dy);
            } else {
              return 0;
            }
          }),
        ])
        .range([0.5, 0]);

      // var individual = 'all'
      // Do something with the filtered selection, e.g. log the IDs to the console
      circlesWithId.each(function () {
        individual = d3.select(this).attr("id");
      });

      var data = data.filter(function (d) {
        return d["individual-local-identifier"] == individual;
      });
      var corners = svgPanZoom.getViewBox();
      svg.selectAll(".lines").remove();
      // const path = svg
      //   .append("path")
      //   .data(data)
      //   .attr("d", line)
      //   .attr("class", "lines")
      //   .attr("fill", "none")
      //   .attr("opacity", 0.5)
      //   .attr("stroke", function (d) {
      //     console.log(d);
      //     return "white";
      //   })
      //   .attr("stroke-width", corners.width / 500);

      svg
        .selectAll("path")
        .data(data.slice(1))
        .join("path")
        .attr("class", "lines")
        .attr("d", function (d, i) {
          // Generate the line path
          var pathData = line([data[i], d]);
          return pathData;
        })
        .attr("opacity", function (d, i) {
          // Calculate the length of the line
          if (i > 0) {
            var dx = d["utm-easting"] - data[i - 1]["utm-easting"];
            var dy = d["utm-northing"] - data[i]["utm-northing"];
            var length = Math.sqrt(dx * dx + dy * dy);
            let a = opacityScale(length);
            console.log(a);
            return a;
          }
          return 1;
        })
        .attr("stroke-width", corners.width / 500)
        .attr("stroke", function (d) {
          console.log(d);
          return "white";
        });
    });
  console.log("x");
  // plotBCIdata();
}

function moveRange() {
  console.log("clock has started");

  // Define the input domain and output range

  var rangeScale = d3.scaleLinear().domain([0, 100000]).range([0, 100]);
  var circles = d3.selectAll("circle");
  // Filter the selection to only include circles with a non-empty ID
  const circlesWithId = circles.filter(function () {
    return d3.select(this).attr("id") !== null;
  });
  // var individual = 'all'
  // Do something with the filtered selection, e.g. log the IDs to the console
  circlesWithId.each(function () {
    individual = d3.select(this).attr("id");
  });

  console.log(individual);
  d3.selectAll("circle").remove();
  var rangeValue = document.getElementById("movement-range").value;
  d3.csv("../data/Dead-Reackon-Sample-1.csv") //updted the data
    .then((data) => {
      data = data.filter(function (d) {
        return (
          d["individual-local-identifier"] == individual &&
          parseInt(d.index) <= rangeValue
        );
      });
      console.log(data);

      var dot = svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "points")
        // .transition()
        // .delay(function (d, i) {
        //   return i * 20; // Set a delay for each circle based on its index
        // })

        .attr("id", function (d) {
          return d["individual-local-identifier"];
        })
        .attr("cx", function (d) {
          return xScale(parseFloat(d["utm-easting"]));
        })
        .attr("cy", function (d) {
          return yScale(parseFloat(d["utm-northing"]));
        })
        .attr("r", function (d) {
          return parseInt(svgPanZoom.getViewBox().width) / 600;
        })
        .style("opacity", function (d) {
          // console.log(individual);
          return 1;
        })
        .attr("fill", function (d) {
          return colorArray[
            names.indexOf(d["individual-local-identifier"]) % names.length
          ];
        });
    });
}

function plotCircles() {
  var circleData = [
    { x: 100, y: 100, r: 5, color: "blue", opacity: 0.5 },
    { x: 250, y: 200, r: 7, color: "red", opacity: 0.5 },
  ];

  // Create an SVG element
  const svg = d3.select("svg#map");

  var drag = d3
    .drag()
    .on("start", function (event, d) {
      // Do something when the drag starts
      d3.select(this).attr("stroke", "black");
    })
    .on("drag", function (event, d) {
      // Do something as the drag progresses
      d3.select(this)
        .raise()
        .attr("cx", (d.x = event.x))
        .attr("cy", (d.y = event.y));
    })
    .on("end", function (event, d) {
      // Do something when the drag ends

      d3.select(this).attr("stroke", null);
      console.log(d);
    });

  // Add circles to the SVG
  svg
    .selectAll("circle")
    .data(circleData)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    })
    .attr("r", function (d) {
      return d.r;
    })
    .attr("fill", function (d) {
      return d.color;
    })
    .call(drag)
    .on("click", clicked);
}

function clicked(event, d) {
  if (event.defaultPrevented) return; // dragged

  d3.select(this)
    .transition()
    .attr("fill", "blue")
    .attr("r", r * 2)
    .transition()
    .attr("r", r)
    .attr("opacity", 0.5)
    .attr("fill", "green");
}
