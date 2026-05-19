import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import vendorsRouter from "./vendors.js";
import venuesRouter from "./venues.js";
import enquiryRouter from "./enquiry.js";
import chatRouter from "./chat.js";
import gstRouter from "./gst.js";
import paymentsRouter from "./payments.js";
import bookingsRouter from "./bookings.js";
import reviewsRouter from "./reviews.js";
import articlesRouter from "./articles.js";
import searchRouter from "./search.js";
import portfolioRouter from "./portfolio.js";
import availabilityRouter from "./availability.js";
import kycRouter from "./kyc.js";
import {
  authLimiter,
  registerLimiter,
  enquiryLimiter,
  generalLimiter,
} from "../middlewares/rateLimiter.js";

const router: IRouter = Router();

router.use(generalLimiter);

router.use(healthRouter);

router.post("/auth/login", authLimiter);
router.post("/auth/register", registerLimiter);
router.use(authRouter);

router.use(vendorsRouter);
router.use(venuesRouter);

router.post("/enquiry/vendor",  enquiryLimiter);
router.post("/enquiry/venue",   enquiryLimiter);
router.post("/enquiry/contact", enquiryLimiter);
router.post("/enquiry/listing", enquiryLimiter);
router.use(enquiryRouter);

router.use(chatRouter);
router.use(gstRouter);
router.use(paymentsRouter);
router.use(bookingsRouter);
router.use(reviewsRouter);
router.use(articlesRouter);
router.use(searchRouter);
router.use(portfolioRouter);
router.use(availabilityRouter);
router.use(kycRouter);

export default router;
