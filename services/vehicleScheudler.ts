import axios from "axios";
// const cron = require("node-cron");

// Helper function to convert each word to uppercase
const toUpperCaseWords = (str: string) => {
  return str.toUpperCase();
};

// Fetch vehicle data from the API
const fetchVehicleData = async () => {
  try {
    const response = await axios.get(
      "http://20.74.164.26:8080/api/Fms/GetActiveCrews"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
    throw error;
  }
};

const upsertVehiclesToDatabase = async (vehicles: any[]) => {
  try {
    for (const vehicleData of vehicles) {
      const vehicle = vehicleData.vehicle;

      // Check if registrationNo is not null
      if (!vehicle) {
        // console.error("Skipping vehicle with null registrationNo");
        continue;
      }

      const crewParts = vehicleData.crew.split("/").reverse();
      const station = toUpperCaseWords(crewParts[1] || "");
      const subRegion = toUpperCaseWords(crewParts[2] || "");
      const region = toUpperCaseWords(crewParts[3] || "0-0");

      await global.__db.vehicle.upsert({
        where: { registrationNo: vehicle },
        update: {
          station,
          subRegion,
          region,
          updated_at: new Date(),
        },
        create: {
          registrationNo: vehicle,
          station,
          subRegion,
          region,
          oddometerReading: vehicleData.oddometerReading || "0",
          companyId: 25,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      // console.log(`Upserted vehicle: ${vehicle}`);
    }
  } catch (error) {
    console.error("Error upserting vehicles to database:", error);
  }
};

// Main function to fetch and upsert vehicle data
const vehicleScheduler = async () => {
  try {
    const vehicleData = await fetchVehicleData();
    if (Array.isArray(vehicleData)) {
      await upsertVehiclesToDatabase(vehicleData);
    } else {
      console.error("Invalid data format received from API");
    }
  } catch (error) {
    console.error("Error in main function:", error);
  }
};

export {vehicleScheduler}

// Schedule the task to run every 10 minutes
// cron.schedule("0 8 * * *", async () => {
//   console.log("Vehicle Stations Updated from GBMS");
//   await main();
// });
