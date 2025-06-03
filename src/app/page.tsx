'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to AI Generation Platform</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Kling AI</h2>
            <p className="text-gray-600 mb-4">
              Generate high-quality videos using Kling AI&apos;s advanced video generation capabilities.
            </p>
            <a
              href="/kling-test"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Kling AI
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">MiniMaxi</h2>
            <p className="text-gray-600 mb-4">
              Create stunning images with MiniMaxi&apos;s powerful image generation technology.
            </p>
            <a
              href="/minimaxi"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try MiniMaxi
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Face Swap</h2>
            <p className="text-gray-600 mb-4">
              Swap faces between two images using advanced AI face swap technology.
            </p>
            <a
              href="/faceswap"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Face Swap
            </a>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
