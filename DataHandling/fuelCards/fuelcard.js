const fs = require("fs");

// Function to read the JSON file and convert it to SQL insert statements
function generateSQL() {
  fs.readFile("./cards.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }

    try {
      // Parse the JSON data
      const cards = JSON.parse(data);

      // Create SQL queries for each card
      const queries = cards.map((card) => {
        return `INSERT INTO fuelcards (cardNumber, vehicleId, station, cardType) VALUES ('${card.cardNumber}', '${card.registrationNo}', '${card.station}', '${card.cardType}');`;
      });

      // Combine all SQL queries into a single string
      const sqlScript = queries.join("\n");

      // Write the SQL script to a file
      fs.writeFile("./output.sql", sqlScript, "utf8", (writeErr) => {
        if (writeErr) {
          console.error("Error writing to file:", writeErr);
          return;
        }
        console.log("SQL script has been successfully saved to output.sql");
      });
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
    }
  });
}

// Run the function
generateSQL();
