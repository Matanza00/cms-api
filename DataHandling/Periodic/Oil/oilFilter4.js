const fs = require("fs");

// Read the JSON data file
fs.readFile("./oilFilter3.json", "utf8", (err, data) => {
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
      const oilFilterStr = `${record.oilFilter}`;

      return `INSERT INTO periodicengineoilfilter 
        (registrationNo, meterReading, runningDifference, dueStatus, quantity, oilFilter, aplCardNo) 
        VALUES 
        ('${record.registrationNo}', '${meterReadingStr}', '${runningDifferenceStr}', '${record.dueStatus}', ${record.quantity}, '${oilFilterStr}', '${record.aplCardNo}');`;
    });

    // Write SQL queries to another file
    fs.writeFile("./oilFilter4.sql", sqlQueries.join("\n"), "utf8", (err) => {
      if (err) {
        console.error("Error writing SQL queries to file:", err);
        return;
      }
      console.log("SQL queries written to sqlQueries.sql file successfully.");
    });
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
});
