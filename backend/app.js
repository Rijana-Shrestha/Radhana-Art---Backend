import express from "express";
import multer from "multer";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import authRoutes from "./routes/authRoute.js";
import productsRoutes from "./routes/productsRoute.js";
import orderRoutes from "./routes/orderRoute.js";
import userRoutes from "./routes/userRoute.js";
import contactRoutes from "./routes/contactRoute.js";
import galleryRoutes from "./routes/galleryRoute.js";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import logger from "./middlewares/logger.js";
import auth from "./middlewares/auth.js";

const app = express();

const upload = multer({ storage: multer.memoryStorage() });

connectDB();

// ── CORS ── allow your frontend origin (update in production)
app.use(
  cors({
    origin: config.frontendUrl || "http://localhost:5173", // Live Server default
    credentials: true, // allow cookies
  }),
);

app.use(cookieParser()); // parse cookies properly
app.use(bodyParser.json());
app.use(logger);

// ── Routes ──
app.use("/api/auth", authRoutes);
app.use("/api/products", upload.array("images", 5), productsRoutes);
app.use("/api/orders", auth, upload.single("designFile"), orderRoutes);
app.use("/api/users", auth, upload.single("image"), userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/gallery", upload.array("images", 10), galleryRoutes);

app.listen(config.PORT, () => {
  console.log(`Server running at port ${config.PORT}...`);
});
