"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateEnergyData = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const logger = __importStar(require("firebase-functions/logger"));
(0, app_1.initializeApp)();
const db = (0, firestore_1.getFirestore)();
exports.simulateEnergyData = (0, scheduler_1.onSchedule)("every 3 minutes", async () => {
    const regions = ["region-a", "region-b", "region-c"];
    const energyTypes = ["solar", "wind", "coal"]; // ✅ Add energy types
    const region = regions[Math.floor(Math.random() * regions.length)];
    const energyType = energyTypes[Math.floor(Math.random() * energyTypes.length)];
    const now = new Date();
    // Instead of flat random, bias the demand depending on energy type
    let base = 500;
    if (energyType === "solar")
        base = 600 + Math.random() * 200; // solar tends to be medium-high
    if (energyType === "wind")
        base = 400 + Math.random() * 300; // wind fluctuates more
    if (energyType === "coal")
        base = 800 + Math.random() * 400; // coal is high and steady
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
