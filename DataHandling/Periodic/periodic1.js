const fs = require("fs");

// Read the data array from a file
fs.readFile("./PeriodicData.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  // Parse JSON data
  const dataArray = JSON.parse(data);

  // Iterate over each object in the array
  dataArray.forEach((obj) => {
    // Split the "Vehicle Registration Number" by "\r\n"
    const regNumberParts = obj["Vehicle Registration Number"].split("\r\n");

    // Set "Vehicle Registration Number" to the first part
    obj["Vehicle Registration Number"] = regNumberParts[0];

    // Add "Chassis Number" key and set its value to the second part
    obj["Chassis Number"] = regNumberParts[1];

    // Remove "\r\n" from "Vehicle Registration Number"
    obj["Vehicle Registration Number"] = obj[
      "Vehicle Registration Number"
    ].replace(/\r\n/g, "");
  });

  // Write modified data back to file
  fs.writeFile(
    "periodic1_data.json",
    JSON.stringify(dataArray, null, 2),
    "utf8",
    (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("Data has been modified and saved to modified_data.json");
    }
  );
});
