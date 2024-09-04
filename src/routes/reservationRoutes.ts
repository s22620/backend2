import express from "express";
import {
	createReservation,
	getReservations,
	getReservation,
	updateReservation,
	deleteReservation,
	getAllUserReservations,
} from "../records/reservationRecords";

const router = express.Router();

router.get("/reservations", getReservations); // Tylko dla admina
router.get("/reservations/user", getAllUserReservations); // Dla użytkownika
router.get("/reservations/:id", getReservation);
router.post("/reservations", createReservation);
router.put("/reservations/:id", updateReservation);
router.delete("/reservations/:id", deleteReservation);

export default router;
