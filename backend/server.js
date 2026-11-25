import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import productRoutes from "./api/productRoutes.js";
import { AppError } from "./service/productService.js";

const app = express();
const PORT = 3000;

// exposedHeaders потрібен, щоб браузер бачив X-Request-Id і Retry-After
app.use(cors({ exposedHeaders: ["X-Request-Id", "Retry-After"] }));
app.use(express.json());

const idemStore = new Map(); // Idempotency-Key -> order
const rate = new Map(); // ip -> { count, ts }
const WINDOW_MS = 10_000;
const MAX_REQ = 8;

// 1. Кореляція: X-Request-Id у кожній відповіді
app.use((req, res, next) => {
  const rid = req.get("X-Request-Id") || randomUUID();
  req.rid = rid;
  res.setHeader("X-Request-Id", rid);
  next();
});

// 2. Простий rate-limit із 429 та Retry-After
app.use((req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "local";
  const now = Date.now();
  const b = rate.get(ip) ?? { count: 0, ts: now };
  const within = now - b.ts < WINDOW_MS;
  const state = within ? { count: b.count + 1, ts: b.ts } : { count: 1, ts: now };
  rate.set(ip, state);

  if (state.count > MAX_REQ) {
    res.setHeader("Retry-After", "2");
    return res.status(429).json({
      error: "too_many_requests",
      code: "RATE_LIMIT_EXCEEDED",
      details: [],
      requestId: req.rid
    });
  }
  next();
});

// 3. Імітація затримок (>1с) та випадкових збоїв (500 / 503)
app.use(async (req, res, next) => {
  const r = Math.random();
  if (r < 0.15) {
    await new Promise((resolve) => setTimeout(resolve, 1200 + Math.random() * 800));
  }
  if (r > 0.80) {
    const isUnavailable = Math.random() < 0.5;
    return res.status(isUnavailable ? 503 : 500).json({
      error: isUnavailable ? "unavailable" : "unexpected",
      code: isUnavailable ? "SERVICE_UNAVAILABLE" : "INTERNAL_ERROR",
      details: [],
      requestId: req.rid
    });
  }
  next();
});

// 4. Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// 5. Ідемпотентний POST /orders
app.post("/orders", (req, res) => {
  const key = req.get("Idempotency-Key");
  if (!key) {
    return res.status(400).json({
      error: "idempotency_key_required",
      code: "IDEMPOTENCY_KEY_REQUIRED",
      details: [{ field: "Idempotency-Key", message: "Header is required" }],
      requestId: req.rid
    });
  }

  if (idemStore.has(key)) {
    return res.status(201).json({ ...idemStore.get(key), requestId: req.rid });
  }

  const order = {
    id: "ord_" + randomUUID().slice(0, 8),
    title: req.body?.title ?? "Untitled Instrument"
  };
  idemStore.set(key, order);
  return res.status(201).json({ ...order, requestId: req.rid });
});

app.use("/products", productRoutes);

// Єдиний формат помилки (ErrorResponse + requestId)
app.use((err, req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: err.error,
      code: err.code,
      details: err.details,
      requestId: req.rid
    });
  }
  res.status(500).json({
    error: "InternalServerError",
    code: "UNEXPECTED_ERROR",
    details: [],
    requestId: req.rid
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущено: http://localhost:${PORT}`);
});