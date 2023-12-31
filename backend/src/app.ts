import express, { Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { join } from "node:path";
import { Server } from "socket.io";
import { createServer } from "node:http";
import partyRouter from "./routes/party";
import userRouter from "./routes/users";
import { authorize } from "./middleware/authorize";
import { CustomRequest } from "./types";
import authRouter from "./routes/auth";
import cookieParser from "cookie-parser";
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
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://10.222.245.188:5173"],
    methods: ["GET", "POST", "PUT"],
  },

  connectionStateRecovery: {},
});
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

let host: string | null = null;
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("reconnect", () => {
    console.log("reconnecting");
  });
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
    console.log("message: " + msg);
  });

  socket.on("disconnect", (msg) => {
    console.log("disconnected: " + msg);
  });
  socket.on("join", ({ partyID, user }) => {
    socket.join(partyID);
    if (!host) {
      host = user;
    }

    console.log(`${user} joined party ${partyID}`);
  });

  socket.on("leave", ({ partyID, user }) => {
    socket.leave(partyID);
    if (user === host) {
      io.to(partyID).emit("switch_host");
    }
    console.log(`${user} left party ${partyID}`);

  });
  socket.on("play", ({ partyID, user }) => {
    if (user === host) {
      io.to(partyID).emit("play");
    }
  });

  socket.on("pause", ({ partyID, user }) => {
    if (user === host) {
      io.to(partyID).emit("pause");
    }
  });

  socket.on("search", ({ partyID, youtubeID }) => {
    io.to(partyID).emit("search", youtubeID);
  });
  socket.on("duration", ({ partyID, seconds, user }) => {
    if (user === host) {
      io.to(partyID).emit("duration", seconds);
    }
  });
  socket.on("assign_host", (user) => {
    host = user;
  });
});

server.listen(3000, () => {
  console.log("listening on port 3000");
});
