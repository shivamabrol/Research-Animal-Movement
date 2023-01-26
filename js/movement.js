d3.select("svg")
  .selectAll("circle")
  .data([1, 2, 3, 4, 5])
  .enter()
  .append("circle")
  .attr("cx", function (d) {
    return d * 50;
  })
  .attr("cy", 50)
  .attr("r", 20);
