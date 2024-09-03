import { Request, Response } from "express";
import { PrismaClient, Trip } from "@prisma/client";

const prisma = new PrismaClient();

type TripRequest = Request<{ id: string }, {}, Partial<Trip>>;
type CreateTripRequest = Request<{}, {}, Omit<Trip, "id" | "reservations">>;
type UpdateTripRequest = TripRequest;
type DeleteTripRequest = Request<{ id: string }, {}, {}>;

export const getTrips = async (req: Request, res: Response): Promise<void> => {
	try {
		const trips = await prisma.trip.findMany();
		res.json(trips);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch trips" });
	}
};

export const getTrip = async (req: TripRequest, res: Response): Promise<void> => {
	const { id } = req.params;
	try {
		const trip = await prisma.trip.findUnique({
			where: { id },
		});
		if (trip) {
			res.json(trip);
		} else {
			res.status(404).json({ error: "Trip not found" });
		}
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch trip" });
	}
};

export const createTrip = async (req: CreateTripRequest, res: Response): Promise<void> => {
	const { title, description, startDate, endDate, price, imageSrc } = req.body;
	try {
		const trip = await prisma.trip.create({
			data: {
				title,
				description,
				startDate: new Date(startDate),
				endDate: new Date(endDate),
				price,
				imageSrc,
			},
		});
		res.status(201).json(trip);
	} catch (error) {
		res.status(500).json({ error: "Failed to create trip" });
	}
};

export const updateTrip = async (req: UpdateTripRequest, res: Response): Promise<void> => {
	const { id } = req.params;
	const { title, description, startDate, endDate, price } = req.body;
	try {
		const trip = await prisma.trip.update({
			where: { id },
			data: {
				title,
				description,
				startDate: startDate ? new Date(startDate) : undefined,
				endDate: endDate ? new Date(endDate) : undefined,
				price,
			},
		});
		res.json(trip);
	} catch (error) {
		res.status(500).json({ error: "Failed to update trip" });
	}
};

export const deleteTrip = async (req: DeleteTripRequest, res: Response): Promise<void> => {
	const { id } = req.params;
	try {
		await prisma.trip.delete({
			where: { id },
		});
		res.json({ message: "Trip deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: "Failed to delete trip" });
	}
};
