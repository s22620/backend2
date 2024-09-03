import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
	// Najpierw wyczyść istniejące dane
	await prisma.reservation.deleteMany({});
	await prisma.trip.deleteMany({});

	// Następnie seeduj nowe dane
	for (let i = 0; i < 5; i++) {
		const trip = await prisma.trip.create({
			data: {
				title: faker.location.city() + " Adventure",
				description: faker.lorem.sentences(3),
				startDate: faker.date.future(),
				endDate: faker.date.future(),
				price: parseFloat(faker.commerce.price(1000, 5000, 2)),
				imageSrc: faker.image.urlLoremFlickr({ category: "city" }), // Użycie kategorii 'city' dla obrazów
			},
		});

		for (let j = 0; j < 3; j++) {
			await prisma.reservation.create({
				data: {
					tripId: trip.id,
					name: faker.person.fullName(),
					email: faker.internet.email(),
					date: faker.date.future(),
					numAdults: faker.number.int({ min: 1, max: 5 }),
					numChildren: faker.number.int({ min: 0, max: 3 }),
				},
			});
		}
	}
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
