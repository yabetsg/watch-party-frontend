import express from "express";
import { join } from "node:path";
import { Server } from "socket.io";
import { createServer } from "node:http";

const app = express();
app.use(express.static('src'));
const server = createServer(app);
const io = new Server(server,{
  cors:{
    origin:"http://localhost:5173",
    methods:["GET","POST"],
  }
});


app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  console.log("a user connected");
  
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg)
    console.log("message: " + msg);
  });
  socket.on("disconnect", (msg) => {
    console.log("disconnected");
  });
  socket.on("play",(msg)=>{
      io.emit("play",msg);
  })
});

server.listen(3000, () => {
  console.log("listening on port 3000");
});
