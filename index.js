const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const cors = require("cors");
const io = require("socket.io")(server);

const db = require("./models/index");

require("dotenv").config();

//connect to database
(async () => {
  await db.sequelize
    .sync
    // { alter: true }
    ();
  console.log("Connected to MySQL");
})();

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

//setting up routes
app.use("/api/user", require("./routes/users"));
app.use("/api/room", require("./routes/rooms"));
app.use("/api/message", require("./routes/messages"));

const Port = process.env.PORT || 8000;
app.listen(Port, () => console.log(`server running on port ${Port}`));
