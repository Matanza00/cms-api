const fs = require("fs");

// Read the JSON data file
fs.readFile("./airfilter1.json", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  try {
    const records = JSON.parse(data);

    // Generate SQL insert queries with all string fields
    const sqlQueries = records.map((record) => {
      const meterReadingStr = `${record.meterReading}`;
      const runningDifferenceStr = `${record.runningDifference}`;
      const airFilterStr = `${record.airFilter}`;

      return `INSERT INTO periodicairfilter 
        (registrationNo, meterReading, runningDifference, dueStatus, quantity, airFilter) 
        VALUES 
        ('${record.registrationNo}', '${meterReadingStr}', '${runningDifferenceStr}', '${record.dueStatus}', ${record.quantity}, '${airFilterStr}');`;
    });

    // Write SQL queries to another file
    fs.writeFile("./airFilter2.sql", sqlQueries.join("\n"), "utf8", (err) => {
      if (err) {
        console.error("Error writing SQL queries to file:", err);
        return;
      }
      console.log("SQL queries written to airFilter.sql file successfully.");
    });
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
});
