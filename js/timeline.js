import { data } from "./data.js";
import { xScale, yScale } from "./index.js";
import { colorDictionary } from "./colors.js";
import { gridHeatmaps } from "./heatmap.js";
import { plotPattern, getTotalClicks } from "./grid.js";
import { plotCaller } from "./summarize.js";
import { plotTrajectoryBCI } from "./trajectory.js";

const parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S.%L");
const svg = d3.select("svg#map");
const minDate = new Date("06-01-2022");

const maxDate = new Date("04-01-2023");

function compareTimes(first, second) {
  const dateString1 = first;
  const dateString2 = second;
  const dateObj1 = new Date(dateString1);
  const dateObj2 = new Date(dateString2);

  const hours1 = dateObj1.getHours();
  const minutes1 = dateObj1.getMinutes();
  const seconds1 = dateObj1.getSeconds();

  const hours2 = dateObj2.getHours();
  const minutes2 = dateObj2.getMinutes();
  const seconds2 = dateObj2.getSeconds();

  if (hours1 > hours2) {
    return true;
  } else if (hours1 < hours2) {
    return false;
  } else if (minutes1 > minutes2) {
    return true;
  } else if (minutes1 < minutes2) {
    return false;
  } else if (seconds1 > seconds2) {
    return true;
  } else if (seconds1 < seconds2) {
    return false;
  } else {
    return true;
  }
}

function caller() {
  // append the svg2 object to the body of the page
  // set the dimensions and margins of the graph
  const margin = { top: 0, right: 50, bottom: 30, left: 50 },
    width = 900 - margin.left - margin.right,
    height = 30;
  const containerDiv = d3
    .select("#timechart") // You can select a different parent element if needed
    .append("div")
    .attr("id", "svgContainer") // Set an ID for the container div
    .style("display", "flex")
    .style("justify-content", "space-between")
    .style("height", "300px"); // Set the desired height

  const svg2 = containerDiv
    .append("svg")
    .attr("id", "timeline1")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Create and append the right SVG
  const svg3 = containerDiv
    .append("svg")
    .attr("id", "timeline2")
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
  // const stackedData = d3.stack().keys(keys)(data);

  //////////
  // AXIS //
  //////////

  // Add X axis
  // Calculate the minimum and maximum dates from your data
  const minDate = new Date("06-01-2022");

  const maxDate = new Date("04-01-2023");

  const ticks = d3.timeMonth.every(1).range(minDate, maxDate);

  const x = d3.scaleTime().domain([minDate, maxDate]).range([0, width]);

  // Add one more tick after the last tick
  const lastTick = new Date(ticks[ticks.length - 1]);
  const oneMonthLater = new Date(lastTick);
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
  ticks.push(oneMonthLater);

  const xAxis = svg2
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(
      d3.axisBottom(x).tickValues(ticks).tickFormat(d3.timeFormat("%b %Y"))
    );
  // Add X axis label:
  svg2
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width / 2)
    .attr("y", height - 15)
    .text("Select the day");

  // Add Y axis
  // const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
  // svg2.append("g").call(d3.axisLeft(y).ticks(5));

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
    .brushX()
    // Add the brush feature using the d3.brush function
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
      return x(parseTime(d.data["date"]));
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
    .data([])
    .join("path")
    .attr("class", function (d) {
      return "myArea " + d.key;
    })
    .attr("id", "mybrush")
    .style("fill", function (d) {
      return color(d.key);
    })
    .attr("d", area);

  // Add the brushing
  areaChart.append("g").attr("class", "brush").call(brush);

  // A function that update the chart for given boundaries
  function updateChart(event, d) {
    addEventListener("dblclick", (event) => {});
    const x = d3.scaleTime().domain([minDate, maxDate]).range([0, width]);
    const x1 = d3
      .scaleTime()
      .domain([
        new Date("2022-01-01T00:00:00"),
        new Date("2022-01-01T23:59:59"),
      ])
      .range([0, width]);

    let timeStart = x1.invert(
      parseInt(d3.select("#timeline2").select(".selection").attr("x"))
    );
    let timeEnd = x1.invert(
      parseInt(d3.select("#timeline2").select(".selection").attr("width")) +
        parseInt(d3.select("#timeline2").select(".selection").attr("x"))
    );

    let extent = event.selection;
    let dayStart = x.invert(extent[0]);
    let dayEnd = x.invert(extent[1]);
    // console.log(isDateValid(dayStart));
    // console.log(dayStart, dayEnd, timeStart, timeEnd);
    // // console.log([x.invert(extent[0]) + " " + x.invert(extent[1])]);

    let data2 = filterDataset(dayStart, dayEnd, timeStart, timeEnd);
    showPointsTimeline(data2);
    // // console.log([x.invert(extent[0]) + " " + x.invert(extent[1])]);
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
  // const stackedData = d3.stack().keys(keys)(data);

  //////////
  // AXIS //
  //////////

  // Add X axis

  // Adjust the x-axis to display "12 AM" as the starting point and "11:59 PM" as the ending point
  const x = d3
    .scaleTime()
    .domain([new Date("2022-01-01T00:00:00"), new Date("2022-01-01T23:59:59")])
    .range([0, width]);

  // Calculate the ticks for the axis
  const tickInterval = d3.timeHour.every(2);
  const tickStart = new Date("2022-01-01T00:00:00");
  const tickEnd = new Date("2022-01-01T23:59:59");
  const ticks = [];
  let currentTick = new Date(tickStart);

  while (currentTick <= tickEnd) {
    ticks.push(new Date(currentTick));
    currentTick = d3.timeHour.offset(currentTick, 2);
  }

  // Add "11:59 PM" as one tick after the last tick
  const lastTick = new Date(ticks[ticks.length - 1]);
  const oneMinuteBeforeMidnight = new Date(lastTick);
  oneMinuteBeforeMidnight.setMinutes(59); // Set the minutes to 59
  oneMinuteBeforeMidnight.setHours(23); // Set the hours to 23
  ticks.push(oneMinuteBeforeMidnight);

  // Format ticks
  const xAxis = svg2
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(
      d3.axisBottom(x).tickValues(ticks).tickFormat(d3.timeFormat("%I:%M %p"))
    );

  // ...

  // Add X axis label:
  svg2
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width / 2)
    .attr("y", height - 15)
    .text("Select the time");

  // Add Y axis label:

  // Add Y axis
  // const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
  // svg2.append("g").call(d3.axisLeft(y).ticks(5));

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
      return x(parseTime(d.data["date"]));
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
    .data([])
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

    const x1 = d3.scaleTime().domain([minDate, maxDate]).range([0, width]);
    const x = d3
      .scaleTime()
      .domain([
        new Date("2022-01-01T00:00:00"),
        new Date("2022-01-01T23:59:59"),
      ])
      .range([0, width]);

    let dayStart = x1.invert(
      parseInt(d3.select("#timeline1").select(".selection").attr("x"))
    );
    let dayEnd = x1.invert(
      parseInt(d3.select("#timeline1").select(".selection").attr("width")) +
        parseInt(d3.select("#timeline1").select(".selection").attr("x"))
    );

    let extent = event.selection;
    let timeStart = x.invert(extent[0]);
    let timeEnd = x.invert(extent[1]);

    console.log(timeStart, timeEnd);
    // console.log(isDateValid(dayStart));
    // console.log(dayStart, dayEnd, timeStart, timeEnd);
    // // console.log([x.invert(extent[0]) + " " + x.invert(extent[1])]);

    let data2 = filterDataset(dayStart, dayEnd, timeStart, timeEnd);
    showPointsTimeline(data2);
    // showPointsTimelineDays(x.invert(extent[0]), x.invert(extent[1]));
  }
}

