function plotLinesBCI() {
  //   individual = "all",
  //   starttime = "2000-07-07 22:07:07.000",
  //   endtime = "2100-07-07 22:07:07.000"
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
