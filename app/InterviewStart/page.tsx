"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

const InterviewPage = () => {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState(false);
  const [screenPermission, setScreenPermission] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const router = useRouter();

  // Stop streams (wrapped in useCallback for dependency management)
  const stopStreams = useCallback(() => {
    cameraStream?.getTracks().forEach((track) => track.stop());
    audioStream?.getTracks().forEach((track) => track.stop());
    screenStream?.getTracks().forEach((track) => track.stop());
  }, [cameraStream, audioStream, screenStream]);

  // Check permissions for camera and microphone
  const checkPermissions = async () => {
    try {
      const camera = await navigator.mediaDevices.getUserMedia({ video: true });
      const audio = await navigator.mediaDevices.getUserMedia({ audio: true });
      setCameraPermission(true);
      setMicrophonePermission(true);
      setCameraStream(camera);
      setAudioStream(audio);
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === "NotAllowedError") {
        alert("Please allow access to your camera and microphone.");
      }
      setCameraPermission(false);
      setMicrophonePermission(false);
    }
  };

  // Start screen sharing
  const startScreenShare = async () => {
    try {
      const screen = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setScreenPermission(true);
      setScreenStream(screen);
    } catch (err: unknown) {
      const error = err as Error;
      alert(`Screen sharing failed: ${error.message}`);
      setScreenPermission(false);
    }
  };

  useEffect(() => {
    checkPermissions();
    return () => stopStreams();
  }, [stopStreams]);

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(console.error);
    }
  }, [cameraStream]);

  const handleStartNowClick = () => {
    router.push("/Questions");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full h-full max-w-screen-2xl bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Trainee Interview</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 h-full">
          {/* Left Side: Video */}
          <div className="flex-1 bg-black rounded-lg flex justify-center items-center p-4 border-2 border-gray-600">
            {cameraPermission ? (
              <video
                ref={videoRef}
                className="h-full w-full rounded-lg"
                autoPlay
                muted
              />
            ) : (
              <p className="text-gray-400">Camera not available</p>
            )}
          </div>

          {/* Right Side: Checklist */}
          <div className="flex-1 bg-gray-700 rounded-lg p-6 space-y-4 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Ready to join?</h2>
              <p className="text-gray-400 mb-6">Please make sure your device is properly configured.</p>

              {/* Checklist */}
              <div className="space-y-4">
                {/* Camera Check */}
                <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg border border-gray-600">
                  <input
                    type="checkbox"
                    checked={cameraPermission}
                    readOnly
                    className="form-checkbox h-6 w-6 text-blue-500 border-gray-500"
                  />
                  <span className="text-lg">Check Camera</span>
                </div>

                {/* Microphone Check */}
                <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg border border-gray-600">
                  <input
                    type="checkbox"
                    checked={microphonePermission}
                    readOnly
                    className="form-checkbox h-6 w-6 text-blue-500 border-gray-500"
                  />
                  <span className="text-lg">Check Microphone</span>
                </div>

                {/* Screen Share Check */}
                <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg border border-gray-600">
                  <input
                    type="checkbox"
                    checked={screenPermission}
                    readOnly
                    className="form-checkbox h-6 w-6 text-blue-500 border-gray-500"
                  />
                  <span className="text-lg">Enable Screen Share</span>
                </div>
              </div>
            </div>

            {/* Screen Share Button */}
            <button
              onClick={startScreenShare}
              className="w-full bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
              disabled={screenPermission}
            >
              Start Screen Share
            </button>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={handleStartNowClick}
                className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition"
              >
                Start Interview
              </button>
              <button
                onClick={stopStreams}
                className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition"
              >
                Stop Streams
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
