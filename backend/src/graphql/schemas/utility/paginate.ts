const paginateOperationParam = (params, args) => ({
  ...params,
  limit: args.input.first,
  offset: args.input.offset
});

export { paginateOperationParam };
