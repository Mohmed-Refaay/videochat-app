const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const { ExpressPeerServer } = require("peer");
const PORT = process.env.PORT || 3030;

const server = app.listen(PORT, () => {
  console.log("App is running on " + PORT);
});

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.set("view engine", "ejs");

app.use(express.static("public"));


app.use("/peerjs", peerServer)
app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:roomId", (req, res) => {
  res.render("room", { roomId: req.params.roomId });
});

const io = require("socket.io")(server);



io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-joined", userId);
  });
});
