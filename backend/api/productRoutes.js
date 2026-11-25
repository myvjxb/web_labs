import { Router } from "express";
import { ProductService } from "../service/productService.js";

const router = Router();
const productService = new ProductService();

router.get("/", (_req, res) => {
  res.status(200).json(productService.getAll());
});

router.get("/:id", (req, res, next) => {
  try {
    res.status(200).json(productService.getById(req.params.id));
  } catch (err) {
    next(err);
  }
});

router.post("/", (req, res, next) => {
  try {
    const created = productService.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", (req, res, next) => {
  try {
    const updated = productService.update(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    productService.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;