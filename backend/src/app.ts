import express, { Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { join } from "node:path";
import { createServer } from "node:http";
import partyRouter from "./routes/party";
import userRouter from "./routes/users";

import { Server, Socket } from "socket.io";

import authRouter from "./routes/auth";
import cookieParser from "cookie-parser";
import { initSocket } from "./socket";
import { Message } from "./types";

dotenv.config();
const app = express();
app.use(express.static("src"));
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
const server = createServer(app);
const MONGODB_URL = String(process.env.MONGO_URL);

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(MONGODB_URL);
}

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});
app.use("/users", userRouter);
app.use("/party", partyRouter);
app.use("/auth", authRouter);


initSocket(server);


server.listen(3000, () => {
  console.log("listening on port 3000");
});


