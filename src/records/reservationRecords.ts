import { Request, Response } from "express";
import { PrismaClient, Reservation } from "@prisma/client";

const prisma = new PrismaClient();

type ReservationRequest = Request<{ id: string }, {}, Partial<Reservation>>;
type CreateReservationRequest = Request<{}, {}, Omit<Reservation, "id" | "trip">>;
type UpdateReservationRequest = ReservationRequest;
type DeleteReservationRequest = Request<{ id: string }, {}, {}>;

export const getReservations = async (req: Request, res: Response): Promise<void> => {
	const userRole = req.headers["user-role"]; // Zakładamy, że rola jest przesyłana w nagłówku (np. z tokena)

	if (userRole !== "admin") {
		res.status(403).json({ error: "Access denied. Admins only." });
		return;
	}

	try {
		const reservations = await prisma.reservation.findMany({
			include: { trip: true },
		});
		res.json(reservations);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch reservations" });
	}
};

export const getAllUserReservations = async (req: Request, res: Response): Promise<void> => {
	const userEmail = req.headers["user-email"]; // Używamy adresu email przesłanego w nagłówku

	if (!userEmail) {
		res.status(400).json({ error: "User email is required" });
		return;
	}

	try {
		const reservations = await prisma.reservation.findMany({
			where: { email: userEmail as string },
			include: { trip: true }, // Pobierz powiązane wycieczki, jeśli potrzebujesz
		});

		res.json(reservations);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch reservations for the user" });
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

export const createReservation = async (req: Request, res: Response): Promise<void> => {
	const { tripId, email, numAdults, numChildren } = req.body;

	try {
		// Tworzenie rezerwacji tylko z tripId i innymi podstawowymi danymi
		const reservation = await prisma.reservation.create({
			data: {
				tripId,
				email,
				numAdults,
				numChildren,
			},
		});
		res.status(201).json(reservation);
	} catch (error) {
		console.error("Błąd tworzenia rezerwacji:", error);
		res.status(500).json({ error: "Nie udało się utworzyć rezerwacji" });
	}
};

export const updateReservation = async (
	req: UpdateReservationRequest,
	res: Response,
): Promise<void> => {
	const { id } = req.params;
	const { tripId, email, numAdults, numChildren } = req.body;

	try {
		const reservation = await prisma.reservation.update({
			where: { id },
			data: {
				...(tripId && { tripId }),
				...(email && { email }),
				...(numAdults !== undefined && { numAdults: parseInt(numAdults.toString(), 10) }),
				...(numChildren !== undefined && { numChildren: parseInt(numChildren.toString(), 10) }),
			},
		});

		res.json(reservation);
	} catch (error) {
		console.error("Error updating reservation:", error);
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
