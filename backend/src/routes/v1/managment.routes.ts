import { Router } from "express";
import managementController from "../../controllers/management.controller";
const router = Router();

// /management
router.get("/property/get-staffs/:propertyId", managementController.getPropertyStaffs);
router.delete("/property/remove-staff", managementController.removeStaffFromProperty);
router.post("/add-staff", managementController.addStaffToProperty);

export { router as ManagementRouter };
