const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001; // استخدام المنفذ الذي توفره Render

app.use(cors());

// إضافة مسار رئيسي لمنع خطأ "Cannot GET /"
app.get("/", (req, res) => {
  res.send("Server is running! 🚀");
});

// التأكد من أن السيرفر لا يعمل بالفعل قبل تشغيله
if (!server.listening) {
  const io = new Server(server, {
    cors: {
      origin: "*", // السماح لجميع النطاقات بالاتصال
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("sendMessage", (message) => {
      io.emit("receiveMessage", message); // إرسال الرسالة إلى جميع المستخدمين
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
