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
app.use(express.static(path.join(__dirname, "dist")));

// إعادة توجيه أي طلب غير معروف إلى index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const io = new Server(server, {
  cors: {
    origin
