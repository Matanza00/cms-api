const fs = require("fs");

// Read data from the input file
fs.readFile("periodic2_data.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading input file:", err);
    return;
  }

  try {
    // Parse the JSON data
    const dataArray = JSON.parse(data);

    // Filter out specific keys
    const filteredDataArray = dataArray.map((item) => ({
      "Vehicle Registration Number": item["Vehicle Registration Number"],
      "Last Date of Air Filter Change": item["Last Date of Air Filter Change"],
      "Air Filter Change Metre Reading":
        item["Air Filter Change Metre Reading"],
      "Total Running after Air Filter change":
        item["Total Running after Air Filter change"],
      "DUE OR NOT": item["DUE OR NOT"],
      Qty: item["Qty"],
      "Air Filter": item["Air Filter"],
    }));

    // Write filtered data to a new JSON file
    fs.writeFile(
      "air_Filter_(periodic4)_data.json",
      JSON.stringify(filteredDataArray, null, 2),
      "utf8",
      (err) => {
        if (err) {
          console.error("Error writing filtered data to file:", err);
          return;
        }
        console.log(
          "Filtered data successfully written to air_Filter_(periodic4)_data.json"
        );
      }
    );
  } catch (err) {
    console.error("Error parsing input data:", err);
  }
});
