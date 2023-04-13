let data;
d3.csv("../data/BCI-movement-data.csv")
  .then(function (data1) {
    // Do something with the data here
    data = data1;
  })
  .catch(function (error) {
    console.log(error); // log any errors to the console
  }); // declare a variable to store the data

let fruitTreeData;

d3.csv("../data/fruit_tree.csv")
  .then(function (data1) {
    fruitTreeData = data1; // assign the data to the variable
    // Do something with the data here
  })
  .catch(function (error) {
    console.log(error); // log any errors to the console
  });

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

const colorArrayTrajectory = [
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
];

var svgPanZoom = $("svg#map").svgPanZoom();

const svg = d3.select("svg#map");

var pointsPlotted = false;
var data3D = [
  [
    [0, -1, 0],
    [-1, 1, 0],
    [1, 1, 0],
  ],
];

var triangles3D = d3._3d().scale(100).origin([480, 250]).shape("TRIANGLE");

var projectedData = triangles3D(data3D);

init(projectedData);

function init(data) {
  var triangles = svg.selectAll("path").data(data);

  // add your logic here...
}

const xScale = d3
  .scaleLinear()
  .domain([624079.8465020715, 629752.8465020715])
  .range([0, 1000]);

const yScale = d3
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
  svg.selectAll(".cells").remove();

  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  // document.getElementById("Daniel").checked = false;
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

// document.getElementById("lines-add").addEventListener("click", function () {
//   // code to be executed when button is clicked
//   plotLinesBCI();
// });

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
    plotIsolatedPoints();
  });

document.getElementById("voronoi-plot").addEventListener("click", function () {
  let width = document.getElementById("voronoi-cell-width").value;
  console.log(width);
  voronoiPlots(parseInt(width));
});

// document.getElementById("start-clock").addEventListener("click", function () {
//   // code to be executed when button is clicked
//   clockPlot();
// });

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

var top = 1009715.5668793379;
var bottom = 1015157.5668793379;

function plotFruitTrees() {
  var corners = svgPanZoom.getViewBox();

  // svg.selectAll(".selected").remove();

  var dot = svg
    .selectAll("circle")
    .data(fruitTreeData)
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

  // svg.selectAll(".points").remove();

  var data2 = data.filter(function (d) {
    return d["timestamp"] >= starttime && d["timestamp"] <= endtime;
  });
  if (individual != "all") {
    data2 = data2.filter(function (d) {
      return d["individual-local-identifier"] == individual;
    });
  }

  var dot = svg
    .selectAll("circle")
    .data(data2)
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
      return 1;
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

function updateChart2() {}
// Function that is triggered when brushing is performed
function updateChart(e1) {
  extent = e1.selection;
  start = e1.selection[0];
  end = e1.selection[1];

  d3.csv("../data/BCI-movement-data.csv") //updted the data
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

function s(attribute) {
  const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg2 = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  //Read the data
  d3.csv(
    "../data/BCI-movement-data.csv",

    // When reading the csv, I must format variables:
    (d) => {
      return {
        date: d3.timeParse("%Y-%m-%d %H:%M:%S.%L")(d["timestamp"]),
        value: d[attribute],
      };
    }
  ).then(
    // Now I can use this dataset:
    function (data1) {
      console.log(data1);
      // Add X axis --> it is a date format
      const x = d3
        .scaleTime()
        .domain(d3.extent(data1, (d) => d.date))
        .range([0, width]);
      xAxis = svg2
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      // Add Y axis
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data1, (d) => +d.value)])
        .range([height, 0]);
      yAxis = svg2.append("g").call(d3.axisLeft(y));

      // Add a clipPath: everything out of this area won't be drawn.
      const clip = svg2
        .append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

      // Add brushing
      const brush = d3
        .brushX() // Add the brush feature using the d3.brush function
        .extent([
          [0, 0],
          [width, height],
        ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart); // Each time the brush selection changes, trigger the 'updateChart' function

      // Create the area variable: where both the area and the brush take place
      const area = svg2.append("g").attr("clip-path", "url(#clip)");

      // Create an area generator
      const areaGenerator = d3
        .area()
        .x((d) => x(d.date))
        .y0(y(0))
        .y1((d) => y(d.value));

      //   // Add the area
      //   area
      //     .append("path")
      //     .datum(data)
      //     .attr("class", "myArea") // I add the class myArea to be able to modify it later on.
      //     .attr("fill", "#69b3a2")
      //     .attr("fill-opacity", 0.3)
      //     .attr("stroke", "black")
      //     .attr("stroke-width", 1)
      //     .attr("d", areaGenerator);

      area
        .append("path")
        .attr("class", "myArea")
        .attr("d", areaGenerator(data1));

      // Add the brushing
      area.append("g").attr("class", "brush").call(brush);

      // A function that set idleTimeOut to null
      let idleTimeout;
      function idled() {
        idleTimeout = null;
      }

      // A function that update the chart for given boundaries
      function updateChart(event) {
        // What are the selected boundaries?
        extent = event.selection;

        // If no selection, back to initial coordinate. Otherwise, update X axis domain
        if (!extent) {
          if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
          x.domain([4, 8]);
        } else {
          x.domain([x.invert(extent[0]), x.invert(extent[1])]);
          area.select(".brush").call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
        }

        // Update axis and area position
        xAxis.transition().duration(1000).call(d3.axisBottom(x));
        area
          .select(".myArea")
          .transition()
          .duration(1000)
          .attr("d", areaGenerator(data1));
      }

      // If user double click, reinitialize the chart
      svg2.on("dblclick", function () {
        x.domain(d3.extent(data1, (d) => d.date));
        xAxis.transition().call(d3.axisBottom(x));
        area.select(".myArea").transition().attr("d", areaGenerator(data1));
      });
    }
  );
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
function plotTrajectoryBCI() {
  if (document.getElementById("lines-add").checked == false) {
    svg.selectAll(".lines").remove();
    return;
  }
  console.log(data);
  plotList = [];
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked == true) {
      plotList.push(checkbox.value);
    }
  });
  console.log(plotList);
  const trajectoryData = data.filter((item) =>
    plotList.includes(item["individual-local-identifier"])
  );

  // Get the unique categories from the data
  const uniqueTrajectories = [
    ...new Set(trajectoryData.map((item) => item["trajectory_number"])),
  ];

  // // Log the unique categories to the console
  console.log(uniqueTrajectories);
  svg.remove;
  trajectoryLinePlotter(trajectoryData);
}

