const axios = require("axios");
// const cron = require("node-cron");

const fetchAndUpdateVehicleData = async () => {
  try {
    const response = await axios.get(
      "https://mytrakker.tpltrakker.com/TrakkerServices/Api/Home/GetSOSLastLocation/SOSUser1/SOSPassword1/03300607077/null"
    );
    const vehiclesData = response.data;

    for (const vehicle of vehiclesData) {
      await global.__db.vehicle.upsert({
        where: { registrationNo: vehicle.RegNo },
        update: {
          oddometerReading: vehicle.CurrentOdo,
          make: vehicle.VrnMake,
          model: vehicle.VrnModle,
          type: vehicle.VrnCategory,
          updated_at: new Date(vehicle.GpsDateTime),
        },
        create: {
          registrationNo: vehicle.RegNo,
          oddometerReading: vehicle.CurrentOdo,
          make: vehicle.VrnMake,
          model: vehicle.VrnModle,
          type: vehicle.VrnCategory,
          commisionDate: new Date().toISOString(),
          companyId: 25,
        },
      });
    }

    console.log("Vehicle data updated successfully.");
  } catch (error) {
    console.error("Error updating vehicle data:", error);
  }
};

export {fetchAndUpdateVehicleData}
// cron.schedule("0 9 * * *", fetchAndUpdateVehicleData);
