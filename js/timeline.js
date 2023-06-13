import { data } from "./data.js";
import { xScale, yScale } from "./index.js";
import { colorDictionary } from "./colors.js";

const parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S.%L");
const svg = d3.select("svg#map");

function caller() {
  // append the svg2 object to the body of the page
  // set the dimensions and margins of the graph
  const margin = { top: 60, right: 230, bottom: 50, left: 50 },
    width = 660 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  const svg2 = d3
    .select("#timechart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  const svg3 = d3
    .select("#timechart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  changeAttribute(svg2, "speed", width, height, margin);
  changeAttributeDays(svg3, "speed", width, height, margin);
}
function changeAttribute(svg2, attribute, width, height) {
  // Parse the Data
  //////////
  // GENERAL //
  //////////
  // List of groups = header of the csv files
  const keys = ["max_speed"];

  // color palette

  const color = d3.scaleOrdinal().domain(keys).range(d3.schemeSet2);

  //stack the data?
  const stackedData = d3.stack().keys(keys)(data);

  //////////
  // AXIS //
  //////////

  // Add X axis

  const x = d3
    .scaleTime()
    .domain([new Date("2022-01-01"), new Date("2022-12-31")])
    .range([0, width]);
  console.log(x(new Date("2022-05-05")));
  let xAxisGenerator = d3.axisBottom(xScale);

  const xAxis = svg2
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(6));

  // Add X axis label:
  svg2
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height)
    .text("Time");

  // Add Y axis label:
  svg2
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", 0)
    .attr("y", -20)
    .text("Attribute")
    .attr("text-anchor", "start");

  // Add Y axis
  const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
  svg2.append("g").call(d3.axisLeft(y).ticks(5));

  //////////
  // BRUSHING AND CHART //
  //////////

  // Add a clipPath: everything out of this area won't be drawn.
  const clip = svg2
    .append("defs")
    .append("svg2:clipPath")
    .attr("id", "clip")
    .append("svg2:rect")
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
    .on("brush", updateChart); // Each time the brush selection changes, trigger the 'updateChart' function
  // Create the scatter variable: where both the circles and the brush take place
  const areaChart = svg2.append("g").attr("clip-path", "url(#clip)");

  // Area generator
  const area = d3
    .area()
    .x(function (d) {
      return x(parseTime(d.data["study-local-timestamp"]));
    })
    .y0(function (d) {
      return 10;
    })
    .y1(function (d) {
      return 10;
    });

  // Show the areas
  areaChart
    .selectAll("mylayers")
    .data(stackedData)
    .join("path")
    .attr("class", function (d) {
      return "myArea " + d.key;
    })
    .style("fill", function (d) {
      return color(d.key);
    })
    .attr("d", area);

  // Add the brushing
  areaChart.append("g").attr("class", "brush").call(brush);

  // A function that update the chart for given boundaries
  function updateChart(event, d) {
    addEventListener("dblclick", (event) => {});

    let extent = event.selection;
    // console.log([x.invert(extent[0]) + " " + x.invert(extent[1])]);
    showPointsTimeline(x.invert(extent[0]), x.invert(extent[1]));
  }
}

function changeAttributeDays(svg2, attribute, width, height) {
  // Parse the Data
  //////////
  // GENERAL //
  //////////
  // List of groups = header of the csv files
  const keys = ["max_speed"];

  // color palette

  const color = d3.scaleOrdinal().domain(keys).range(d3.schemeSet2);

  //stack the data?
  const stackedData = d3.stack().keys(keys)(data);

  //////////
  // AXIS //
  //////////

  // Add X axis

  const x = d3
    .scaleTime()
    .domain([new Date("2022-01-01T00:00:00"), new Date("2022-01-01T23:59:59")])
    .range([0, width]);
  let xAxisGenerator = d3.axisBottom(xScale);

  const xAxis = svg2
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(6));

  // Add X axis label:
  svg2
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height)
    .text("Time");

  // Add Y axis label:
  svg2
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", 0)
    .attr("y", -20)
    .text("Attribute")
    .attr("text-anchor", "start");

  // Add Y axis
  const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
  svg2.append("g").call(d3.axisLeft(y).ticks(5));

  //////////
  // BRUSHING AND CHART //
  //////////

  // Add a clipPath: everything out of this area won't be drawn.
  const clip = svg2
    .append("defs")
    .append("svg2:clipPath")
    .attr("id", "clip")
    .append("svg2:rect")
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
    .on("brush", updateChart); // Each time the brush selection changes, trigger the 'updateChart' function
  // Create the scatter variable: where both the circles and the brush take place
  const areaChart = svg2.append("g").attr("clip-path", "url(#clip)");

  // Area generator
  const area = d3
    .area()
    .x(function (d) {
      return x(parseTime(d.data["study-local-timestamp"]));
    })
    .y0(function (d) {
      return 10;
    })
    .y1(function (d) {
      return 10;
    });

  // Show the areas
  areaChart
    .selectAll("mylayers")
    .data(stackedData)
    .join("path")
    .attr("class", function (d) {
      return "myArea " + d.key;
    })
    .style("fill", function (d) {
      return color(d.key);
    })
    .attr("d", area);

  // Add the brushing
  areaChart.append("g").attr("class", "brush").call(brush);

  // A function that update the chart for given boundaries
  function updateChart(event, d) {
    addEventListener("dblclick", (event) => {});

    extent = event.selection;
    // console.log([x.invert(extent[0]) + " " + x.invert(extent[1])]);
    showPointsTimelineDays(x.invert(extent[0]), x.invert(extent[1]));
  }
}

function changeAttribute2(attribute) {
  const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg2 = d3
    .select("#timechart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S.%L");

  //Read the data
  d3.csv(
    "../data/BCI-movement-filtered.csv",

    // When reading the csv, I must format variables:
    (d) => {
      return {
        date: parseTime(d.date),
        value: d[attribute],
      };
    }
  ).then(
    // Now I can use this dataset:
    function (data1) {
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
        .x(function (d) {
          return d.date;
        })
        .y0(y(0))
        .y1(function (d) {
          return d.value;
        });

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

function showPointsTimeline(startTime, endTime) {
  console.log(startTime, endTime);

  var plotList = [];
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked == true) {
      plotList.push(checkbox.value);
    }
  });
  const circles = data.filter((item) =>
    plotList.includes(item["individual-local-identifier"])
  );

  var data2 = circles.filter(function (d) {
    return (
      new Date(d["study-local-timestamp"]) >= new Date(startTime) &&
      new Date(d["study-local-timestamp"]) <= new Date(endTime)
    );
  });
  pointsTimelinePlot(data2);
  //   gridHeatmaps("");
}
function showPointsTimelineDays(startTime, endTime) {
  var plotList = [];
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked == true) {
      plotList.push(checkbox.value);
    }
  });
  const circles = data.filter((item) =>
    plotList.includes(item["individual-local-identifier"])
  );

  var data2 = circles.filter(function (d) {
    return (
      compareTimes(d["study-local-timestamp"], startTime) &&
      compareTimes(endTime, d["study-local-timestamp"])
    );
  });
  pointsTimelinePlot(data2);
  // add condition if color grid is checked
  gridHeatmaps("");
}

function pointsTimelinePlot(data2) {
  d3.selectAll("circle.points").remove();

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
    .attr("r", 1)
    .style("opacity", 1)
    .attr("fill", function (d) {
      return colorDictionary[d["individual-local-identifier"]];
    });
}

document
  .getElementById("see-timeline")
  .addEventListener("click", caller, false);
