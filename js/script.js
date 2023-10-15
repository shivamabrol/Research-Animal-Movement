document
  .getElementById("config-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Gather input values
    const data_source = document.getElementById("data-source").value;
    const context_source = document.getElementById("context-source").value;

    // Create a JSON object with the data
    const configData = {
      data_source: data_source,
      context_source: context_source,
    };

    // Convert the JSON object to a string
    const jsonData = JSON.stringify(configData);

    // Save the JSON data to local storage
    localStorage.setItem("config", jsonData);

    alert("Configuration saved successfully.");
  });
