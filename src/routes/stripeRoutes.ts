import express from "express";
import { createStripeSession, getStripeSession } from "../records/stripeRecords";

const router = express.Router();

router.post("/create-stripe-session", createStripeSession);
router.get("/session/:sessionId", getStripeSession);

export default router;
