const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");
require("dotenv").config();

const { startGeminiSession } = require("./gemini/geminiLiveSession");

const app = express();
app.use(cors());
app.use(express.json());

const server = app.listen(process.env.PORT, () => {
  console.log(`Backend API listening: http://localhost:${process.env.PORT}`);
});

// WebSocket Server for voice streaming
const wss = new WebSocket.Server({ server });

// Each frontend client gets a Gemini session bridged by Node.js
wss.on("connection", (ws) => {
  console.log("Frontend connected (WS)");
  startGeminiSession(ws);
});

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Revolt Voicebot backend running");
});
