'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MiniMaxiRequest, MiniMaxiModel, MiniMaxiAspectRatio } from '@/types/minimaxi';
import { MiniMaxiApiService } from '@/services/minimaxiApi';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AspectRatioSelect } from '@/components/AspectRatioSelect';
export default function MiniMaxiPage() {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<MiniMaxiAspectRatio>(MiniMaxiAspectRatio.Square);
  const [n, setN] = useState(1);
  const [promptOptimizer, setPromptOptimizer] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);

  const minimaxiApi = new MiniMaxiApiService(
    process.env.NEXT_PUBLIC_MINIMAXI_URL || '',
    process.env.NEXT_PUBLIC_MINIMAXI_TOKEN || ''
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setError('Please upload an image first');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const request: MiniMaxiRequest = {
        model: MiniMaxiModel.Image01,
        prompt,
        subject_reference: [
          {
            type: 'character',
            image_file: image
          }
        ],
        aspect_ratio: aspectRatio,
        response_format: 'url',
        n,
        prompt_optimizer: promptOptimizer
      };

      const response = await minimaxiApi.generateImages(request);
      
      if (response.base_resp.status_code === 0 && response.data.image_urls) {
        setResults(response.data.image_urls);
      } else {
        setError(response.base_resp.status_msg || 'Failed to generate images');
      }
    } catch (err) {
      setError('Failed to generate images. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">MiniMaxi Image Generation</h1>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Reference Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {image && (
                <div className="mt-4">
                  <Image
                    src={image}
                    alt="Preview"
                    width={320}
                    height={320}
                    className="rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
                Prompt
              </label>
              <input
                type="text"
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <AspectRatioSelect 
                value={aspectRatio}
                onChange={(value) => setAspectRatio(value as MiniMaxiAspectRatio)}
              />
            </div>

            <div>
              <label htmlFor="n" className="block text-sm font-medium text-gray-700">
                Number of Images
              </label>
              <input
                type="number"
                id="n"
                min="1"
                max="10"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="promptOptimizer"
                checked={promptOptimizer}
                onChange={(e) => setPromptOptimizer(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="promptOptimizer" className="ml-2 block text-sm text-gray-900">
                Enable Prompt Optimizer
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Images'}
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
              <p className="mt-2 text-gray-600">Generating images...</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Generated Images ({results.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="relative aspect-square">
                      <Image
                        src={url}
                        alt={`Generated image ${index + 1}`}
                        width={400}
                        height={400}
                        className="rounded-lg shadow-md w-full h-full object-cover"
                        onError={(e) => {
                          console.error(`Failed to load image ${index + 1}:`, url);
                          (e.target as HTMLImageElement).src = '/image-error.png';
                        }}
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                      <p className="text-sm">Image {index + 1}</p>
                      <div className="flex justify-between items-center mt-1">
                        <button
                          className="text-xs text-indigo-300 hover:text-indigo-100"
                          onClick={() => {
                            const newWindow = window.open('', '_blank');
                            if (newWindow) {
                              newWindow.document.write(`
                                <!DOCTYPE html>
                                <html>
                                  <head>
                                    <title>Image ${index + 1}</title>
                                    <style>
                                      body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #000; }
                                      img { max-width: 100%; max-height: 100vh; }
                                    </style>
                                  </head>
                                  <body>
                                    <img src="${url}" alt="Generated image ${index + 1}" />
                                  </body>
                                </html>
                              `);
                              newWindow.document.close();
                            }
                          }}
                        >
                          View full size
                        </button>
                        <a
                          href={url}
                          download={`generated-image-${index + 1}.png`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-300 hover:text-blue-100 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = url;
                          }}
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 