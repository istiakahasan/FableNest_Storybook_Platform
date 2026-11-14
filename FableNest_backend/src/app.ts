import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import httpStatus from "http-status";
import path from "path";
import { PrismaClient } from "@prisma/client";

import router from "./app/routes";
import GlobalErrorHandler from "./app/errors/globalErrorHandler";
import { startPromoExpiryCron } from "./app/cron/promoExpiry.cron";
import { startAutoGenerateBookCron } from "./app/cron/autoBookGenerate.cron";

const app: Application = express();
const prisma = new PrismaClient();

/* ─────────────────────────────
   Database Connection
───────────────────────────── */
prisma
  .$connect()
  .then(() => console.log("✅ Database connected successfully!"))
  .catch((error) => {
    console.error("❌ Failed to connect to the database:", error);
  });

/* ─────────────────────────────
   Middleware
───────────────────────────── */
app.use(morgan("dev"));

app.use(
  cors({
    origin: [
      "http://localhost:3330",
      "http://localhost:3000",
      "http://localhost:3010",
      "http://77.37.125.90:5058",
      "http://77.37.125.90:3010",
      "https://heyzine.com/api/rest",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "3000mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "3000mb",
    parameterLimit: 100000,
  }),
);

/* ─────────────────────────────
   Static & Views
───────────────────────────── */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "public", "uploads")),
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../src/views"));

/* ─────────────────────────────
   Routes
───────────────────────────── */
app.get("/", (req: Request, res: Response) => {
  res.send({ message: "FableNest Server Is Running!" });
});

app.get("/payment", (req: Request, res: Response) => {
  res.render("stripe");
});

app.use("/api/v1", router);

/* ─────────────────────────────
   Global Error Handling
───────────────────────────── */
app.use(GlobalErrorHandler);

/* ─────────────────────────────
   Not Found Handler
───────────────────────────── */
app.use((req: Request, res: Response, _next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

/* ─────────────────────────────
   Start Cron Jobs
───────────────────────────── */
startPromoExpiryCron();
startAutoGenerateBookCron();

export default app;
