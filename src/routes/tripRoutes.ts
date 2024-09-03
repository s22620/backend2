import express from "express";
import { createTrip, getTrips, getTrip, updateTrip, deleteTrip } from "../records/tripRecords";

const router = express.Router();

router.get("/trips", getTrips);
router.get("/trips/:id", getTrip);
router.post("/trips", createTrip);
router.put("/trips/:id", updateTrip);
router.delete("/trips/:id", deleteTrip);

export default router;
