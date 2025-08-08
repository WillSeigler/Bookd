// Client-side Cloudinary upload utilities
// Safe to import in client components

// Upload response from Cloudinary
export interface CloudinaryUploadResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  access_mode: string;
  original_filename: string;
}

// Upload options for profile pictures
export interface ProfilePictureUploadOptions {
  folder?: string;
  public_id?: string;
  tags?: string[];
  onProgress?: (progress: number) => void;
}

// Error types for upload failures
export class UploadError extends Error {
  constructor(message: string, public code?: string, public details?: any) {
    super(message);
    this.name = 'UploadError';
  }
}

/**
 * Upload a profile picture to Cloudinary
 * Uses the PROFILE preset for optimized avatar images
 */
export async function uploadProfilePicture(
  file: File,
  options: ProfilePictureUploadOptions = {}
): Promise<CloudinaryUploadResponse> {
  const {
    folder = 'bookd/profiles',
    public_id,
    tags = ['profile', 'avatar'],
    onProgress
  } = options;

  // Validate file
  if (!file) {
    throw new UploadError('No file provided');
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    throw new UploadError('File must be an image');
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new UploadError('File size must be less than 5MB');
  }

  // Get cloud name and build upload URL
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new UploadError('Cloudinary cloud name is not configured');
  }

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  
  // Create form data
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'profile_pictures');
  formData.append('folder', folder);
  formData.append('tags', tags.join(','));
  
  if (public_id) {
    formData.append('public_id', public_id);
  }

  try {
    // Create XMLHttpRequest for progress tracking
    return new Promise<CloudinaryUploadResponse>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        });
      }

      // Handle response
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response: CloudinaryUploadResponse = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new UploadError('Invalid response from server', 'PARSE_ERROR', error));
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            reject(new UploadError(
              errorResponse.error?.message || 'Upload failed',
              'UPLOAD_ERROR',
              errorResponse
            ));
          } catch {
            reject(new UploadError('Upload failed', 'NETWORK_ERROR'));
          }
        }
      });

      // Handle network errors
      xhr.addEventListener('error', () => {
        reject(new UploadError('Network error during upload', 'NETWORK_ERROR'));
      });

      // Handle timeouts
      xhr.addEventListener('timeout', () => {
        reject(new UploadError('Upload timeout', 'TIMEOUT_ERROR'));
      });

      // Configure request
      xhr.timeout = 30000; // 30 seconds
      xhr.open('POST', uploadUrl);
      xhr.send(formData);
    });

  } catch (error) {
    throw new UploadError(
      error instanceof Error ? error.message : 'Upload failed',
      'UNKNOWN_ERROR',
      error
    );
  }
}

/**
 * Delete a profile picture from Cloudinary
 */
export async function deleteProfilePicture(publicId: string): Promise<void> {
  try {
    // This would typically be done on the server side
    // For now, we'll just mark it as deleted in our system
    console.log('Profile picture deletion requested:', publicId);
    
    // In a real implementation, you would call your backend API
    // which would use the Cloudinary admin API to delete the image
    const response = await fetch('/api/profile/delete-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_id: publicId }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
  } catch (error) {
    throw new UploadError(
      error instanceof Error ? error.message : 'Failed to delete image',
      'DELETE_ERROR',
      error
    );
  }
}

/**
 * Generate optimized image URLs with transformations
 */
export function generateProfileImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  } = {}
): string {
  const {
    width = 200,
    height = 200,
    crop = 'fill',
    quality = 'auto',
    format = 'webp'
  } = options;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error('Cloudinary cloud name not configured');
  }

  const transformations = [
    `w_${width}`,
    `h_${height}`,
    `c_${crop}`,
    `q_${quality}`,
    `f_${format}`,
    'g_face' // Focus on face for profile pictures
  ].join(',');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
}

/**
 * Validate image file before upload
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Please select a JPEG, PNG, or WebP image' };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'Image must be smaller than 5MB' };
  }

  // Check minimum dimensions (optional)
  return new Promise<{ valid: boolean; error?: string }>((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      
      if (img.width < 100 || img.height < 100) {
        resolve({ valid: false, error: 'Image must be at least 100x100 pixels' });
      } else {
        resolve({ valid: true });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ valid: false, error: 'Invalid image file' });
    };

    img.src = url;
  }) as any; // TypeScript workaround for promise return type
}

/**
 * Generate initials for users without profile pictures
 */
export function generateInitials(name: string): string {
  if (!name) return '?';
  
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  return words
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
}

/**
 * Upload media files for social media posts (images and videos)
 */
