import { readFileSync } from "fs";
// import test from "./test.json";

const data = readFileSync("./data.json");

const { users, events, locations, participants } = JSON.parse(data);

export { users, events, locations, participants };
