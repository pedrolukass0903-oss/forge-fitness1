import { readTable } from "./_lib.js";

export default async function handler(req, res) {
  return readTable(req, res, "trainings", "sort_order");
}
