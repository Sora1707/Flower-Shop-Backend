import express from "express";
import { royaltyController } from "./royalty.controller";

const router = express.Router();

router.get("/:userId/total", royaltyController.getUserTotal);
router.get("/:userId/history", royaltyController.getUserHistory);

export default router;
