// frontend/src/hooks/useVoiceRecorder.js
import { useState, useRef } from "react";
import RecordRTC from "recordrtc";

export default function useVoiceRecorder(onData) {
  const [isRecording, setIsRecording] = useState(false);
  const recorder = useRef(null);

  const startRec = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder.current = RecordRTC(stream, {
      type: 'audio',
      recorderType: RecordRTC.StereoAudioRecorder,  // <-- This ensures PCM/WAV!
      mimeType: 'audio/wav',
      numberOfAudioChannels: 1,
      desiredSampRate: 16000,
      timeSlice: 200,
      ondataavailable(blob) {
        onData(blob);
      }
    });
    recorder.current.startRecording();
    setIsRecording(true);
  };

  const stopRec = () => {
    if (recorder.current) recorder.current.stopRecording();
    setIsRecording(false);
  };

  return { startRec, stopRec, isRecording };
}