function calculateDynamicDataset() {
  var plotList = [];
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked == true) {
      plotList.push(checkbox.value);
    }
  });
  return data.filter((item) =>
    plotList.includes(item["individual-local-identifier"])
  );
}
function filterDataset(startingDay, endingDay, startingTime, endingTime) {
  const circles = calculateDynamicDataset();

  return circles.filter((item) => {
    const timestamp = new Date(item["study-local-timestamp"]);
    const studyDay = timestamp.toISOString().split("T")[0];
    const studyTime = timestamp.toISOString().split("T")[1].split(".")[0]; // Extract time part

    // Check if the study-local-timestamp is within the specified date and time range
    const isDateValid = (startingDay, endingDay) => {
      if (!validDate(startingDay) || !validDate(endingDay)) {
        return true; // Ignore the date check if starting or ending date is not provided
      }
      return (
        new Date(studyDay) >= new Date(startingDay) &&
        new Date(studyDay) <= new Date(endingDay)
      );
    };

    const isTimeValid = (start, end) => {
      if (!validDate(start) || !validDate(end)) {
        return true; // Ignore the time check if starting or ending time is not provided
      }
      return compareTimes(timestamp, start) && compareTimes(end, timestamp);
    };

    if (
      isDateValid(startingDay, endingDay) &&
      isTimeValid(startingTime, endingTime)
    ) {
      return true;
    }

    return false;
  });
}

function validDate(dateString) {
  const date = new Date(dateString);
  // Check if the date is a valid date and the date string was parsed correctly
  return !isNaN(date.getTime());
}

function showPointsTimeline(data2) {
  // console.log(startTime, endTime);

  pointsTimelinePlot(data2);
  if (document.getElementById("find-heatmap").checked) {
    gridHeatmaps("", true);
  }
  if (document.getElementById("pattern-toggle").checked) {
    let clicks = getTotalClicks();
    plotPattern(clicks);
  }
  if (document.getElementById("voronoi-plot").checked) {
    plotCaller();
  }

  if (document.getElementById("lines-add").checked) {
    plotTrajectoryBCI();
  }
}
function showPointsTimelineDays(startTime, endTime) {
  var plotList = [];
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked == true) {
      plotList.push(checkbox.value);
    }
  });
  if (document.getElementById("all-checkbox").checked) {
    checkboxes.forEach((checkbox) => {
      plotList.push(checkbox.value);
    });
  }
  const circles = data.filter((item) =>
    plotList.includes(item["individual-local-identifier"])
  );

  var data2 = circles.filter(function (d) {
    return (
      compareTimes(d["study-local-timestamp"], startTime) &&
      compareTimes(endTime, d["study-local-timestamp"])
    );
  });
  // console.log(data2.length);
  pointsTimelinePlot(data2);
  // add condition if color grid is checked
  if (document.getElementById("find-heatmap").checked) {
    gridHeatmaps("", true);
  }
  if (document.getElementById("pattern-toggle").checked) {
    let clicks = getTotalClicks();
    plotPattern(clicks);
  }
  if (document.getElementById("voronoi-plot").checked) {
    plotCaller();
  }

  if (document.getElementById("lines-add").checked) {
    plotTrajectoryBCI();
  }
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

setTimeout(function () {
  // Your function code here
  caller();
}, 1000); // 1000 milliseconds = 1 second

// document
//   .getElementById("see-timeline")
//   .addEventListener("click", caller, false);
