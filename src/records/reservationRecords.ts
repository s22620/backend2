import { Request, Response } from "express";
import { PrismaClient, Reservation } from "@prisma/client";

const prisma = new PrismaClient();

type ReservationRequest = Request<{ id: string }, {}, Partial<Reservation>>;
type CreateReservationRequest = Request<{}, {}, Omit<Reservation, "id" | "trip">>;
type UpdateReservationRequest = ReservationRequest;
type DeleteReservationRequest = Request<{ id: string }, {}, {}>;

export const getReservations = async (req: Request, res: Response): Promise<void> => {
	try {
		const reservations = await prisma.reservation.findMany();
		res.json(reservations);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch reservations" });
	}
};

export const getReservation = async (req: ReservationRequest, res: Response): Promise<void> => {
	const { id } = req.params;
	try {
		const reservation = await prisma.reservation.findUnique({
			where: { id },
		});
		if (reservation) {
			res.json(reservation);
		} else {
			res.status(404).json({ error: "Reservation not found" });
		}
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch reservation" });
	}
};

export const createReservation = async (
	req: CreateReservationRequest,
	res: Response,
): Promise<void> => {
	const { tripId, name, email, date, numAdults, numChildren } = req.body;
	try {
		const reservation = await prisma.reservation.create({
			data: {
				tripId,
				name,
				email,
				date: new Date(date),
				numAdults: parseInt(numAdults.toString(), 10),
				numChildren: parseInt(numChildren.toString(), 10),
			},
		});
		res.status(201).json(reservation);
	} catch (error) {
		res.status(500).json({ error: "Failed to create reservation" });
	}
};

export const updateReservation = async (
	req: UpdateReservationRequest,
	res: Response,
): Promise<void> => {
	const { id } = req.params;
	const { tripId, name, email, date, numAdults, numChildren } = req.body;
	try {
		const reservation = await prisma.reservation.update({
			where: { id },
			data: {
				tripId,
				name,
				email,
				date: date ? new Date(date) : undefined,
				numAdults: numAdults ? parseInt(numAdults.toString(), 10) : undefined,
				numChildren: numChildren ? parseInt(numChildren.toString(), 10) : undefined,
			},
		});
		res.json(reservation);
	} catch (error) {
		res.status(500).json({ error: "Failed to update reservation" });
	}
};

export const deleteReservation = async (
	req: DeleteReservationRequest,
	res: Response,
): Promise<void> => {
	const { id } = req.params;
	try {
		await prisma.reservation.delete({
			where: { id },
		});
		res.json({ message: "Reservation deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: "Failed to delete reservation" });
	}
};
