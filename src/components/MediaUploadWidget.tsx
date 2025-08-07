'use client';

import { useState, useCallback } from 'react';
import { uploadToCloudinary, validateMediaFile } from '@/lib/cloudinary/upload';

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  url?: string;
  error?: string;
}

interface MediaUploadWidgetProps {
  onMediaUploaded: (urls: string[], types: string[]) => void;
  maxFiles?: number;
  accept?: string;
}

export function MediaUploadWidget({ 
  onMediaUploaded, 
  maxFiles = 4,
  accept = "image/*,video/*" 
}: MediaUploadWidgetProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Handle file selection
  const handleFiles = useCallback((files: FileList) => {
    const newFiles: MediaFile[] = [];
    
    for (let i = 0; i < files.length && newFiles.length + mediaFiles.length < maxFiles; i++) {
      const file = files[i];
      
      // Validate file
      const validation = validateMediaFile(file);
      if (!validation.valid) {
        console.warn(`File ${file.name} rejected: ${validation.error}`);
        continue;
      }

      const id = Math.random().toString(36).substr(2, 9);
      const preview = URL.createObjectURL(file);
      
      newFiles.push({
        id,
        file,
        preview,
        uploading: false,
        uploaded: false
      });
    }

    setMediaFiles(prev => [...prev, ...newFiles]);
  }, [mediaFiles.length, maxFiles]);

  // Upload files to Cloudinary
  const uploadFiles = async () => {
    const filesToUpload = mediaFiles.filter(f => !f.uploaded && !f.uploading);
    
    // Mark files as uploading
    setMediaFiles(prev => prev.map(f => 
      filesToUpload.find(upload => upload.id === f.id) 
        ? { ...f, uploading: true, error: undefined }
        : f
    ));

    const uploadPromises = filesToUpload.map(async (mediaFile) => {
      try {
        const result = await uploadToCloudinary(mediaFile.file, {
          onProgress: (progress) => {
            // You could update individual file progress here if needed
            console.log(`Upload progress for ${mediaFile.file.name}: ${progress}%`);
          }
        });
        
        setMediaFiles(prev => prev.map(f => 
          f.id === mediaFile.id 
            ? { ...f, uploading: false, uploaded: true, url: result.secure_url }
            : f
        ));
        
        return { url: result.secure_url, type: mediaFile.file.type };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        setMediaFiles(prev => prev.map(f => 
          f.id === mediaFile.id 
            ? { ...f, uploading: false, error: errorMessage }
            : f
        ));
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successful = results.filter(r => r !== null) as { url: string; type: string }[];
    
    if (successful.length > 0) {
      const urls = successful.map(r => r.url);
      const types = successful.map(r => r.type);
      onMediaUploaded(urls, types);
    }
  };

  // Remove file
  const removeFile = (id: string) => {
    setMediaFiles(prev => {
      const updated = prev.filter(f => f.id !== id);
      const file = prev.find(f => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return updated;
    });
  };

  // Drag handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        } ${mediaFiles.length >= maxFiles ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={mediaFiles.length >= maxFiles}
        />
        
        <div className="space-y-2">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload</span> or drag and drop
          </div>
          <p className="text-xs text-gray-500">
            Images up to 8MB, Videos up to 75MB ({mediaFiles.length}/{maxFiles} files)
          </p>
        </div>
      </div>

      {/* File Previews */}
      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {mediaFiles.map((mediaFile) => (
            <div key={mediaFile.id} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {mediaFile.file.type.startsWith('image/') ? (
                  <img
                    src={mediaFile.preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={mediaFile.preview}
                    className="w-full h-full object-cover"
                    muted
                  />
                )}
                
                {/* Loading overlay */}
                {mediaFile.uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white">
                      <svg className="animate-spin h-8 w-8" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                )}

                {/* Success indicator */}
                {mediaFile.uploaded && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                {/* Error indicator */}
                {mediaFile.error && (
                  <div className="absolute inset-0 bg-red-500 bg-opacity-75 flex items-center justify-center">
                    <span className="text-white text-sm px-2 text-center">{mediaFile.error}</span>
                  </div>
                )}

                {/* Video play indicator */}
                {mediaFile.file.type.startsWith('video/') && !mediaFile.uploading && !mediaFile.error && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black bg-opacity-50 rounded-full p-2">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* Remove button */}
              <button
                onClick={() => removeFile(mediaFile.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {mediaFiles.some(f => !f.uploaded && !f.uploading) && (
        <button
          onClick={uploadFiles}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={mediaFiles.every(f => f.uploaded || f.uploading)}
        >
          Upload {mediaFiles.filter(f => !f.uploaded && !f.uploading).length} files
        </button>
      )}
    </div>
  );
}
