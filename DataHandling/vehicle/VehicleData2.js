const fs = require("fs");

// Read the JSON file containing the data
const rawData = fs.readFileSync("./vehicleData.json");
const jsonData = JSON.parse(rawData);

// Initialize SQL query
let sqlQuery = "";

// Iterate through each object in the JSON data
jsonData.forEach((vehicle) => {
  sqlQuery += `INSERT INTO vehicle (registrationNo, station, make, chasisNo, oddometerReading, companyId)`;
  sqlQuery += ` VALUES ('${vehicle.registrationNo}', '${vehicle.station}', '${vehicle.make}', '${vehicle.chasisNo}', '${vehicle.oddometerReading}', 25)`;
  sqlQuery += ` ON DUPLICATE KEY UPDATE`;
  sqlQuery += ` station = '${vehicle.station}',`;
  sqlQuery += ` make = '${vehicle.make}',`;
  sqlQuery += ` chasisNo = '${vehicle.chasisNo}',`;
  sqlQuery += ` oddometerReading = '${vehicle.oddometerReading}',`;
  sqlQuery += ` companyId = 25;\n`;
});

// Write the SQL query to a new file
fs.writeFileSync("./vehicleData2.sql", sqlQuery);

console.log("SQL query file generated successfully.");
