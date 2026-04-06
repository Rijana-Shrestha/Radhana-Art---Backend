import dotenv from "dotenv";

dotenv.config();

const config = {
  appUrl: process.env.APP_URL || "http://localhost:5000",
  frontendUrl: process.env.FRONTEND_URL || "http://127.0.0.1:5500",
  PORT: process.env.PORT || 5000,
  MONGODB_URL: process.env.MONGODB_URL || "",
  jwtSecret: process.env.JWT_SECRET || "radhana_secret_key",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },

  khalti: {
    apiKey: process.env.KHALTI_API_KEY || "",
    apiUrl: process.env.KHALTI_API_URL || "https://dev.khalti.com/api/v2",
    returnUrl:
      process.env.KHALTI_RETURN_URL ||
      "http://localhost:5000/api/orders/confirm-payment",
  },
  emailApiKey: process.env.EMAIL_API_KEY || "",
};

export default config;
