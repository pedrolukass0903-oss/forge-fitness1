import { readTable } from "./_lib.js";

export default async function handler(req, res) {
  return readTable(req, res, "schedules", "day_of_week");
}
