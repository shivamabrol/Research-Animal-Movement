const svg = d3.select("svg#map");

export const colorArrayTrajectory = [
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

export const names = [
  "Daniel",
  "Magnolia",
  "Jessy",
  "Drogon",
  "Viserion",
  "Rhaegal",
  "John_Snow",
  "Rhaegal_2",
  "Viserion_2",
  "Samwell",
  "Gendry",
  "Gendry_2",
  "Daenerys",
  "Olenna",
];

const colors = {
  Daniel: "",
  Magnolia: "",
  Jessy: "",
  Drogon: "",
  Viserion: "",
  Rhaegal: "",
  John: "",
  Rhaegal_2: "",
  Viserion_2: "",
  Samwell: "",
  Gendry: "",
  Gendry_2: "",
  Daenerys: "",
  Olenna: "",
};

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

export let colorDictionary = {};

for (let key in colors) {
  colorDictionary[key] = colorArray.shift();
}

// module.exports = colorDictionary;

export function changeColor() {
  const colorPoints = svg.selectAll("circle.points").data();
  const uniqueAnimals = [
    ...new Set(colorPoints.map((item) => item["individual-local-identifier"])),
  ];

  //This doesn't let color changes on the latest one
  if (uniqueAnimals.length > 1 || uniqueAnimals.length == 0) {
    document.getElementById("colorpicker").disabled = true;
    return;
  }

  document.getElementById("colorpicker").disabled = false;

  const checkbox = document.getElementById(uniqueAnimals[0] + "-checkbox");
  checkbox.style.backgroundColor = document.getElementById("colorpicker").value;
  colorDictionary[uniqueAnimals[0]] =
    document.getElementById("colorpicker").value;
  d3.selectAll("circle")
    .data(colorPoints)
    .style("fill", function (d) {
      return document.getElementById("colorpicker").value;
    });
}

function changeColorFruits() {
  const fruitPoints = svg.selectAll("circle.fruits").data();
  const uniqueFruits = [...new Set(colorPoints.map((item) => item["type"]))];

  //This doesn't let color changes on the latest one
  if (uniqueFruits.length > 1 || uniqueFruits.length == 0) {
    document.getElementById("colorpicker-fruit").disabled = true;
    return;
  }

  document.getElementById("colorpicker-fruit").disabled = false;

  const checkbox = document.getElementById(uniqueAnimals[0]);
  checkbox.style.backgroundColor =
    document.getElementById("colorpicker-fruit").value;
  colorDictionary[uniqueAnimals[0]] =
    document.getElementById("colorpicker-fruit").value;
  d3.selectAll("circle")
    .data(fruitPoints)
    .style("fill", function (d) {
      return document.getElementById("colorpicker-fruit").value;
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
