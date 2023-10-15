export let data;
export let fruitTreeData;
$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});
// Initialize variables to store data

// Function to load and visualize data
function loadData(dataSource, dataVariable) {
  d3.csv(dataSource)
    .then(function (data1) {
      // Assign the data to the specified variable
      data = data1;
      // Now you can work with the loaded data
      console.log(data);
    })
    .catch(function (error) {
      console.log(error); // log any errors to the console
    });
}
function loadData2(dataSource, dataVariable) {
  d3.csv(dataSource)
    .then(function (data1) {
      // Assign the data to the specified variable
      fruitTreeData = data1;
      // Now you can work with the loaded data
      console.log(fruitTreeData);
    })
    .catch(function (error) {
      console.log(error); // log any errors to the console
    });
}

// Retrieve the configuration data from local storage
const configData = JSON.parse(localStorage.getItem("config"));

if (configData) {
  // Use the data source URLs from the configuration
  const data_source = configData.data_source;
  const context_source = configData.context_source;

  // Load data for "data" and "context" using the configuration
  loadData(data_source, data);
  loadData2(context_source, fruitTreeData);
} else {
  // If no configuration data is found, use default data sources
  loadData(
    "https://raw.githubusercontent.com/shivamabrol/Research-Animal-Movement/main/data/BCI-movement-data.csv",
    data
  );
  loadData2(
    "https://raw.githubusercontent.com/shivamabrol/Research-Animal-Movement/main/data/fruit_tree.csv",
    fruitTreeData
  );
}
