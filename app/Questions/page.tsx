'use client'; // Marking the file as a client component

import { useState, useRef } from 'react';

const QuestionScreen = () => {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [isAudioCompleted, setIsAudioCompleted] = useState(false); // Track audio completion
  const [isRecording, setIsRecording] = useState(false); // Track if recording is happening
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleAudioPlay = () => {
    setAudioPlaying(true);
  };

  const handleAudioEnd = () => {
    setAudioPlaying(false);
    setIsAudioCompleted(true); // Mark audio as completed
  };

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
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {!isAudioCompleted && (
        <>
          <h1 className="text-xl font-semibold">Listen to the Question</h1>
          <audio
            controls
            className="mt-4"
            onPlay={handleAudioPlay}
            onEnded={handleAudioEnd}
          >
            <source src="/sample-3s.mp3" type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
          {audioPlaying && <p>Audio is playing...</p>}
        </>
      )}

      {isAudioCompleted && !isRecording && (
        <>
          <h1 className="text-xl font-semibold mt-6">Record Your Answer</h1>
          <video ref={videoRef} autoPlay muted className="w-1/2 h-auto mt-4"></video>
          <div className="mt-4">
            <button onClick={startRecording} className="px-4 py-2 text-white bg-green-600 rounded">
              Start Recording
            </button>
          </div>
        </>
      )}

      {isRecording && (
        <div className="mt-4">
          <button onClick={stopRecording} className="px-4 py-2 text-white bg-red-600 rounded">
            Stop Recording
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionScreen;
