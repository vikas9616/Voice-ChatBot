// frontend/src/components/AudioPlayer.jsx
import React from "react";

import { useRef, useState } from "react";

export default function AudioPlayer({ audioUrl }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // When playback ends, update UI
  const handleEnded = () => setIsPlaying(false);

  return (
    <div>
      <audio ref={audioRef} src={audioUrl} onEnded={handleEnded} hidden />
      <button onClick={isPlaying ? handlePause : handlePlay}>
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
}
