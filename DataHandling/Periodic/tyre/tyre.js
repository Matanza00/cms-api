const fs = require("fs");

// Read data from the input JSON file
fs.readFile("periodic2_data.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  try {
    const inputData = JSON.parse(data);

    // Filter out specific keys
    const filteredData = inputData.map((entry) => {
      return {
        "Vehicle Registration Number": entry["Vehicle Registration Number"],
        "Last Date of Tyre Change": entry["Last Date of Tyre Change"],
        "Tyre Change Metre Reading": entry["Tyre Change Metre Reading"],
        "Total Running after Tyre change":
          entry["Total Running after Tyre change"],
        Description: entry["Description"],
        Remarks: entry["Remarks"],
      };
    });

    // Write filtered data to a new JSON file
    fs.writeFile(
      "tyre_change_(periodic6)_data.json",
      JSON.stringify(filteredData, null, 2),
      "utf8",
      (err) => {
        if (err) {
          console.error("Error writing file:", err);
          return;
        }
        console.log(
          "Filtered data has been written to tyre_change_(periodic6)_data.json"
        );
      }
    );
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
});
