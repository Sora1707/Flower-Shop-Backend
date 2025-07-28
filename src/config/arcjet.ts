/*
PROTECT FROM ATTACKS
    - apply a rate limit
    - prevent bots from accessing your app.
*/

import { ARCJET_KEY } from "./dotenv";

export const REFILL_RATE = 10; // tokens
export const REFILL_INTERVAL = 60; // seconds
export const CAPACITY = 100;

import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";

const aj = arcjet({
    key: ARCJET_KEY as string,
    characteristics: ["ip.src"], // Track requests by IP
    rules: [
        shield({ mode: "LIVE" }),
        detectBot({
            mode: "DRY_RUN",
            allow: ["CATEGORY:SEARCH_ENGINE"],
        }),
        tokenBucket({
            mode: "LIVE",
            refillRate: REFILL_RATE, // Refill 5 tokens per interval
            interval: REFILL_INTERVAL, // Refill every 10 seconds
            capacity: CAPACITY, // Bucket capacity of 10 tokens
        }),
    ],
});

export default aj;
