export const isNonNegativeInteger = (value: string) =>
  /^(0|[1-9]\d*)$/.test(value);
