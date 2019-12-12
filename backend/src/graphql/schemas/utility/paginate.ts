import { CreateSearchReadParams } from "nodoo/dist/types/controllers/http/operations/model/searchRead";
import { ResolverArgs } from "./types/args";

const paginateOperationParam = (
  params: CreateSearchReadParams,
  args: ResolverArgs
): CreateSearchReadParams => ({
  ...params,
  limit: args.input.first,
  offset: args.input.offset
});

export { paginateOperationParam };