function trajectoryLinePlotter(data) {
  var line = d3
    .line()
    .x(function (d) {
      return xScale(d["utm-easting"]);
    })
    .y(function (d) {
      return yScale(d["utm-northing"]);
    });

  svg
    .selectAll(".line")
    .data(d3.groups(data, (d) => d["trajectory_number"]))
    .enter()
    .append("path")
    .attr("class", "lines")
    .attr("d", function (d) {
      return line(d[1]);
    })
    .style("stroke", function (d) {
      console.log(colorArrayTrajectory[parseInt(d[0]) % 60]);
      return colorArrayTrajectory[parseInt(d[0]) % 60];
    });
}

function getColorList() {
  // Use D3's schemeCategory20c() and schemeSet3() functions to get 20 and 12 colors respectively
  var colorList1 = d3.schemeCategory10;
  var colorList2 = d3.schemeCategory10;

  // Combine the two color lists and select the first 35 colors
  var colorList = colorList1.concat(colorList2).slice(0, 15);

  return colorList;
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

  circlesWithId.each(function () {
    individual = d3.select(this).attr("id");
  });

  var linedata = data.filter(function (d) {
    return d["individual-local-identifier"] == individual;
  });
  var corners = svgPanZoom.getViewBox();
  svg.selectAll(".lines").remove();

  svg
    .selectAll("path")
    .data(linedata.slice(1))
    .join("path")
    .attr("class", "lines")
    .attr("d", function (d, i) {
      // Generate the line path
      var pathData = line([linedata[i], d]);
      return pathData;
    })
    .attr("opacity", function (d, i) {
      // Calculate the length of the line
      if (i > 0) {
        var dx = d["utm-easting"] - linedata[i - 1]["utm-easting"];
        var dy = d["utm-northing"] - linedata[i]["utm-northing"];
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

  let rangeData = data.filter(function (d) {
    return (
      d["individual-local-identifier"] == individual &&
      parseInt(d.index) <= rangeValue
    );
  });

  var dot = svg
    .selectAll("circle")
    .data(rangeData)
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
      // trajectoryPlotter2();
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

function plotFocusTimeline() {}

plotFocusTimeline();

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
  console.log(data);
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

  plotLinesData(data);
}

//break into grid and then creat a treemap from the data - aggregation and

//slider to reize the circles
function sliderChanged(id) {
  var sliderValue = document.getElementById("start-resize").value;
  // var circle1 = d3.selectAll("circle.points");
  var circle = d3.selectAll("circle.isolated#" + id);

  circle.attr("r", sliderValue);
}

function trajectoryPlotter2() {
  objects = isolatePoints().data();
}

function trajectoryPlotter() {
  objects = isolatePoints().data();
  // console.log(data);

  //Given a list of those points plot all the trajectories through those points - originating / passing through

  //Find all the trajectories in the data
  const distinctTrajectories = [
    ...new Set(objects.map((item) => item["trajectory_number"])),
  ];

  // Filter the data based on the list of names
  const filteredTrajectories = data.filter((item) =>
    distinctTrajectories.includes(item["trajectory_number"])
  );

  // console.log(filteredData);
  svg.selectAll(".lines").remove();

  trajectoryLinePlotter(filteredTrajectories);
  //get points with all those trajectories
}

function plotLinesData(data) {
  // svg.selectAll("*").remove();

  const line = d3
    .line()
    .x(function (d) {
      return xScale(d["utm-easting"]);
    })
    .y(function (d) {
      return yScale(d["utm-northing"]);
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

  var corners = svgPanZoom.getViewBox();
  svg.selectAll(".lines").remove();

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
}

function resizePoints() {
  var sliderValue = document.getElementById("point-resize").value;
  // var circle1 = d3.selectAll("circle.points");
  var circle = d3.selectAll("circle.points");

  circle.attr("r", sliderValue);
}

function showPoints(id) {
  const checkboxes = [
    document.getElementById("Daniel-checkbox"),
    document.getElementById("Magnolia-checkbox"),
    document.getElementById("Jessy-checkbox"),
    document.getElementById("Drogon-checkbox"),
    document.getElementById("Viserion-checkbox"),
    document.getElementById("Rhaegal-checkbox"),
    document.getElementById("John Snow-checkbox"),
    document.getElementById("Rhaegal_2-checkbox"),
    document.getElementById("Viserion_2-checkbox"),
    document.getElementById("Samwell-checkbox"),
    document.getElementById("Gendry-checkbox"),
    document.getElementById("Gendry_2-checkbox"),
    document.getElementById("Daenerys-checkbox"),
    document.getElementById("Olenna-checkbox"),
  ];

  let checkedValues = [];
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedValues.push(checkbox.value);
    }
  });
  const filteredData = data.filter((item) =>
    checkedValues.includes(item["individual-local-identifier"])
  );

  console.log(checkedValues);

  d3.selectAll("circle.points").remove();

  var dot = svg
    .selectAll("circle")
    .data(filteredData)
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
    .attr("r", 1)
    .style("opacity", 1)
    .attr("fill", function (d) {
      return colorArray[
        names.indexOf(d["individual-local-identifier"]) % names.length
      ];
    });

  // if (!cb.checked) {
  //   d3.selectAll("circle.points#" + id).remove();
  // }
}

function selectAll(id) {
  if (document.getElementById(id).checked) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = true;
    });
    showPoints(id);
  } else {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    d3.selectAll("circle.points").remove();
  }
}
function voronoiCirlces() {
  // Assume that `voronoi` is an array of Voronoi cells, where each cell contains an array of indices representing the vertices of the cell.
}
function voronoiPlots(cellW) {
  d3.text("data/centroids.txt").then(function (data) {
    const xMin = 624079.8465020715,
      xMax = 629752.8465020715,
      yMin = 1009715.5668793379,
      yMax = 1015157.5668793379;

    // Define the cell width
    const cellWidth = cellW;

    const xScale = d3
      .scaleLinear()
      .domain([624079.8465020715, 629752.8465020715])
      .range([0, 1000]);

    const yScale = d3
      .scaleLinear()
      .domain([1009715.5668793379, 1015157.5668793379])
      .range([1000, 0]);

    // Generate a set of points
    const points = [];
    for (let x = xMin; x < xMax; x += cellWidth) {
      for (let y = yMin; y < yMax; y += cellWidth) {
        points.push([xScale(x), yScale(y)]);
      }
    }

    let centroids = data.split("\n");
    for (let i = 0; i < centroids.length; i++) {
      let coordinates = centroids[i].split(",");
      points.push([
        xScale(parseInt(coordinates[0])),
        yScale(parseInt(coordinates[1])),
      ]);
    }
    // Compute the Voronoi diagram
    const delaunay2 = new d3.Delaunay(Float64Array.of(0, 0, 0, 1, 1, 0, 1, 1));
    console.log(delaunay2);
    const delaunay = d3.Delaunay.from(points);
    const voronoi = delaunay.voronoi([0, 0, 1000, 1000]);

    // Create SVG element
    const svg = d3.select("svg#map");

    // Draw Voronoi cells
    svg
      .selectAll("path")
      .data(voronoi.cellPolygons())
      .enter()
      .append("path")
      .attr("d", (d) => "M" + d.join("L") + "Z")
      .attr("class", "cells")
      .attr("stroke", "orange")
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.5)
      .attr("fill", "none");
  });
}
