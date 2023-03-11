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

const svg = d3.select("svg#map");

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
  //
});

document.getElementById("fruit").addEventListener("click", function () {
  // code to be executed when button is clicked

  plotFruitTrees();

  //
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

document
  .getElementById("isolate-points")
  .addEventListener("click", function () {
    isolatePoints();
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
          return parseInt(parseInt(d.Area)) / 300;
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
  //

  starttime =
    document.getElementById("startstamp").value == ""
      ? starttime
      : document.getElementById("startstamp").value;
  endtime =
    document.getElementById("endstamp").value == ""
      ? endtime
      : document.getElementById("endstamp").value;

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
          //
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
    .on("end", updateChart2) // Each time the brush selection changes, trigger the 'updateChart' function
);

function updateChart2() {}
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
        .range([1, 0]);

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
      //
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
            //
            return a;
          }
          return 1;
        })
        .attr("stroke-width", corners.width / 500)
        .attr("stroke", function (d) {
          //
          return "white";
        });
    });

  // plotBCIdata();
}

function moveRange() {
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
          //
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
    { x: 100, y: 100, r: 20, color: "blue", opacity: 0.5, id: "end-circle" },
    { x: 250, y: 200, r: 20, color: "red", opacity: 0.5, id: "start-circle" },
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

      trajectoryPlotter();
    })
    .on("end", function (event, d) {
      // Do something when the drag ends

      d3.select(this).attr("stroke", null);
    });

  // Add circles to the SVG
  svg
    .selectAll("circle")
    .data(circleData)
    .enter()
    .append("circle")
    .attr("class", "isolated")
    .attr("id", function (d) {
      return d.id;
    })
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
    .attr("opacity", function (d) {
      return d.opacity;
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

//code for focus + context
function plotfocusTimeline() {
  var margin = { top: 10, right: 10, bottom: 100, left: 40 },
    margin2 = { top: 430, right: 10, bottom: 20, left: 40 },
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

  var parseDate = d3.timeParse("%Y");

  var x = d3.scaleUtc().range([0, width]),
    x2 = d3.scaleUtc().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2, 0]);

  var xAxis = d3.axisBottom(x),
    xAxis2 = d3.axisBottom(x2),
    yAxis = d3.axisLeft(y);

  var brush = d3
    .brushX()
    .extent([
      [0, 0],
      [width, height2],
    ])
    .on("brush", brushed);

  var area = d3
    .area()
    .curve(d3.curveMonotoneX)
    .x(function (d) {
      return x(parseInt(d["timestamp"]));
    })
    .y0(height)
    .y1(function (d) {
      return y(parseInt(d["location-lat"]));
    });

  var area2 = d3
    .area()
    .curve(d3.curveMonotoneX)
    .x(function (d) {
      return x2(parseInt(d["timestamp"]));
    })
    .y0(height2)
    .y1(function (d) {
      return y2(parseInt(d["location-lat"]));
    });

  // var svg = d3
  //   .select("body")
  //   .append("svg")
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom);

  // append the svg object to the body of the page
  const svg = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  svg
    .append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

  var focus = svg
    .append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var context = svg
    .append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  d3.csv("../data/Dead-Reackon-Sample-1.csv") //updted the data
    .then((data) => {
      // if (error) throw error;

      x.domain(
        d3.extent(
          data.map(function (d) {
            return d["timestamp"];
          })
        )
      );
      y.domain([
        0,
        d3.max(
          data.map(function (d) {
            return parseInt(d["location-lat"]);
          })
        ),
      ]);
      x2.domain(x.domain());
      y2.domain(y.domain());

      focus.append("path").datum(data).attr("class", "area").attr("d", area);

      focus
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      focus.append("g").attr("class", "y axis").call(yAxis);

      context.append("path").datum(data).attr("class", "area").attr("d", area2);

      context
        .append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${height2})`)
        .call(xAxis2);

      context
        .append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);
    });
  function brushed(event) {
    x.domain(event ? event.selection : x2.domain());
    focus.select(".area").attr("d", area);
    focus.select(".x.axis").call(xAxis);
  }
}

//developing the trajectory plotter while this is in progress
// plotfocusTimeline();

function isolatePoints() {
  const circles = d3.selectAll("circle.points");
  const isolated = d3.selectAll("circle.isolated");
  // Filter the selection to only include circles with a non-empty ID
  // const circlesWithId = circles.filter(function () {
  //   return d3.select(this).attr("id") !== null;
  // });
  let start = isolated.nodes()[0];
  let end = isolated.nodes()[1];

  var data = circles.filter(function (d) {
    let radius = 15;

    //start conditions
    let startX = parseInt(start.getAttribute("cx"));
    let startY = parseInt(start.getAttribute("cy"));
    let pointStartX = xScale(d["utm-easting"]);
    let pointStartY = yScale(d["utm-northing"]);
    let startXCondition =
      pointStartX >= startX - radius && pointStartX <= startX + radius;
    let startYCondition =
      pointStartY >= startY - radius && pointStartY <= startY + radius;

    //end conditions
    let endX = parseInt(end.getAttribute("cx"));
    let endY = parseInt(end.getAttribute("cy"));
    let pointendX = xScale(d["utm-easting"]);
    let pointendY = yScale(d["utm-northing"]);
    let endXCondition =
      pointendX >= endX - radius && pointendX <= endX + radius;
    let endYCondition =
      pointendY >= endY - radius && pointendY <= endY + radius;

    return (
      (startXCondition && startYCondition) || (endXCondition && endYCondition)
    );
  });

  return data;
}

function plotIsolatedPoints() {
  data = isolatePoints();

  svg.selectAll(".points").remove();
  data = data.data();
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
      //
      return yScale(parseFloat(d["utm-northing"]));
    })
    .attr("r", function (d) {
      //
      return parseInt(svgPanZoom.getViewBox().width) / 600;
    })
    .style("opacity", function (d) {
      //
      return 1;
    })
    .attr("fill", function (d) {
      // console.log(
      //   colorArray[
      //     names.indexOf(d["individual-local-identifier"]) % names.length
      //   ]
      // );
      return colorArray[
        names.indexOf(d["individual-local-identifier"]) % names.length
      ];
    });
}

//break into grid and then creat a treemap from the data - aggregation and

//slider to reize the circles
function sliderChanged(id) {
  var sliderValue = document.getElementById("start-resize").value;
  // var circle1 = d3.selectAll("circle.points");
  var circle = d3.selectAll("circle.isolated#" + id);

  circle.attr("r", sliderValue);
}

function trajectoryPlotter() {
  data = isolatePoints().data();
  console.log(data);
}
