import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getHotels, getHotelsWithRooms, getHotelsRoomsBookings } from "@/controllers";

const hotelsRouter = Router();

hotelsRouter
    .all("/*", authenticateToken)
    .get("/", getHotels)
    .get("/superGet", getHotelsRoomsBookings)
    .get("/:hotelId", getHotelsWithRooms);

export { hotelsRouter };
