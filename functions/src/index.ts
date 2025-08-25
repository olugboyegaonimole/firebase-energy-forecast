import { onSchedule } from "firebase-functions/v2/scheduler";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

initializeApp();
const db = getFirestore();

export const simulateEnergyData = onSchedule("every 3 minutes", async () => {
  const regions = ["region-a", "region-b", "region-c"];
  const region = regions[Math.floor(Math.random() * regions.length)];

  const now = new Date();
  const demand = Math.floor(500 + Math.random() * 1000); // kWh

  const doc = {
    region,
    demand_kwh: demand,
    dow: now.getDay(),        // day of week
    hour: now.getHours(),
    minute: now.getMinutes(),
    ts: now.toISOString()
  };

  await db.collection("raw_consumption").add(doc);
  logger.info(`⚡ Simulated demand: ${region}, ${demand} kWh at ${doc.hour}:${doc.minute}`);
});
