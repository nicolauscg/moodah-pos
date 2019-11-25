import * as R from "ramda";

// source https://github.com/ramda/ramda/wiki/Cookbook#rename-keys-of-an-object
export const renameKeys = R.curry((keysMap, obj) =>
  R.reduce(
    (acc, key) => R.assoc(keysMap[key] || key, obj[key], acc),
    {},
    R.keys(obj)
  )
);

export const radioGroupToOdoo = R.ifElse(
  R.isEmpty,
  () => null,
  R.view(R.lensIndex(0))
);
