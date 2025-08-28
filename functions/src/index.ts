import { onSchedule } from "firebase-functions/v2/scheduler";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

initializeApp();
const db = getFirestore();

export const simulateEnergyData = onSchedule("every 3 minutes", async () => {
  const regions = ["region-a", "region-b", "region-c"];
  const energyTypes = ["solar", "wind", "coal"]; // ✅ Add energy types

  const region = regions[Math.floor(Math.random() * regions.length)];
  const energyType = energyTypes[Math.floor(Math.random() * energyTypes.length)];

  const now = new Date();

  // Instead of flat random, bias the demand depending on energy type
  let base = 500;
  if (energyType === "solar") base = 600 + Math.random() * 200;  // solar tends to be medium-high
  if (energyType === "wind") base = 400 + Math.random() * 300;   // wind fluctuates more
  if (energyType === "coal") base = 800 + Math.random() * 400;   // coal is high and steady

  const demand = Math.floor(base);

  const doc = {
    region,
    energy_type: energyType, // ✅ New field
    demand_kwh: demand,
    dow: now.getDay(),
    hour: now.getHours(),
    minute: now.getMinutes(),
    ts: now.toISOString()
  };

  await db.collection("raw_consumption").add(doc);
  logger.info(`⚡ Simulated demand: ${region}, ${energyType}, ${demand} kWh at ${doc.hour}:${doc.minute}`);
});
