import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import tripRoutes from "./src/routes/tripRoutes";
import reservationRoutes from "./src/routes/reservationRoutes";

const app = express();

app.use(
	cors({
		origin: "*",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true,
		optionsSuccessStatus: 204,
	}),
);

app.use(express.json());
app.use("/", tripRoutes);
app.use("/", reservationRoutes);

app.options("*", cors());

app.use(bodyParser.json());

app.listen(process.env.PORT || 8000);

module.exports = app;
