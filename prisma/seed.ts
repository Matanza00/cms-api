// Import PrismaClient
const { PrismaClient } = require("@prisma/client");

// Create an instance of PrismaClient
const prisma = new PrismaClient();

// Define async function to populate data
async function seed() {
  try {
    // Create companies
    const company1 = await prisma.company.create({
      data: {
        email: "info@sosglobal.pk",
        name: "SOS Global Pakistan",
        address: "123 Main St",
        logo: "https://demo.technistan.com/sos-global/wp-content/uploads/2024/03/Design.png",
        no_of_users: 10,
      },
    });

    const company2 = await prisma.company.create({
      data: {
        email: "admin@example.com",
        name: "Company 2",
        address: "456 Elm St",
        logo: "logo2.png",
        no_of_users: 20,
        subscription_plan_id: 2,
      },
    });

    // Create roles
    const adminRole = await prisma.role.create({
      data: {
        role_name: "super_admin",
        companyId: company1.id,
      },
    });

    const userRole = await prisma.role.create({
      data: {
        role_name: "User",
        companyId: company1.id,
      },
    });

    // Create users
    const adminUser = await prisma.user.create({
      data: {
        email: "abdul.moiz@sosglobal.pk",
        password: "admin123",
        is_company_admin: true,
        companyId: company1.id,
        roleId: adminRole.id,
        username: "abdulmoiz",
      },
    });

    const regularUser = await prisma.user.create({
      data: {
        email: "user@example.com",
        password: "user123",
        is_company_admin: false,
        companyId: company2.id,
        roleId: userRole.id,
        username: "test",
      },
    });

    // Create permissions
    const readPermission = await prisma.permission.create({
      data: {
        permission_name: "Read",
      },
    });

    const writePermission = await prisma.permission.create({
      data: {
        permission_name: "Write",
      },
    });

    // Create field permissions
    const fieldPermission1 = await prisma.fieldPermission.create({
      data: {
        tableName: "Company",
        fieldName: "name",
        readPermission: true,
        writePermission: false,
        roleId: adminRole.id,
      },
    });

    const fieldPermission2 = await prisma.fieldPermission.create({
      data: {
        tableName: "Company",
        fieldName: "address",
        readPermission: true,
        writePermission: true,
        roleId: adminRole.id,
      },
    });

    // Create modules
    const module1 = await prisma.module.create({
      data: {
        name: "Module 1",
        description: "Description of Module 1",
      },
    });

    const module2 = await prisma.module.create({
      data: {
        name: "Module 2",
        description: "Description of Module 2",
      },
    });

    // Create role module permissions
    const roleModulePermission1 = await prisma.roleModulePermission.create({
      data: {
        roleId: adminRole.id,
        moduleId: module1.id,
        listPermission: true,
        updatePermission: true,
        deletePermission: false,
      },
    });

    const roleModulePermission2 = await prisma.roleModulePermission.create({
      data: {
        roleId: userRole.id,
        moduleId: module1.id,
        listPermission: true,
        updatePermission: false,
        deletePermission: false,
      },
    });

    console.log("Data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    // Disconnect PrismaClient to free up resources
    await prisma.$disconnect();
  }
}

// Call the seed function to populate data
seed();
