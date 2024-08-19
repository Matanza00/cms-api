const softDeleteMiddleware = async (req:any, res:any, next:any) => {
  // Modify all Prisma queries to exclude soft-deleted records
  req.prisma = {
    ...req.prisma,
    findMany: (params:any) => {
      if (!params.where) params.where = {};
      params.where.deleted_at = null;
      return req.prisma.findMany(params);
    },
    // Repeat this pattern for other Prisma query methods as needed
  };
  next();
};