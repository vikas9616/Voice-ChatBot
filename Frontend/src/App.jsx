import React, { useState, useRef, useEffect } from "react";
import useVoiceRecorder from "./hooks/useVoiceRecorder";

const WS_URL = "ws://localhost:5000";

export default function App() {
  const ws = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [botResponsePlaying, setBotResponsePlaying] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);

  const { startRec, stopRec } = useVoiceRecorder(handleSendAudio);

  function ensureWs() {
    return new Promise((resolve, reject) => {
      if (ws.current && ws.current.readyState === 1) {
        return resolve();
      }

      ws.current = new WebSocket(WS_URL);
      ws.current.binaryType = "arraybuffer";

      ws.current.onopen = () => {
        console.log("WebSocket connected");
        setWsConnected(true);
        resolve();
      };

      ws.current.onerror = (e) => {
        console.error("WebSocket error", e);
        reject(e);
      };

      ws.current.onclose = () => {
        console.log("WebSocket closed");
        setIsRecording(false);
        setBotResponsePlaying(false);
        setWsConnected(false);
      };

      ws.current.onmessage = handleAudioResponse;
    });
  }

  useEffect(() => {
    ensureWs().catch((e) => {
      console.error("Initial WS connection failed", e);
    });

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  async function handleMicClick() {
    if (isRecording) {
      stopRec();
      setIsRecording(false);
    } else {
      try {
        await ensureWs();
        startRec();
        setIsRecording(true);
      } catch (e) {
        alert("Could not connect. Please try again later.");
      }
    }
  }

  function handleAudioResponse(evt) {
    setBotResponsePlaying(true);
    try {
      const blob = new Blob([evt.data], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audio.onended = () => {
        setBotResponsePlaying(false);
        URL.revokeObjectURL(url);
      };

      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        setBotResponsePlaying(false);
        URL.revokeObjectURL(url);
      };

      audio.play().catch((e) => {
        console.error("Audio play() failed:", e);
        setBotResponsePlaying(false);
      });
    } catch (e) {
      console.error("Error playing audio:", e);
      setBotResponsePlaying(false);
    }
  }

  function handleSendAudio(blob) {
    if (ws.current && ws.current.readyState === 1) {
      ws.current.send(blob);
    } else {
      console.warn("WebSocket not connected. Unable to send audio.");
    }
  }

  return (
    <div style={{
      background: "#181818",
      color: "#fff",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <h2 style={{ fontWeight: 700, marginBottom: 30, marginTop: 0 }}>Talk to Rev</h2>
      <button
        onClick={handleMicClick}
        disabled={!wsConnected}
        style={{
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: isRecording ? "#d7263d" : "#268af5",
          border: "none",
          boxShadow: isRecording ? "0 0 0 5px #d7263d44" : "0 2px 6px #268af544",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: wsConnected ? "pointer" : "not-allowed",
          opacity: wsConnected ? 1 : 0.5,
          transition: "background 0.2s, box-shadow 0.2s",
          outline: "none",
        }}
        aria-label={isRecording ? "Stop listening" : "Start listening"}
      >
        {/* Mic SVG */}
        <svg width="42" height="42" fill="white" stroke="white" viewBox="0 0 24 24">
          <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3zm5-3a1 1 0 1 1 2 0c0 3.53-2.61 6.43-6 6.92V21h3a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h3v-2.08c-3.39-.49-6-3.39-6-6.92a1 1 0 1 1 2 0c0 2.7 2.09 4.92 5 4.92s5-2.22 5-4.92z"/>
        </svg>
      </button>
      <div style={{ marginTop: 30, minHeight: 32, fontSize: 18 }}>
        {isRecording
          ? "Listening... Click to stop & send"
          : botResponsePlaying
            ? "Bot is replying..."
            : wsConnected
              ? "Click mic to talk about Revolt Motors"
              : "Connecting..."}
      </div>
    </div>
  );
}
