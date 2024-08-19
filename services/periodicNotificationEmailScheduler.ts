// import Email from "../utils/Email";
// const { safeParseInt } = require("../utils/HelperFunction");

// async function fetchMaintenanceReports() {
//   try {
//     const vehicles = await global.__db.vehicle.findMany({
//       include: {
//         periodicMaintenance: true,
//       },
//     });

//     const maintenanceParameters =
//       await global.__db.maintenanceParameters.findMany({
//         include: {
//           priorityLevels: true,
//         },
//       });

//     const report: any = [];

//     vehicles.forEach((vehicle) => {
//       const oddometerReading = safeParseInt(vehicle.oddometerReading);
//       if (oddometerReading === null) {
//         return;
//       }

//       const { periodicMaintenance } = vehicle;

//       maintenanceParameters.forEach((parameter) => {
//         if (parameter.isKm && parameter.replaceAfterKms) {
//           const replaceAfterKms = safeParseInt(parameter.replaceAfterKms);
//           if (replaceAfterKms === null) {
//             return;
//           }

//           const validMaintenanceRecords = periodicMaintenance
//             .filter(
//               (m) =>
//                 m.periodicTypeId === parameter.id && m.status === "completed"
//             )
//             .map((m) => ({
//               ...m,
//               completionMeterReading:
//                 safeParseInt(m.completionMeterReading) || 0,
//             }))
//             .sort(
//               (a, b) => b.completionMeterReading - a.completionMeterReading
//             );

//           const lastMaintenance = validMaintenanceRecords[0];

//           if (lastMaintenance) {
//             const lastMeterReading =
//               lastMaintenance.completionMeterReading || 0;
//             const kmSinceLastMaintenance = oddometerReading - lastMeterReading;

//             if (kmSinceLastMaintenance < 0) {
//               console.warn(
//                 `Vehicle: ${vehicle.registrationNo} has a negative KM since last maintenance. Possible data issue. Skipping.`
//               );
//               return;
//             }

//             const priorityLevel = parameter.priorityLevels[0];
//             let isDue = false;
//             let isPreAlert = false;
//             let isOverdueAlert = false;

//             if (priorityLevel) {
//               const minKm = safeParseInt(priorityLevel.minKm) || 0;
//               const maxKm = safeParseInt(priorityLevel.maxKm) || Infinity;

//               if (
//                 kmSinceLastMaintenance >= minKm &&
//                 kmSinceLastMaintenance < replaceAfterKms
//               ) {
//                 isPreAlert = true;
//               } else if (
//                 kmSinceLastMaintenance >= replaceAfterKms &&
//                 kmSinceLastMaintenance < maxKm
//               ) {
//                 isDue = true;
//               } else if (kmSinceLastMaintenance >= maxKm) {
//                 isOverdueAlert = true;
//               }
//             }

//             if (isDue || isPreAlert || isOverdueAlert) {
//               report.push({
//                 registrationNo: vehicle.registrationNo,
//                 job: parameter.job,
//                 dueAtKm: replaceAfterKms,
//                 currentKm: vehicle.oddometerReading,
//                 isDue,
//                 isPreAlert,
//                 isOverdueAlert,
//                 lastMaintenance: {
//                   lastDateOfChange: lastMaintenance.completionDate,
//                   meterReading: lastMaintenance.completionMeterReading,
//                   station: lastMaintenance.station,
//                 },
//               });
//             }
//           }
//         }
//       });
//     });

//     return report;
//   } catch (error) {
//     console.error("Error fetching maintenance reports:", error);
//     throw error;
//   }
// }

// async function sendMaintenanceEmails(report: any) {
//   for (const item of report) {
//     const user = {
//       // email: "amoizj16@yopmail.com",
//       email: "ishtiaq.dogar@sospakistan.net",
//       username: "Abdul Moiz",
//       name: "Moiz",
//     };

//     if (user) {
//       let subject, alertType;

//       if (item.isDue) {
//         subject = `Maintenance Due Alert  - ${item?.job}  - ${item?.registrationNo}`;
//         alertType = "Due";
//       } else if (item.isPreAlert) {
//         subject = `Pre-Maintenance Alert - ${item?.job}  - ${item?.registrationNo}`;
//         alertType = "PreAlert";
//       } else if (item.isOverdueAlert) {
//         subject = `Overdue Maintenance Alert - ${item?.job}  - ${item?.registrationNo}`;
//         alertType = "OverdueAlert";
//       } else {
//         continue;
//       }

//       let message = `
//       <p><strong>Vehicle:</strong> ${item.registrationNo}</p>
//       <p><strong>Job:</strong> ${item.job}</p>
//       <p><strong>Due At Km:</strong> ${item.dueAtKm}</p>
//       <p><strong>Current Km:</strong> ${item.currentKm}</p>
//       <p><strong>Last Maintenance Date:</strong> ${item.lastMaintenance.lastDateOfChange}</p>
//       <p><strong>Last Meter Reading:</strong> ${item.lastMaintenance.meterReading}</p>
//       <p><strong>Station:</strong> ${item.lastMaintenance.station}</p>
//       <p><strong>Alert Type:</strong> ${alertType}</p>
//     `;

//       const emailInstance = new Email(user, message, subject);
//       await emailInstance.sendPeriodicMaintaince();
//     }
//   }
// }

// console.log("Scheduler is running and will send an email every hour");

// export { fetchMaintenanceReports, sendMaintenanceEmails };
