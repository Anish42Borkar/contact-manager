import express from "express";

import contactRoute from "./routes/contactRoutes.js";
import userRoute from "./routes/userRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import connect from "./config/dbConnection.js";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 5000;
connect();
const app = express();
app.use(express.json());
app.use("/api/contacts", contactRoute);
app.use("/api/user", userRoute);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
