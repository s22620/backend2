import Stripe from "stripe";
import { Request, Response } from "express";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: "2024-06-20",
});

export const getStripeSession = async (req: Request, res: Response) => {
	const { sessionId } = req.params;

	try {
		const session = await stripe.checkout.sessions.retrieve(sessionId);
		res.json(session);
	} catch (error) {
		res.status(500).json({ error: "Failed to retrieve Stripe session" });
	}
};

export const createStripeSession = async (req: Request, res: Response) => {
	const { tripId, email, numAdults, numChildren, tripPrice } = req.body;

	try {
		// Obliczamy całkowitą cenę
		const totalPrice = (numAdults + numChildren * 0.5) * tripPrice;

		// Tworzymy sesję Stripe
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			mode: "payment",
			customer_email: email,
			metadata: {
				tripId, // Przekazujemy tripId w metadanych
				numAdults: numAdults.toString(), // Stripe wymaga, by wartości były stringami
				numChildren: numChildren.toString(),
			},
			line_items: [
				{
					price_data: {
						currency: "pln",
						product_data: {
							name: `Rezerwacja wycieczki ${tripId}`,
						},
						unit_amount: Math.round(totalPrice * 100), // Stripe wymaga kwoty w groszach
					},
					quantity: 1,
				},
			],
			success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.FRONTEND_URL}/cancel`,
		});

		res.json({ url: session.url });
	} catch (error) {
		console.error("Error creating Stripe session:", error);
		res.status(500).json({ error: "Failed to create Stripe session" });
	}
};
