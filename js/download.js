function calculateEncodedIntermediateDirectionalString(
  points,
  distanceThreshold
) {
  if (points.length < 2) {
    return "Not enough points for directions.";
  }

  const encodedDirections = [];
  let previousPoint = points[0];

  for (let i = 1; i < points.length; i++) {
    const current = points[i];

    // Calculate the distance between the current and previous points.
    const distance = Math.sqrt(
      Math.pow(current["utm-easting"] - previousPoint["utm-easting"], 2) +
        Math.pow(current["utm-northing"] - previousPoint["utm-northing"], 2)
    );

    if (distance >= distanceThreshold) {
      let direction = calculateDirectionUTM(
        current["utm-easting"],
        current["utm-northing"],
        previousPoint["utm-easting"],
        previousPoint["utm-northing"]
      );

      // Calculate the horizontal and vertical differences between current and previous points.

      encodedDirections.push(direction);
      previousPoint = current;
    }
  }

  return encodedDirections.join("");
}

function convertToCSV(arr) {
  const array = [Object.keys(arr[0])].concat(arr);

  return array
    .map((it) => {
      return Object.values(it).toString();
    })
    .join("\n");
}

function exportData() {
  var a = document.createElement("a");
  var exportData = d3.selectAll("circle.points").data();
  console.log(exportData);
  a.href = URL.createObjectURL(
    new Blob([convertToCSV(exportData)], { type: "application/csv" })
  );
  a.download = "myFile.csv";
  a.click();
}

// Example usage with UTM coordinates and a distance threshold of 100 units:

function calculateString(id) {
  const utmPoints = d3.selectAll(".points").data();
  const distanceThreshold =
    5.5 * document.getElementById("directional-diff").value;
  document.getElementById(
    "directional-diff-text"
  ).textContent = `${distanceThreshold} m`;

  const finalString = calculateEncodedIntermediateDirectionalString(
    utmPoints,
    distanceThreshold
  );
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(finalString)
  );
  element.setAttribute("download", "directionalData");
  element.click();
}

export function seeDistance(id) {
  const distanceThreshold = 5.5 * parseInt(document.getElementById(id).value);
  document.getElementById(id + "-text").textContent = `${distanceThreshold} m`;
  //   console.log("distance seen ");
}

function calculateDirectionUTM(
  utmEasting1,
  utmNorthing1,
  utmEasting2,
  utmNorthing2
) {
  // Calculate the differences in UTM coordinates
  const deltaEasting = utmEasting2 - utmEasting1;
  const deltaNorthing = utmNorthing2 - utmNorthing1;

  // Calculate the angle using atan2 and convert it to degrees
  let angle = (Math.atan2(deltaNorthing, deltaEasting) * 180) / Math.PI;

  // Normalize the angle to be within the range of [0, 360)
  angle = (angle + 360) % 360;

  // Map the angle to the corresponding direction
  if (angle >= 337.5 || angle < 22.5) {
    return "E";
  } else if (angle >= 22.5 && angle < 67.5) {
    return "1";
  } else if (angle >= 67.5 && angle < 112.5) {
    return "N";
  } else if (angle >= 112.5 && angle < 157.5) {
    return "2";
  } else if (angle >= 157.5 && angle < 202.5) {
    return "W";
  } else if (angle >= 202.5 && angle < 247.5) {
    return "3";
  } else if (angle >= 247.5 && angle < 292.5) {
    return "S";
  } else if (angle >= 292.5 && angle < 337.5) {
    return "4";
  } else {
    return "";
  }
}

document.getElementById("find-all-pattern").addEventListener(
  "click",
  function (event) {
    calculateString(event.target.id);
  },
  false
);

document.getElementById("directional-diff").addEventListener(
  "input",
  function (event) {
    // console.log(id.target);
    seeDistance(event.target.id);
  },
  false
);

document.getElementById("download").addEventListener("click", function () {
  exportData();
});
