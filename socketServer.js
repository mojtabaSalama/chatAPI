const WebSocket = require("ws");

const UserController = require("./controllers/users/userController");
const { verifyToken } = require("./middlewares/auth/userAuth");
const db = require("./models/index");
const user = require("./controllers/users/userController");
const User = db.models.user;
const Message = db.models.message;
function initWebSocket() {
  const wss = new WebSocket.Server({ port: 8080 });
  wss.on("connection", async (ws, request) => {
    console.log("A user connected  to ws");
    ws.on("message", async (message) => {
      console.log("Received:", message);

      // Parse the JSON message received from the client
      const data = JSON.parse(message);

      const reciever = data.reciever;

      const messageContent = data.message;
      const token = data.token;
      let decoded = verifyToken(token);
      let user = decoded;
      let newMessage = await Message.create({
        text: messageContent,

        sender: user.id,
        reciever,
      });
      const response = {
        status: "success",
        message: newMessage,
      };
      ws.send(JSON.parse(response));
    });
  });
}

module.exports = { initWebSocket };
