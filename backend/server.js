import express from "express";
import cors from "cors";
import productRoutes from "./api/productRoutes.js";
import { AppError } from "./service/productService.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/products", productRoutes);

// Єдиний формат помилки (ErrorResponse)
app.use((err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: err.error,
      code: err.code,
      details: err.details
    });
  }
  res.status(500).json({
    error: "InternalServerError",
    code: "UNEXPECTED_ERROR",
    details: []
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущено: http://localhost:${PORT}`);
});