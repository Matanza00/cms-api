const fs = require("fs");

// Read data from the input file
fs.readFile("./periodic2_data.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  try {
    // Parse the JSON data
    const dataArray = JSON.parse(data);

    // Filter the data to include only the specific keys
    const filteredData = dataArray.map((item) => {
      return {
        "Vehicle Registration Number": item["Vehicle Registration Number"],
        "Last Date of Change": item["Last Date of Change"],
        "Previous Meter": item["Previous Meter"],
        "Running Difference": item["Running Difference"],
        "Due/Over Due": item["Due/Over Due"],
        "Oil Grade": item["Oil Grade"],
        "No of Ltrs": item["No of Ltrs"],
        "Oil Filter": item["Oil Filter"],
        "APL Card No": item["APL Card No"],
        "Issue Date": item["Issue Date"],
      };
    });

    // Write the filtered data to a new file
    fs.writeFile(
      "periodic3_data.json",
      JSON.stringify(filteredData, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing file:", err);
          return;
        }
        console.log("Filtered data has been written to periodic3_data.json");
      }
    );
  } catch (err) {
    console.error("Error parsing JSON data:", err);
  }
});
