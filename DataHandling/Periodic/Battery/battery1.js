const fs = require("fs");

// Read the JSON data file
fs.readFile("./batteryDetail.json", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  try {
    const records = JSON.parse(data);

    // Generate SQL insert queries with all string fields
    const sqlQueries = records.map((record) => {
      const lastDateOfChangeStr = record.lastDateOfChange
        ? `'${formatDate(record.lastDateOfChange)}'`
        : "null";

      return `INSERT INTO periodicbattery 
        (registrationNo, lastDateOfChange) 
        VALUES 
        ('${record.registrationNo}', ${lastDateOfChangeStr});`;
    });

    // Write SQL queries to another file
    fs.writeFile("./battery1.sql", sqlQueries.join("\n"), "utf8", (err) => {
      if (err) {
        console.error("Error writing SQL queries to file:", err);
        return;
      }
      console.log(
        "SQL queries written to periodicbattery.sql file successfully."
      );
    });
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
});

// Function to format date as 'YYYY-MM-DD HH:MM:SS' for Datetime type
function formatDate(dateString) {
  const parts = dateString.split(/[-/]/); // Split by "-" or "/"
  if (parts.length === 3) {
    const year = parts[2].length === 4 ? parts[2] : `20${parts[2]}`; // Handle 2-digit years
    const formattedDate = `${year}-${parts[1].padStart(
      2,
      "0"
    )}-${parts[0].padStart(2, "0")} 00:00:00`;
    return formattedDate;
  } else if (parts.length === 1 && dateString.includes("-")) {
    const [day, month, year] = dateString.split("-");
    const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )} 00:00:00`;
    return formattedDate;
  } else {
    console.error("Invalid date format:", dateString);
    return "null";
  }
}
