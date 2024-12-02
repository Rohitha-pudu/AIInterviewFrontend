'use client'
import { useState, useRef } from 'react';

const RecordAnswer = () => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (videoRef.current) videoRef.current.srcObject = stream;

    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    recorder.ondataavailable = (event) => chunks.push(event.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      // API Call
      const formData = new FormData();
      formData.append('file', blob);
      fetch('/api/upload', { method: 'POST', body: formData });
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <video ref={videoRef} autoPlay muted className="w-1/2 h-auto"></video>
      <div className="mt-4">
        {!recording ? (
          <button onClick={startRecording} className="px-4 py-2 text-white bg-green-600 rounded">
            Start Recording
          </button>
        ) : (
          <button onClick={stopRecording} className="px-4 py-2 text-white bg-red-600 rounded">
            Stop Recording
          </button>
        )}
      </div>
    </div>
  );
};

export default RecordAnswer;
