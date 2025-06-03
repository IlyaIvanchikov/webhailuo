'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaceSwapRequest } from '@/types/faceswap';
import { FaceSwapApiService } from '@/services/faceswapApi';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function FaceSwapPage() {
  const [sourceImagePreview, setSourceImagePreview] = useState<string | null>(null);
  const [targetImagePreview, setTargetImagePreview] = useState<string | null>(null);
  const [sourceImageBase64, setSourceImageBase64] = useState<string | null>(null);
  const [targetImageBase64, setTargetImageBase64] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const faceSwapApi = new FaceSwapApiService(
    process.env.NEXT_PUBLIC_RAPIDAPI_KEY || ''
  );

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (url: string | null) => void,
    setBase64: (b64: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        const base64 = result.split(',')[1];
        setBase64(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceImageBase64 || !targetImageBase64) {
      setError('Please upload both source and target images');
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const request: FaceSwapRequest = {
        sourceImage: sourceImageBase64,
        targetImage: targetImageBase64
      };

      const response = await faceSwapApi.swapFaces(request);
      
      if (response.error) {
        setError(response.error);
      } else {
        setResultImage(response.resultUrl);
      }
    } catch (err) {
      setError('Failed to perform face swap. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Face Swap</h1>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Image (Face to Swap)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setSourceImagePreview, setSourceImageBase64)}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                {sourceImagePreview && (
                  <div className="mt-4">
                    <Image
                      src={sourceImagePreview}
                      alt="Source Preview"
                      width={320}
                      height={320}
                      className="rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Image (Face to Replace)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setTargetImagePreview, setTargetImageBase64)}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                {targetImagePreview && (
                  <div className="mt-4">
                    <Image
                      src={targetImagePreview}
                      alt="Target Preview"
                      width={320}
                      height={320}
                      className="rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Swap Faces'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {loading && (
            <div className="mt-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Processing images...</p>
            </div>
          )}

          {resultImage && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Result</h2>
              <div className="relative group">
                <div className="relative aspect-square">
                  <Image
                    src={resultImage}
                    alt="Face swap result"
                    width={400}
                    height={400}
                    className="rounded-lg shadow-md w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                  <div className="flex justify-between items-center">
                    <a
                      href={resultImage}
                      target="_blank"
                      className="text-xs text-blue-300 hover:text-blue-100 cursor-pointer"
                    >
                      Open in new tab
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 