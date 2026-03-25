import { Router } from "express";
import roomsController from "../../controllers/rooms.controller";
import { authGuard } from "../../middleware/auth-middleware";

const router = Router();

// @/api/v1/rooms/
router.get("/", roomsController.getRooms);

// room services
router.post("/:roomId/add-services", roomsController.addServices);
router.put("/:serviceId/update-service", roomsController.updateService);
router.get("/:roomId/get-services", roomsController.getRoomServices);

// managemnt
router.get(
  "/management",
  authGuard({ accessedBy: ["BROKER", "OWNER", "STAFF", "ADMIN"] }),
  roomsController.getRoomsForManagement
);
router.get(
  "/management/stats",
  authGuard({ accessedBy: ["BROKER", "OWNER", "STAFF", "ADMIN"] }),
  roomsController.getRoomStatsForManagement
);
router.get(
  "/management/for-list/:propertyId",
  roomsController.getRoomsForManagmentList
);
router.get(
  "/management/:roomId",
  authGuard({ accessedBy: ["BROKER", "OWNER", "STAFF", "ADMIN"] }),
  roomsController.getRoomDetailForManagement
);

// user
router.get("/:id", roomsController.getRoomById);

// mutations
router.post("/", roomsController.createRoom);
router.put("/:id", roomsController.updateRoom);
router.delete("/:id", roomsController.deleteRoom);

// room images
router.post("/:id/images", roomsController.addRoomImage);
router.delete("/:id/images/:imageId", roomsController.deleteRoomImage);
// router.post("/dummy", roomsController.createDummyRoom);

export { router as RoomsRouter };
