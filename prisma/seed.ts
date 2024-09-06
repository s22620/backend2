import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const seed = async () => {
	// Najpierw wyczyść istniejące dane
	await prisma.reservation.deleteMany({});
	await prisma.trip.deleteMany({});

	// Następnie seeduj nowe dane
	for (let i = 0; i < 20; i++) {
		const trip = await prisma.trip.create({
			data: {
				title: faker.location.city() + " Adventure",
				description: faker.lorem.sentences(3),
				startDate: faker.date.future(),
				endDate: faker.date.future(),
				price: parseFloat(faker.commerce.price(1000, 5000, 2)),
				imageSrc: faker.image.urlLoremFlickr({ category: "city" }),
			},
		});
	}
};

seed()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
