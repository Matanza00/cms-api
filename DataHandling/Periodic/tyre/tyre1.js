const fs = require("fs");

// Read the JSON data file
fs.readFile("./tyre.json", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  try {
    const records = JSON.parse(data);

    // Generate SQL insert queries with all string fields
    const sqlQueries = records.map((record) => {
      const meterReadingStr =
        record.meterReading != null ? record.meterReading.toString() : "null";
      const runningDifferenceStr =
        record.runningDifference != null
          ? record.runningDifference.toString()
          : "null";
      const descriptionStr = `'${record.description}'`;
      const remarksStr = `'${record.remarks}'`;

      return `INSERT INTO periodictyre 
        (registrationNo, meterReading, runningDifference, description, remarks) 
        VALUES 
        ('${record.registrationNo}', '${meterReadingStr}', '${runningDifferenceStr}', ${descriptionStr}, ${remarksStr});`;
    });

    // Write SQL queries to another file
    fs.writeFile("./tyre1.sql", sqlQueries.join("\n"), "utf8", (err) => {
      if (err) {
        console.error("Error writing SQL queries to file:", err);
        return;
      }
      console.log("SQL queries written to periodictyre.sql file successfully.");
    });
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
});
