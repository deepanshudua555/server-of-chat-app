import express from "express";
import { chats } from "./data/data.js";
import { config } from "dotenv";
import { connectDatabse } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
config({
  path: "./config/config.env",
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
connectDatabse();
app.use(cors());
app.get("/", (req, res) => {
  res.send("Api is running ");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`Server Started on Port ${PORT}`));
