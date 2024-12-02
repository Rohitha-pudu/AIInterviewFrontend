"use client"; // Marking the file as a client component

import { useState, useRef, useEffect } from "react";

const QuestionScreen = () => {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [isAudioCompleted, setIsAudioCompleted] = useState(false); // Track audio completion
  const [isRecording, setIsRecording] = useState(false); // Track if recording is happening
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null); // Store the camera stream
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Cleanup streams when the component unmounts
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  const handleAudioPlay = () => {
    setAudioPlaying(true);
  };

  const handleAudioEnd = () => {
    setAudioPlaying(false);
    setIsAudioCompleted(true); // Mark audio as completed
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setCameraStream(stream); // Save the camera stream

      // Attach the stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Initialize MediaRecorder
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => chunks.push(event.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        // API Call to upload the video
        const formData = new FormData();
        formData.append("file", blob);
        fetch("/api/upload", { method: "POST", body: formData });
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording:", err);
      alert("Could not access camera or microphone. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);

    // Stop the camera stream
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-3xl bg-gray-800 rounded-xl shadow-lg p-8">
        {/* Audio Section */}
        {!isAudioCompleted && (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Listen to the Question</h1>
            <p className="text-gray-400 mb-6">Make sure to pay close attention to the question before proceeding.</p>
            <audio
              controls
              className="w-full"
              onPlay={handleAudioPlay}
              onEnded={handleAudioEnd}
            >
              <source src="/sample-3s.mp3" type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
            {audioPlaying && <p className="mt-4 text-blue-400">Audio is playing...</p>}
          </div>
        )}

        {/* Camera and Recording Section */}
        {isAudioCompleted && (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Record Your Answer</h1>
            <p className="text-gray-400 mb-6">
              Make sure your video and microphone are working correctly before starting the recording.
            </p>
            {/* Video Feed */}
            <div className="bg-black border-2 border-gray-600 rounded-lg p-4">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-auto rounded-lg"
              ></video>
            </div>
            {/* Recording Buttons */}
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="mt-6 bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition"
              >
                Start Recording
              </button>
            ) : (
              <div className="mt-6">
                <p className="text-red-400 text-lg mb-4">Recording in progress...</p>
                <button
                  onClick={stopRecording}
                  className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition"
                >
                  Stop Recording
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionScreen;
