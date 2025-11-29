export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const getPagination = (options: PaginationOptions) => {
  const page = Math.abs(options.page || 1);
  const limit = Math.abs(options.limit || 10);
  const skip = (page - 1) * limit;
  const sort = {
    [options.sortBy || "createdAt"]: options.sortOrder === "desc" ? -1 : 1,
  };

  return { limit, skip, sort, page };
};
