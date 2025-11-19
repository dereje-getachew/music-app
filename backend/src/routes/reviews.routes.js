import { Router } from "express";
import { 
  getHostawayReviews, 
  getDashboardStats, 
  updateReviewStatus, 
  getGoogleResearch 
} from "../controller/reviews.controller.js";

const router = Router();

// Public routes (no auth required for demo)
router.get("/reviews/hostaway", getHostawayReviews);
router.get("/dashboard/stats", getDashboardStats);
router.get("/google/research", getGoogleResearch);
router.patch("/reviews/:reviewId/status", updateReviewStatus);

export default router;