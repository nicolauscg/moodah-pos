import { schema } from "../index";
import { writeFile } from "fs";
import { printSchema } from "graphql";

writeFile("src/graphql/schemas/schema.gql", printSchema(schema), err => {
  if (err) {
    throw err;
  }
});
