// const path = require("path");
// const { loadFilesSync } = require("@graphql-tools/load-files");
// const { mergeTypeDefs } = require("@graphql-tools/merge");

// const typesArray = loadFilesSync(path.join(__dirname, "./types"));

// module.exports = mergeTypeDefs(typesArray);

import path from "path";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const typesArray = loadFilesSync(path.join(__dirname, "."), {
  extensions: ["graphql"],
});
// console.log("arrr typesArray", typesArray);
export default mergeTypeDefs(typesArray);
