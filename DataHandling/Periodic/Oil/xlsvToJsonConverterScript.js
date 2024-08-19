const XLSX = require("xlsx");
const fs = require("fs");

// Function to convert XLSX to JSON
function xlsxToJson(inputFile, outputFile) {
  // Load the XLSX file
  const workbook = XLSX.readFile(inputFile);

  // Select the first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert the sheet to JSON
  let jsonData = XLSX.utils.sheet_to_json(worksheet);
  jsonData = jsonData.map((entry) => {
    console.log();
    // if (entry.lastDateOfChange !== "") {
    //   // Assuming the 'lastDateOfChange' column is a string in the format "yyyy-mm-dd"
    //   // Parse it into a JavaScript Date object
    //   entry.lastDateOfChange = new Date(entry.lastDateOfChange.toString());
    // }
    return entry;
  });
  // Write JSON data to output file
  fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 4));

  console.log(`Conversion successful. JSON data written to ${outputFile}`);
}

// Specify input and output file paths
const inputFile = "./oilFilterChangeData.xlsx"; // Change this to your input file path
const outputFile = "oilFilterChangeData.json"; // Change this to your desired output file path

// Call the function to convert
xlsxToJson(inputFile, outputFile);
