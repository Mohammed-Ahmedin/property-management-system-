import { Router } from "express";
import propertiesController from "../../controllers/properties.controller";
import staffController from "../../controllers/management.controller";
import { authGuard } from "../../middleware/auth-middleware";
import reviewsController from "../../controllers/reviews.controller";

const router = Router();

// @/api/v1/properties/
// client
router.get("/", propertiesController.getProperties);
router.get("/trendings", propertiesController.getTrendingProperties);
router.get("/nearby", propertiesController.getNearbyProperties);

router.post("/reviews", authGuard(), reviewsController.createReview);
router.get("/reviews/:propertyId", reviewsController.getReviews);

router.get(
  "/management",
  authGuard({ cantAccessBy: ["GUEST"] }),
  propertiesController.getPropertiesForManagement
);
router.get(
  "/management/stats",
  authGuard({ cantAccessBy: ["GUEST"] }),
  propertiesController.getPropertiesStatsForManagement
);
router.get(
  "/management/for-list",
  authGuard({ cantAccessBy: ["GUEST"] }),
  propertiesController.getPropertiesForList
);
router.get(
  "/management/:id",
  authGuard({ cantAccessBy: ["GUEST"] }),
  propertiesController.getPropertyByIdForManagement
);

// staffs management
router.get(
  "/staff/for-list",
  authGuard({ cantAccessBy: ["GUEST"] }),
  staffController.getStaffsForList
);
router.post(
  "/staff/add-staff",
  authGuard({ cantAccessBy: ["GUEST"] }),
  staffController.addStaffToProperty
);
router.post(
  "/staff/add-broker",
  authGuard({ cantAccessBy: ["GUEST"] }),
  staffController.addBrokerToProperty
);
router.post(
  "/staff/remove-staff",
  authGuard({ cantAccessBy: ["GUEST"] }),
  staffController.removeStaffFromProperty
);
router.get(
  "/staff/get-staffs/:propertyId",
  authGuard({ cantAccessBy: ["GUEST"] }),
  staffController.getPropertyStaffs
);

router.get("/:id", propertiesController.getPropertyById);
router.put("/:id", authGuard({ cantAccessBy: ["GUEST"] }), propertiesController.updateProperty);
router.post("/:id/status", authGuard({ cantAccessBy: ["GUEST"] }), propertiesController.changePropertyStatus);
router.post("/:id/void", authGuard({ cantAccessBy: ["GUEST"] }), propertiesController.voidProperty);
router.post("/:id/images", authGuard({ cantAccessBy: ["GUEST"] }), propertiesController.addPropertyImage);
router.delete("/:id/images", propertiesController.deletePropertyImage);
router.delete(
  "/:id",
  authGuard({ cantAccessBy: ["GUEST"] }),
  propertiesController.deleteProperty
);
router.post(
  "/",
  authGuard({ cantAccessBy: ["GUEST"] }),
  propertiesController.createProperty
);
router.post("/dummy", propertiesController.createDummyProperty);

export { router as PropertyRouter };
