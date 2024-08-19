const fs = require("fs");

// Read the JSON data file
fs.readFile("./dieselFilter.json", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  try {
    const records = JSON.parse(data);

    // Generate SQL insert queries with all string fields
    const sqlQueries = records.map((record) => {
      const meterReadingStr = `'${record.meterReading}'`;

      const runningDifferenceStr = `'${record.runningDifference}'`;

      const dieselFilterStr = `'${record.dieselFilter}'`;

      return `INSERT INTO periodicdieselfilter 
        (registrationNo, meterReading, runningDifference, dieselFilter) 
        VALUES 
        ('${record.registrationNo}', ${meterReadingStr}, ${runningDifferenceStr}, ${dieselFilterStr});`;
    });

    // Write SQL queries to another file
    fs.writeFile(
      "./dieselFilter1.sql",
      sqlQueries.join("\n"),
      "utf8",
      (err) => {
        if (err) {
          console.error("Error writing SQL queries to file:", err);
          return;
        }
        console.log(
          "SQL queries written to dieselFilter1.sql file successfully."
        );
      }
    );
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
});
