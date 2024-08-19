const fs = require("fs");

// Read data from the file
fs.readFile("periodic2_data.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  try {
    const dataArray = JSON.parse(data);

    // Filter data based on specific keys
    const filteredData = dataArray.map((item) => ({
      "Vehicle Registration Number": item["Vehicle Registration Number"],
      "Last Time Battery Change date": item["Last Time Battery Change date"],
    }));

    // Write filtered data to a new JSON file
    fs.writeFile(
      "battery_Detail(periodic7)_data.json",
      JSON.stringify(filteredData, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing file:", err);
          return;
        }
        console.log(
          "Filtered data has been written to battery_Detail(periodic7)_data.json"
        );
      }
    );
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
});
