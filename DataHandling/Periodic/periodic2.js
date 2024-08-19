const fs = require("fs");

// Read the data from the file
fs.readFile("periodic1_data.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  try {
    // Parse the JSON data
    const dataArray = JSON.parse(data);

    // Modify the data
    const modifiedDataArray = dataArray.map((entry) => {
      if (entry.Remarks) {
        entry.Remarks = entry.Remarks.replace(/\r\n/g, "--");
      }
      return entry;
    });

    // Write the modified data to a new file
    fs.writeFile(
      "periodic2_data.json",
      JSON.stringify(modifiedDataArray, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing file:", err);
          return;
        }
        console.log(
          "Data has been modified and written to periodic2_data.json"
        );
      }
    );
  } catch (error) {
    console.error("Error parsing JSON data:", error);
  }
});
