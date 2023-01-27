d3.select("svg#map")
  .selectAll("circle")
  .data([1, 2, 3, 4, 5])
  .enter()
  .append("circle")
  .attr("cx", function (d) {
    return d * 50;
  })
  .attr("cy", 50)
  .attr("r", 20);
attr("fill", "red");

// .fill("red");
