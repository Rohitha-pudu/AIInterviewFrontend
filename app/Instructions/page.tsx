'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
const Instructions = () => {
  const router = useRouter(); // Initialize the router

  const handleStartNowClick = () => {
    router.push('/InterviewStart'); // Navigate to /interviews page
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      {/* Header Section */}
      <div className="w-full m-9 max-w-6xl flex justify-between items-center mb-10 px-4">
        <h1 className="text-2xl font-bold">Trainee Interview</h1>
        <div className="flex items-center space-x-4">
          <span className="text-orange-400 font-semibold">Zeko</span>
          <span className="bg-gray-700 text-sm py-1 px-3 rounded-lg">26 Minutes</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl bg-gray-800 rounded-lg p-8 flex flex-col lg:flex-row gap-8 items-start">
        {/* Video Placeholder */}
        <div className="flex-1 flex items-center justify-center bg-black rounded-lg aspect-video w-full max-h-[50vh]">
          {/* Add the actual video or leave as a placeholder */}
        </div>

        {/* Instructions Section */}
        <div className="flex-1 w-full">
          {/* Instructions */}
          <h2 className="text-lg font-semibold mb-4">Instructions</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>Ensure stable internet and choose a clean, quiet location.</li>
            <li>Grant access to your camera, microphone, and screen sharing.</li>
            <li>Be in professional attire and avoid distractions.</li>
            <li>Provide detailed responses with examples and projects youve worked on.</li>
            <li>Answer questions confidently and clearly.</li>
          </ul>

          {/* Mock Interview Link Box */}
          <div className="mt-6 p-4 border border-gray-700 rounded-lg bg-gray-900 text-sm">
            <a
              href="#"
              className="text-blue-400 underline hover:text-blue-500"
            >
              Click here
            </a>{' '}
            to try a mock interview with Avya, our AI interviewer, and build your confidence!
          </div>

          {/* Start Now Button */}
          <button
           onClick={handleStartNowClick} // Add onClick handler
           className="mt-8 w-full bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white font-medium">
            Start Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
