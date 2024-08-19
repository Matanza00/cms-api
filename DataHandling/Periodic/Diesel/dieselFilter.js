const fs = require("fs");

// Read data from the input file
fs.readFile("periodic2_data.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading input file:", err);
    return;
  }

  try {
    const inputData = JSON.parse(data);

    // Filter out specific keys from the input data
    const filteredData = inputData.map((item) => ({
      "Vehicle Registration Number": item["Vehicle Registration Number"],
      "Last Date of Diesel Filter Change":
        item["Last Date of Diesel Filter Change"],
      "Diesel Filter Change Metre Reading":
        item["Diesel Filter Change Metre Reading"],
      "Total Running after Diesel Filter change":
        item["Total Running after Diesel Filter change"],
      "Diesel Filter": item["Diesel Filter"],
    }));

    // Write filtered data to a new JSON file
    fs.writeFile(
      "diesel_Filter_(periodic5)_data.json",
      JSON.stringify(filteredData, null, 2),
      "utf8",
      (err) => {
        if (err) {
          console.error("Error writing filtered data to file:", err);
          return;
        }
        console.log(
          "Filtered data has been written to diesel_Filter_(periodic5)_data.json"
        );
      }
    );
  } catch (error) {
    console.error("Error parsing input data as JSON:", error);
  }
});
