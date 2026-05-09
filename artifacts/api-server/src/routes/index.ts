import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import vendorsRouter from "./vendors.js";
import venuesRouter from "./venues.js";
import enquiryRouter from "./enquiry.js";
import chatRouter from "./chat.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(vendorsRouter);
router.use(venuesRouter);
router.use(enquiryRouter);
router.use(chatRouter);

export default router;
