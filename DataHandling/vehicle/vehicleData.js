const fs = require("fs");

// Read the JSON file
const rawData = fs.readFileSync("./periodic2_data.json");
const jsonData = JSON.parse(rawData);

// Initialize an array to store extracted data
const extractedData = [];

// Loop through each object in the original JSON data
jsonData.forEach((obj) => {
  // Extract desired fields
  const {
    "Vehicle Registration Number": registrationNo,
    "Vehicle Region Station": station,
    make,
    "Chassis Number": chasisNo,
    "Current Meter": oddometerReading,
  } = obj;

  // Create a new object with extracted data
  const extractedObj = {
    registrationNo,
    station,
    make,
    chasisNo,
    oddometerReading,
  };

  // Push the new object to the extractedData array
  extractedData.push(extractedObj);
});

// Convert extractedData array to JSON format
const extractedJson = JSON.stringify(extractedData, null, 2);

// Write the extracted JSON data to a new file
fs.writeFileSync("./vehicleData.json", extractedJson);
