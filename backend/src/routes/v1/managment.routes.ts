import { Router } from "express";
import managementController from "../../controllers/management.controller";
const router = Router();

// /management
router.get("/property/get-staffs", managementController.getGusetHouseStaffs);
router.delete("/property/remove-staff", managementController.removeStaffFromProperty);
router.post("/add-staff", managementController.addStaffToProperty);

export { router as ManagementRouter };
