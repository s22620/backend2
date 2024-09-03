import express from "express";
import {
	createReservation,
	getReservations,
	getReservation,
	updateReservation,
	deleteReservation,
} from "../records/reservationRecords";

const router = express.Router();

router.get("/reservations", getReservations);
router.get("/reservations/:id", getReservation);
router.post("/reservations", createReservation);
router.put("/reservations/:id", updateReservation);
router.delete("/reservations/:id", deleteReservation);

export default router;
