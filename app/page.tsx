'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setGeneratedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: selectedImage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setGeneratedImage(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-4 text-gray-800">
            Plaster Bust Generator
          </h1>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Transform your photo into an artistic plaster sculpture
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Upload Photo</h2>

              <div className="mb-6">
                <label className="block w-full">
                  <div className="border-3 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors cursor-pointer bg-gray-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-gray-600 font-medium">Click to upload image</p>
                    <p className="text-sm text-gray-500 mt-2">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                </label>
              </div>

              {selectedImage && (
                <div className="mb-6">
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src={selectedImage}
                      alt="Selected"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={!selectedImage || loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  'Generate Plaster Bust'
                )}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Result Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Plaster Bust</h2>

              {generatedImage ? (
                <div className="space-y-6">
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src={generatedImage}
                      alt="Generated plaster bust"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <a
                    href={generatedImage}
                    download="plaster-bust.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-green-700 transition-colors text-center shadow-lg hover:shadow-xl"
                  >
                    Download Image
                  </a>
                </div>
              ) : (
                <div className="w-full aspect-[3/4] rounded-xl bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <svg className="mx-auto h-16 w-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-lg font-medium">Your plaster bust will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">About This Generator</h3>
            <p className="text-gray-600 mb-4">
              This tool transforms your photos into artistic plaster bust sculptures featuring:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Handcrafted white plaster aesthetic with smooth, textured surfaces</li>
              <li>High-fashion art doll proportions with elongated neck and stylized features</li>
              <li>Preservation of identity, gender, mood, age, and accessories</li>
              <li>Cinematic studio lighting emphasizing sculptural depth</li>
              <li>3:4 vertical aspect ratio perfect for portraits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
