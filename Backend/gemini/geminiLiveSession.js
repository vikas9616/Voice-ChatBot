// backend/gemini/geminiLiveSession.js
const { GoogleGenAI, Modality } = require("@google/genai");
const { WaveFile } = require("wavefile");

exports.startGeminiSession = function (clientWs) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-preview-native-audio-dialog";

  const config = {
    responseModalities: [Modality.AUDIO],
    systemInstruction: "You are a helpful assistant for Revolt Motors. Only answer questions about Revolt Motors and electric vehicles."
  };

  let session;
  let geminiClosed = false;

  // Connection to Gemini
  ai.live.connect({
    model,
    config,
    callbacks: {
      onopen: () => {
        console.log("Gemini session started");
        clientWs.send(JSON.stringify({ type: "ready" }));
      },
      onmessage: msg => {
        // Stream AI's base64 PCM audio chunk-to-chunk to browser, convert to WAV on-the-fly
        if (msg.data) {
          const buffer = Buffer.from(msg.data, "base64");
          const wav = new WaveFile();
          // Gemini outputs 24kHz, mono, 16bit PCM
          wav.fromScratch(1, 24000, "16", new Int16Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 2));
          if (clientWs.readyState === 1) clientWs.send(wav.toBuffer());
        }
      },
      onclose: () => { geminiClosed = true; },
      onerror: e => {
        geminiClosed = true;
        console.error("Gemini error:", e);
        if (clientWs.readyState === 1) clientWs.send(JSON.stringify({ type: "error", error: String(e && e.message || e) }));
      }
    }
  }).then(gSession => {
    session = gSession;
    // Incoming from frontend (audio or command)
    clientWs.on("message", raw => {
      let parsed;
      try { parsed = JSON.parse(raw); } catch{}
      // Handle ai interruption
      if (parsed && parsed.type === "interrupt" && session) {
        session.interrupt();
        return;
      }
      if (parsed && parsed.type === "end" && session) {
        session.close();
        return;
      }
      // Audio chunk in correct format? Needs to be PCM 16bit mono 16kHz. Adapt if needed.
      if (session && !geminiClosed) {
        // If frontend uses WAV, decode then send raw PCM:
        let pcmBuffer;
        try {
          // Try decode as WAV
          const wav = new WaveFile();
          wav.fromBuffer(Buffer.from(raw));
          wav.toSampleRate(16000);
          wav.toBitDepth("16");
          pcmBuffer = Buffer.from(wav.data.samples);
        } catch (e) {
          // If not WAV, treat as already PCM 16k mono
          pcmBuffer = Buffer.from(raw);
        }
        session.sendRealtimeInput({
          audio: {
            data: pcmBuffer.toString("base64"),
            mimeType: "audio/pcm;rate=16000"
          }
        });
      }
    });

    clientWs.on("close", () => {
      if (session && !geminiClosed) session.close();
    });
  }).catch(e => {
    geminiClosed = true;
    console.error("Failed to open Gemini session:", e);
    if (clientWs.readyState === 1) clientWs.send(JSON.stringify({ type: "error", error: "Gemini connection failed" }));
  });
};
