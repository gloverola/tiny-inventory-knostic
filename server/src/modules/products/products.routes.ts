import { Router } from "express";
import * as controller from "./products.controller.js";

const router = Router();

router.get("/", controller.listProducts);

router.get("/:id", controller.getProduct);

router.post("/", controller.createProduct);

router.patch("/:id", controller.updateProduct);

router.delete("/:id", controller.deleteProduct);

export default router;
