const express = require("express");
const app = express();
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const PORT = 3030;

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:roomId", (req, res) => {
  res.render("room", { roomId: req.params.roomId });
});

app.listen(PORT, () => {
  console.log("App is running on " + PORT);
});
