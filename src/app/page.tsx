'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

interface FormData {
  prompt: string;
  aspectRatio: string;
  n: number;
  promptOptimizer: boolean;
}

interface ApiResponse {
  id: string;
  data: {
    image_urls: string[];
  };
  metadata: {
    failed_count: string;
    success_count: string;
  };
  base_resp: {
    status_code: number;
    status_msg: string;
  };
}

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const [formData, setFormData] = useState<FormData>({
    prompt: '',
    aspectRatio: '16:9',
    n: 2,
    promptOptimizer: true,
  });

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
    setError('');
    setResults([]); // Clear previous results

    try {
      const response = await axios.post<ApiResponse>(
        'https://api.minimaxi.chat/v1/image_generation',
        {
          model: 'image-01',
          prompt: formData.prompt,
          subject_reference: [
            {
              type: 'character',
              image_file: image,
            },
          ],
          aspect_ratio: formData.aspectRatio,
          response_format: 'url',
          n: formData.n,
          prompt_optimizer: formData.promptOptimizer,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
          },
        }
      );

      if (response.data.base_resp.status_code === 0 && response.data.data.image_urls) {
        console.log('Received images:', response.data.data.image_urls);
        setResults(response.data.data.image_urls);
      } else {
        setError(response.data.base_resp.status_msg || 'Failed to generate images');
      }
    } catch (err) {
      setError('Failed to generate images. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Image Generation</h1>
        <button
          onClick={() => {
            logout();
            router.push('/login');
          }}
          className="text-red-600 hover:text-red-800"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
          {image && (
            <div className="mt-4">
              <Image
                src={image}
                alt="Preview"
                width={320}
                height={180}
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
            value={formData.prompt}
            onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-700">
            Aspect Ratio
          </label>
          <select
            id="aspectRatio"
            value={formData.aspectRatio}
            onChange={(e) => setFormData({ ...formData, aspectRatio: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="16:9">16:9</option>
            <option value="1:1">1:1</option>
            <option value="4:3">4:3</option>
          </select>
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
            value={formData.n}
            onChange={(e) => setFormData({ ...formData, n: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="promptOptimizer"
            checked={formData.promptOptimizer}
            onChange={(e) => setFormData({ ...formData, promptOptimizer: e.target.checked })}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="promptOptimizer" className="ml-2 block text-sm text-gray-900">
            Enable Prompt Optimizer
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Images'}
        </button>
      </form>

      {loading && (
        <div className="mt-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Generating images...</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Generated Images ({results.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((url, index) => (
              <div key={index} className="relative group">
                <div className="relative aspect-video">
                  <Image
                    src={url}
                    alt={`Generated image ${index + 1}`}
                    width={400}
                    height={300}
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
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-300 hover:text-indigo-100"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(url, '_blank');
                      }}
                    >
                      View full size
                    </a>
                    <button
                      className="text-xs text-indigo-300 hover:text-indigo-100"
                      onClick={async (e) => {
                        e.preventDefault();
                        try {
                          // Create a temporary image element
                          const img = document.createElement('img');
                          img.crossOrigin = 'anonymous';
                          
                          // Wait for the image to load
                          await new Promise((resolve, reject) => {
                            img.onload = resolve;
                            img.onerror = reject;
                            img.src = url;
                          });

                          // Create a canvas and draw the image
                          const canvas = document.createElement('canvas');
                          canvas.width = img.width;
                          canvas.height = img.height;
                          const ctx = canvas.getContext('2d');
                          if (!ctx) throw new Error('Could not get canvas context');
                          ctx.drawImage(img, 0, 0);

                          // Convert canvas to blob and download
                          canvas.toBlob((blob) => {
                            if (!blob) throw new Error('Could not create blob');
                            const blobUrl = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = blobUrl;
                            a.download = `generated-image-${index + 1}.jpg`;
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(blobUrl);
                            document.body.removeChild(a);
                          }, 'image/jpeg', 0.95);
                        } catch (error) {
                          console.error('Error downloading image:', error);
                          alert('Failed to download image. Please try viewing it in a new tab and saving it manually.');
                        }
                      }}
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
