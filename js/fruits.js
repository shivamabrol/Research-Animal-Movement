import { showPoints } from "./points.js";
import { fruitTreeData } from "./data.js";
const xScale = d3
  .scaleLinear()
  .domain([624079.8465020715, 629752.8465020715])
  .range([0, 1000]);

const yScale = d3
  .scaleLinear()
  .domain([1009715.5668793379, 1015157.5668793379])
  .range([1000, 0]);

const svg = d3.select("svg#map");

export function plotFruitTrees() {
  svg.selectAll("circle.points").remove();

  // // filter out duplicates and get only unique elements
  // const uniqueFruits = [...new Set(fruitTreeData.map((item) => item["type"]))];
  // const colorList = generateRandomColors(uniqueFruits.length);
  // const container = document.getElementById("fruit-container"); // Assuming there is a container element with the ID "fruit-container"

  // let divElement = document.getElementById("fruit-container");

  // let checkboxes = divElement.querySelectorAll(".fruit-checkbox");
  // if (checkboxes.length > 0) {
  //   checkboxes.forEach((checkbox) => {
  //     checkbox.checked = true;
  //   });
  //   // return;
  // } else {
  //   uniqueFruits.forEach((fruit) => {
  //     const checkbox = document.createElement("input");
  //     checkbox.type = "checkbox";
  //     checkbox.name = "fruit";
  //     checkbox.id = fruit;
  //     checkbox.classList.add("fruit-checkbox");
  //     checkbox.value = fruit;
  //     checkbox.checked = true;
  //     const label = document.createElement("label");
  //     label.textContent = fruit;
  //     label.classList.add("fruit-checkbox-label");

  //     container.appendChild(checkbox);
  //     container.appendChild(label);
  //     container.appendChild(document.createElement("br"));
  //   });
  // }

  var tooltip = d3
    .select("body")
    .append("div")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "2px")
    .style("z-index", "10")
    .style("visibility", "hidden");
  // .text("");
  // Define the image dimensions and URL

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
    .attr("fill", "pink")
    // .on("mouseover", handleMouseOver)

    .on("mouseover", function () {
      return tooltip.style("visibility", "visible");
    })
    .on("mousemove", function (d) {
      let positionX = d.target.__data__["utm-easting"];
      let positionY = d.target.__data__["utm-northing"];
      let type = d.target.__data__.feature.split("&");
      return (
        tooltip
          .html(positionX + " <br> " + positionY + " <br> " + type)
          // .style("left", d3.mouse(this)[0] + 70 + "px")
          // .style("top", d3.mouse(this)[1] + "px")
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px")
      );
    })
    .on("mouseout", function () {
      return tooltip.style("visibility", "hidden");
    });

  showPoints("");
}
