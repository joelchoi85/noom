import http from "http";
import express from "express";
import { Server } from "socket.io";
// import { WebSocketServer } from "ws";
import path from "path";
const __dirname = path.resolve();

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "src/views"));
app.use("/public", express.static(path.join(__dirname, "src", "public")));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/")); // 다른 페이지 위치는 쓰지 않을 거임
const handleListen = () => console.log(`Listening on http://localhost:${port}`);

const httpServer = http.createServer(app);

// const wsServer = new WebSocketServer({ server });
const wsServer = new Server(httpServer);

wsServer.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome");
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye"));
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", msg);
    done();
  });
});
// const sockets = [];

// wsServer.on("connection", (socket) => {
//   socket["nickname"] = "Anon";
//   sockets.push(socket);
//   socket.on("close", (socket) => {
//     // console.log(socket);
//   });
//   // socket.send("hurra! Ich bin Text aus Server");
//   socket.on("new_message", (message, isBinary) => {
//     const newMessage = JSON.parse(isBinary ? message : message.toString());
//     console.log(newMessage);
//     switch (newMessage.type) {
//       case "nickname":
//         socket["nickname"] = newMessage.payload;
//         // console.log(newMessage.payload);
//         break;
//       case "new_message":
//         // console.log(newMessage.type, newMessage.payload);
//         sockets.forEach((aSocket) => {
//           aSocket.send(`${socket.nickname}:${newMessage.payload}`);
//         });
//         break;
//     }
//   });
// });

httpServer.listen(3000, handleListen);
// app.listen(port, handleListen);
