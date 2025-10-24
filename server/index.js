import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from 'cors'
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import uploadRouter from './routes/upload.js'
import listingRouter from './routes/listing.route.js'
import cookieParser from "cookie-parser";
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
//Allowed json as input of the server
app.use(express.json({limit: "10mb"}));
app.use(cookieParser());


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api", uploadRouter);
app.use("/api/listing", listingRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Sever Error";
  res.json({
    success: false,
    statusCode,
    message,
  });
});
