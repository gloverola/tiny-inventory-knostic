import { Router } from "express";
import * as controller from "./stores.controller.js";

const router = Router();

router.get("/", controller.listStores);

router.get("/:id", controller.getStore);

router.post("/", controller.createStore);

router.get("/:id/products", controller.getStoreProducts);

export default router;
