import { xScale, yScale } from "./index.js";
import { data } from "./data.js";
import { colorDictionary } from "./colors.js";

const svg = d3.select("svg#map");

export function showPoints(id) {
  id = id.currentTarget.id;

  const checkboxes = [
    document.getElementById("Daniel-checkbox"),
    document.getElementById("Magnolia-checkbox"),
    document.getElementById("Jessy-checkbox"),
    document.getElementById("Drogon-checkbox"),
    document.getElementById("Viserion-checkbox"),
    document.getElementById("Rhaegal-checkbox"),
    document.getElementById("John_Snow-checkbox"),
    document.getElementById("Samwell-checkbox"),
    document.getElementById("Gendry-checkbox"),
    document.getElementById("Daenerys-checkbox"),
    document.getElementById("Olenna-checkbox"),
  ];

  let checkedValues = [];
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedValues.push(checkbox.value);
    }
  });

  const selectAll = document.getElementById("all-checkbox");
  if (id == selectAll.id) {
    if (selectAll.checked) {
      checkboxes.forEach((checkbox) => {
        checkbox.checked = true;
        checkedValues.push(checkbox.value);
      });
    } else {
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
      checkedValues = [];
    }
  }

  let resizer = document.getElementById("point-resize");
  let color = document.getElementById("colorpicker");

  if (checkedValues.length == 0 || checkedValues.length > 1) {
    resizer.disabled = true;
    color.disabled = true;
  } else {
    resizer.disabled = false;
    color.disabled = false;
  }

  const filteredData = data.filter((item) =>
    checkedValues.includes(item["individual-local-identifier"])
  );

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
      return colorDictionary[d["individual-local-identifier"]];
    });

  // if (!cb.checked) {
  //   d3.selectAll("circle.points#" + id).remove();
  // }
}

export function showData(data) {
  d3.selectAll("circle.points").remove();

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
    .attr("r", 1)
    .style("opacity", 1)
    .attr("fill", function (d) {
      return colorDictionary[d["individual-local-identifier"]];
    });
}

setTimeout(function () {
  // Your function code here
  showPoints("");
}, 500); // 1000 milliseconds = 1 second
