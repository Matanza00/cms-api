import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type QueryOptions<Model> = {
  //@ts-ignore
  filter?: Prisma.SelectSubset<any, Model>;
  options?: {
    limit?: number;
    page?: number;
    sortBy?: keyof Model | string;
    sortType?: "asc" | "desc";
  };
  include?: any;
  keys?: string[];
};

async function queryResources<Model>(
  model: { findMany: (args: any) => Promise<Model[]> }, // Use any or a more specific type if known
  queryOptions: QueryOptions<Model>
): Promise<Model[]> {
  const { filter = {}, options = {}, include, keys = [] } = queryOptions;
  const { limit = 10, page = 1, sortBy, sortType = "desc" } = options;
  const pageIndex = (page - 1) * limit;

  const args: any = {
    where: filter,
    skip: pageIndex,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : { id: "desc" },
    include, // Include relations if provided
  };

  if (keys.length > 0) {
    args.select = keys.reduce((acc, key) => ({ ...acc, [key]: true }), {});
  }

  return model.findMany(args);
}

export default queryResources;
