import express from "express";
import superAdminRoutes from "./superAdminRoutes";
import authRoutes from "./authRoutes";
import roleRoutes from "./roleRoutes";
import cms_userRoutes from "./cms_userRoutes";
import cms_managerRoutes from "./cms_managerRoutes";
import cms_clinicRoutes from "./cms_clinicRoutes"; // Import the new routes
import cms_fileRoutes from "./cms_fileRoutes"; // Import the new routes
import cms_providerRoutes from "./cms_providerRoutes"; // Import the new routes

const router = express.Router();

const routes = [
  { path: "/super-admin", route: superAdminRoutes },
  { path: "/auth", route: authRoutes },
  { path: "/cms_users", route: cms_userRoutes },
  { path: "/cms_managers", route: cms_managerRoutes },
  { path: "/cms_clinics", route: cms_clinicRoutes }, // Add the new routes
  { path: "/cms_files", route: cms_fileRoutes }, // Add the new routes
  { path: "/cms_providers", route: cms_providerRoutes }, // Add the new routes
  { path: "/roles", route: roleRoutes },
  // { path: "/drivers", route: driverRoutes },  // Uncomment if needed
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