export async function uploadToCloudinary(
  file: File,
  options: {
    folder?: string;
    public_id?: string;
    tags?: string[];
    onProgress?: (progress: number) => void;
  } = {}
): Promise<CloudinaryUploadResponse> {
  const {
    folder = 'bookd/posts',
    public_id,
    tags = ['social', 'post'],
    onProgress
  } = options;

  // Validate file
  if (!file) {
    throw new UploadError('No file provided');
  }

  // Check file type and size limits
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  
  if (!isImage && !isVideo) {
    throw new UploadError('File must be an image or video');
  }

  // Set size limits: 8MB for images, 75MB for videos
  const maxSize = isImage ? 8 * 1024 * 1024 : 75 * 1024 * 1024;
  if (file.size > maxSize) {
    const limit = isImage ? '8MB' : '75MB';
    throw new UploadError(`File size must be less than ${limit}`);
  }

  // Validate file types
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/mov', 'video/avi'];
  
  if (isImage && !allowedImageTypes.includes(file.type)) {
    throw new UploadError('Image must be JPEG, PNG, or WebP');
  }
  
  if (isVideo && !allowedVideoTypes.includes(file.type)) {
    throw new UploadError('Video must be MP4, WebM, MOV, or AVI');
  }

  // Get cloud name and build upload URL
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName || cloudName === 'your_cloudinary_cloud_name') {
    throw new UploadError(
      'Cloudinary is not configured. Please:\n' +
      '1. Create a Cloudinary account at https://cloudinary.com\n' +
      '2. Get your cloud name from the dashboard\n' +
      '3. Create .env.local file with NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name\n' +
      '4. Restart your dev server\n' +
      'See CLOUDINARY_SETUP.md for detailed instructions.'
    );
  }

  const resourceType = isVideo ? 'video' : 'image';
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
  
  // Create form data
  const formData = new FormData();
  formData.append('file', file);
  
  // Try upload with fallback presets
  const presets = isVideo 
    ? ['video_posts', 'profile_pictures'] 
    : ['social_media_posts', 'profile_pictures'];

  return await tryUploadWithPresets(presets, uploadUrl, formData, folder, tags, public_id, onProgress, isVideo);

  async function tryUploadWithPresets(
    presetList: string[],
    uploadUrl: string,
    baseFormData: FormData,
    folder: string,
    tags: string[],
    public_id?: string,
    onProgress?: (progress: number) => void,
    isVideo: boolean = false
  ): Promise<CloudinaryUploadResponse> {
    for (let i = 0; i < presetList.length; i++) {
      const preset = presetList[i];
      const formData = new FormData();
      
      // Copy all base form data
      formData.append('file', baseFormData.get('file') as File);
      formData.append('upload_preset', preset);
      formData.append('folder', folder);
      formData.append('tags', tags.join(','));
      
      if (public_id) {
        formData.append('public_id', public_id);
      }

      try {
        // Create XMLHttpRequest for progress tracking
        const result = await new Promise<CloudinaryUploadResponse>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          // Track upload progress
          if (onProgress && i === 0) { // Only show progress on first attempt
            xhr.upload.addEventListener('progress', (event) => {
              if (event.lengthComputable) {
                const progress = Math.round((event.loaded / event.total) * 100);
                onProgress(progress);
              }
            });
          }

          // Handle response
          xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
              try {
                const response: CloudinaryUploadResponse = JSON.parse(xhr.responseText);
                resolve(response);
              } catch (error) {
                reject(new UploadError('Invalid response from server', 'PARSE_ERROR', error));
              }
            } else {
              try {
                const errorResponse = JSON.parse(xhr.responseText);
                const errorMessage = errorResponse.error?.message || 'Upload failed';
                
                // If preset not found and we have more presets to try, continue to next
                if (errorMessage.includes('Upload preset not found') && i < presetList.length - 1) {
                  reject(new UploadError('Upload preset not found', 'PRESET_NOT_FOUND', errorResponse));
                } else {
                  reject(new UploadError(errorMessage, 'UPLOAD_ERROR', errorResponse));
                }
              } catch {
                reject(new UploadError('Upload failed', 'NETWORK_ERROR'));
              }
            }
          });

          // Handle network errors
          xhr.addEventListener('error', () => {
            reject(new UploadError('Network error during upload', 'NETWORK_ERROR'));
          });

          // Handle timeouts
          xhr.addEventListener('timeout', () => {
            reject(new UploadError('Upload timeout', 'TIMEOUT_ERROR'));
          });

          // Configure request
          xhr.timeout = isVideo ? 120000 : 60000;
          xhr.open('POST', uploadUrl);
          xhr.send(formData);
        });

        return result; // Success - return immediately
        
      } catch (error) {
        // If this was a preset not found error and we have more presets to try
        if (error instanceof UploadError && error.code === 'PRESET_NOT_FOUND' && i < presetList.length - 1) {
          console.warn(`Upload preset "${preset}" not found, trying "${presetList[i + 1]}"...`);
          continue; // Try next preset
        }
        
        // If this is the last preset or a different error, throw it
        if (i === presetList.length - 1) {
          // Add helpful message for the last attempt
          if (error instanceof UploadError && error.message.includes('Upload preset not found')) {
            throw new UploadError(
              `Upload failed: None of the required presets (${presetList.join(', ')}) were found in your Cloudinary account. Please create the upload presets as described in CLOUDINARY_SETUP.md`,
              'ALL_PRESETS_NOT_FOUND',
              error.details
            );
          }
        }
        
        throw error;
      }
    }

    throw new UploadError('All upload attempts failed', 'ALL_ATTEMPTS_FAILED');
  }
}

/**
 * Validate media file before upload (images and videos)
 */
export function validateMediaFile(file: File): { valid: boolean; error?: string } {
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  if (!isImage && !isVideo) {
    return { valid: false, error: 'Please select an image or video file' };
  }

  // Check file types
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/mov', 'video/avi'];
  
  if (isImage && !allowedImageTypes.includes(file.type)) {
    return { valid: false, error: 'Image must be JPEG, PNG, or WebP' };
  }
  
  if (isVideo && !allowedVideoTypes.includes(file.type)) {
    return { valid: false, error: 'Video must be MP4, WebM, MOV, or AVI' };
  }

  // Check file size
  const maxSize = isImage ? 8 * 1024 * 1024 : 75 * 1024 * 1024; // 8MB for images, 75MB for videos
  if (file.size > maxSize) {
    const limit = isImage ? '8MB' : '75MB';
    return { valid: false, error: `File must be smaller than ${limit}` };
  }

  return { valid: true };
}

/**
 * Generate a colored background for initials
 */
export function generateAvatarColor(name: string): string {
  const colors = [
    '#7823E1', // Brand purple
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#F97316', // Orange
  ];
  
  // Generate consistent color based on name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}