// // import {
// //   fetchMaintenanceReports,
// //   sendMaintenanceEmails,
// // } from "./periodicNotificationEmailScheduler";
// import { fetchAndUpdateVehicleData } from "./tplScheduler";
// import { vehicleScheduler } from "./vehicleScheudler";

// const cron = require("node-cron");

// cron.schedule("*/40 * * * *", async () => {
//   console.log("sending mail");
//   try {
//     const report = await fetchMaintenanceReports();
//     await sendMaintenanceEmails(report);
//     console.log("sending mail");
//   } catch (error) {
//     console.error("Error in scheduled task:", error);
//   }
// });

// // cron.schedule("0 */5 * * *", fetchAndUpdateVehicleData);
// // cron.schedule("* * * * *", fetchAndUpdateVehicleData);

// cron.schedule("* * * * *", fetchAndUpdateVehicleData);

// cron.schedule("*/30 * * * *", async () => {
//   console.log("Vehicle Stations Updated from GBMS");
//   await vehicleScheduler();
// });
