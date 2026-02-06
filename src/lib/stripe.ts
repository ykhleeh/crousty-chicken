import Stripe from "stripe";

const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || "").trim().replace(/[^\x20-\x7E]/g, "");

export const stripe = new Stripe(stripeSecretKey);
