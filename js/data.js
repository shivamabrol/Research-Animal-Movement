export let data;
d3.csv("../data/BCI-movement-data.csv")
  .then(function (data1) {
    // Do something with the data here
    data = data1;
    // console.log(data);
  })
  .catch(function (error) {
    console.log(error); // log any errors to the console
  }); // declare a variable to store the data

export let fruitTreeData;

d3.csv("../data/fruit_tree.csv")
  .then(function (data1) {
    fruitTreeData = data1; // assign the data to the variable
    // Do something with the data here
  })
  .catch(function (error) {
    console.log(error); // log any errors to the console
  });