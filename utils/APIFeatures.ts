// import { Prisma, PrismaClient } from "@prisma/client";

// class APIFeatures {
//   public query: Prisma.SelectSubset<any, any>;
//   private queryStr: Record<string, any>;
//   private searchArray: string[];

//   constructor(
//     private readonly prisma: PrismaClient,
//     query: Prisma.SelectSubset<any, any>,
//     queryStr: Record<string, any>,
//     searchArray: string[] = []
//   ) {
//     this.query = query;
//     this.queryStr = queryStr;
//     this.searchArray = searchArray;
//   }

//   filter() {
//     const queryObj: Record<string, any> = { ...this.queryStr };

//     const excludedFields: string[] = [
//       "page",
//       "limit",
//       "sort",
//       "fields",
//       "search",
//     ];
//     excludedFields.forEach((el: string) => delete queryObj[el]);

//     Object.keys(queryObj).forEach((key: string) => {
//       if (["gt", "gte", "lt", "lte"].includes(key)) {
//         const [field, operation] = key.split("_"); // assuming format like price_gt
//         queryObj[field] = { ...queryObj[field], [operation]: queryObj[key] };
//         delete queryObj[key];
//       }
//     });

//     if (this.queryStr.search && this.searchArray.length > 0) {
//       queryObj.OR = this.searchArray.map((field: string) => ({
//         [field]: { contains: this.queryStr.search, mode: "insensitive" },
//       }));
//     }

//     this.query.where = { ...this.query.where, ...queryObj };
//     return this;
//   }

//   sort() {
//     if (this.queryStr.sort) {
//       const sortBy = this.queryStr.sort.split(",").map((field: string) => {
//         const direction = field.startsWith("-") ? "desc" : "asc";
//         field = field.startsWith("-") ? field.substring(1) : field;
//         return {
//           [field]: direction,
//         };
//       });
//       this.query.orderBy = sortBy as any; // assuming this.query.orderBy is of type any
//     }
//     return this;
//   }

//   limitFields() {
//     if (this.queryStr.fields) {
//       const fields = this.queryStr.fields
//         .split(",")
//         .reduce((acc: any, cur: string) => ({ ...acc, [cur]: true }), {});
//       this.query.select = fields as any; // assuming this.query.select is of type any
//     }
//     return this;
//   }

//   paginate() {
//     const limit = parseInt(this.queryStr.limit) || 10;
//     const page = parseInt(this.queryStr.page) || 1;
//     const skip = (page - 1) * limit;

//     this.query.take = limit as any; // assuming this.query.take is of type any
//     this.query.skip = skip as any; // assuming this.query.skip is of type any

//     return this;
//   }
// }

// export default APIFeatures;
