const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001; // استخدام المنفذ الذي توفره Render

app.use(cors());

// تقديم الملفات الثابتة من مجلد dist
const clientPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientPath));

// إعادة توجيه أي طلب غير معروف إلى index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
});

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
    console.log(`✅ Server running on http://localhost:${PORT} 🚀`);
});
