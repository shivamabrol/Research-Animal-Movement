import { xScale, yScale } from "./index.js";
import { data } from "./data.js";
import { colorDictionary } from "./colors.js";

const svg = d3.select("svg#map");

export function showPoints(id) {
  const checkboxes = [
    document.getElementById("Daniel-checkbox"),
    document.getElementById("Magnolia-checkbox"),
    document.getElementById("Jessy-checkbox"),
    document.getElementById("Drogon-checkbox"),
    document.getElementById("Viserion-checkbox"),
    document.getElementById("Rhaegal-checkbox"),
    document.getElementById("John_Snow-checkbox"),
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

  const selectAll = document.getElementById("all-checkbox");
  if (selectAll.checked) {
    checkboxes.forEach((checkbox) => {
      checkedValues.push(checkbox.value);
    });
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
