import React from "react";

export default function MicButton({
  isRecording,
  startRec,
  stopRec,
  interrupt,
}) {
  return (
    <div style={{ margin: "20px 0" }}>
      <button onClick={isRecording ? stopRec : startRec} className="mic-btn">
        {isRecording ? "Stop Recording" : "Start Voice Chat"}
      </button>
      {isRecording && (
        <button
          onClick={interrupt}
          className="interrupt-btn"
          style={{ marginLeft: 16 }}
        >
          Interrupt
        </button>
      )}
    </div>
  );
}
