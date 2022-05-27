const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
  },
});

app.get("/", (req, res) => {
  // res.send("<h1>Hello world</h1>");
  res.sendFile(__dirname + "/index.html");
});

let users = [];

for (let index = 0; index < 10; index++) {
  users.push({
    username: 1,
    socket_id: 1,
    name: 1,
  });
}

// connecting
io.on("connection", (socket) => {
  // connected
  socket.emit("connected", `You are connected with ID: ${socket.id}`);
  socket.broadcast.emit("connected", `Some user join with ID: ${socket.id}`);
  socket.on("connected", (data) => {
    users.push({
      username: data.username,
      socket_id: socket.id,
      name: data.username,
    });
    io.emit("users", users);
  });

  // message
  socket.on("message", (msg, to) => {
    // users.forEach((user) => {
    //   console.log("looking for selected user");
    //   if (user.username == to) {
    //     io.to([user.socket_id, socket.id]).emit("message", msg);
    //     console.log("found");
    //   }
    // });
    let i = 0;
    let found = false;
    do {
      console.log("looking for user");
      if (users[i].username == to) {
        io.to([users[i].socket_id, socket.id]).emit("message", msg);
        console.log("found");
        found = true;
      }
      i = i + 1;
    } while (i < users.length && found == false);
  });

  // disconnect
  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);

    let arr = [];
    users.forEach((user) => {
      if (user.socket_id != socket.id) {
        arr.push(user);
      }
    });
    users = arr;

    // console.log(users);
    io.emit("users", users);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
