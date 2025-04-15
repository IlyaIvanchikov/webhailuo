'use client';

import { useState, useEffect } from 'react';
import { KlingAi, KlingAiModel, KlingAiMode, KlingAiTaskType, KlingAiVersion } from '@/types/kling';
import { KlingApiService } from '@/services/klingApi';
import { S3Service } from '@/services/s3Service';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function KlingTestPage() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const klingApi = new KlingApiService(
    process.env.NEXT_PUBLIC_GOAPI_URL || '',
    process.env.NEXT_PUBLIC_GOAPI_TOKEN || ''
  );

  const s3Service = new S3Service(
    process.env.NEXT_PUBLIC_AWS_REGION || '',
    process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || ''
  );

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setUploadingImage(true);
        setError(null);
        const uploadedUrl = await s3Service.uploadImage(file);
        setImageUrl(uploadedUrl);
      } catch (err) {
        setError('Failed to upload image');
        console.error(err);
      } finally {
        setUploadingImage(false);
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl) {
      setError('Please upload an image first');
      return;
    }

    setLoading(true);
    setError(null);
    setVideoUrl(null);
    setCoverUrl(null);

    try {
      const goApiPayload: KlingAi = {
        model: KlingAiModel.Kling,
        input: {
          duration: 5,
          mode: KlingAiMode.Std,
          prompt: prompt,
          elements: [{ image_url: imageUrl }],
          negative_prompt: 'blurry, distorted faces, extra limbs, bad anatomy, deformed expressions, unnatural lighting, pixelated, artifacts, watermark, low resolution, unnatural poses, awkward body positioning, stiff motion, unrealistic skin.',
          version: KlingAiVersion.Version16
        },
        task_type: KlingAiTaskType.VideoGeneration
      };

      const response = await klingApi.generateVideo(goApiPayload);
      setTaskId(response.data.task_id);
    } catch (err) {
      console.error(err);
      setError('Failed to generate video. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (taskId) {
      intervalId = setInterval(async () => {
        try {
          const response = await klingApi.getTaskStatus(taskId);
          
          if (response.data.status === 'completed') {
            const videoUrl = response.data.output?.works?.[0]?.video?.resource_without_watermark;
            const coverUrl = response.data.output?.works?.[0]?.cover?.resource_without_watermark;
            
            if (videoUrl) {
              setVideoUrl(videoUrl);
              setCoverUrl(coverUrl || null);
              setLoading(false);
              clearInterval(intervalId);
            }
          } else if (response.data.status === 'failed') {
            setError('Video generation failed. Please try again.');
            setLoading(false);
            clearInterval(intervalId);
          }
        } catch (err) {
          console.error(err);
          setError('Failed to check task status. Please try again.');
          setLoading(false);
          clearInterval(intervalId);
        }
      }, 15000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [taskId]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Kling API Test</h1>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
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
              <label className="block text-sm font-medium text-gray-700">
                Upload Image <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploadingImage}
                  required
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    disabled:opacity-50"
                />
                {uploadingImage && (
                  <div className="mt-2 text-sm text-gray-500">
                    Uploading image...
                  </div>
                )}
              </div>
              {imageUrl && (
                <div className="mt-2">
                  <img
                    src={imageUrl}
                    alt="Uploaded"
                    className="max-w-xs rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || uploadingImage || !imageUrl}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Video'}
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
              <p className="mt-2 text-gray-600">Generating video...</p>
            </div>
          )}

          {videoUrl && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Generated Video</h2>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full"
                  poster={coverUrl || undefined}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 