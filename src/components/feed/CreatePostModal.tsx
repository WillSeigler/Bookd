
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createPostsService } from '@/services/client/posts';
import type { FeedPost, User } from '@/types/database';
import { 
  validatePostContent, 
  sanitizeContent, 
  extractHashtags,
  withErrorHandling,
  getInitials 
} from '@/services/utils';
import { MediaUploadWidget } from '@/components/MediaUploadWidget';

interface CreatePostModalProps {
  currentUser: User | null;
  onClose: () => void;
  onPostCreated: (post: FeedPost) => void;
}

// Removed post types - all posts are general now

// Removed visibility options - all posts are public now

export function CreatePostModal({ currentUser, onClose, onPostCreated }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  // Removed post type state - all posts are general
  // Removed visibility state - all posts are public
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Media fields
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [mediaTypes, setMediaTypes] = useState<string[]>([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  
  // Location field (keeping this as it's useful for all posts)
  const [location, setLocation] = useState('');

  // Reset form when modal is closed
  const handleClose = () => {
    setContent('');
    setTitle('');
    setLocation('');
    setMediaUrls([]);
    setMediaTypes([]);
    onClose();
  };

  if (!currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate content
    const validation = validatePostContent(content);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    setIsSubmitting(true);

    try {
      const service = createPostsService();
      
      // Prepare post data
      const postData = {
        content: sanitizeContent(content),
        title: title.trim() || undefined,
        post_type: 'general', // All posts are general now
        visibility: 'public', // All posts are public now
        tags: extractHashtags(content),
         media_urls: mediaUrls.length > 0 ? mediaUrls : undefined,
         media_types: mediaTypes.length > 0 ? mediaTypes : undefined,
        ...(location && { location: location.trim() })
      };

      const { data, error } = await withErrorHandling(
        () => service.createPost(postData),
        'Failed to create post'
      );

      if (error) {
        console.error('Post creation error:', error);
        alert(`Failed to create post: ${error}`);
        return;
      }

      if (data) {
        console.log('Created post data:', data);
        console.log('Media URLs from response:', data.media_urls);
        console.log('Media URLs from state:', mediaUrls);
        
        // Create a FeedPost object for the feed
        const feedPost: FeedPost = {
          id: data.id,
          user_id: data.user_id,
          organization_id: data.organization_id,
          content: data.content,
          title: data.title,
          post_type: data.post_type,
          visibility: data.visibility,
          likes_count: 0,
          comments_count: 0,
          created_at: data.created_at,
          is_liked: false,
          author: currentUser,
           media_urls: data.media_urls || mediaUrls || undefined, // Fallback to state media URLs
           media_types: data.media_types || mediaTypes || undefined, // Fallback to state media types
          tags: data.tags || undefined,
          location: data.location || undefined
        };

        onPostCreated(feedPost);
        // Reset form
        setContent('');
        setTitle('');
        setLocation('');
        setMediaUrls([]);
        setMediaTypes([]);
        onClose();
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to create post: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Removed selectedPostType and selectedVisibility references

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Create Post</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            {currentUser.avatar_url ? (
              <Image
                src={currentUser.avatar_url}
                alt={currentUser.full_name || 'You'}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                {getInitials(currentUser)}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900">{currentUser.full_name}</p>
              <p className="text-sm text-gray-500">Sharing publicly</p>
            </div>
          </div>

          {/* Removed post type selection - all posts are general */}

          {/* Title (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a title..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              maxLength={100}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's on your mind?
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, experiences, or what's on your mind..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={6}
              maxLength={2000}
              required
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Use #hashtags to categorize your post</span>
              <span>{content.length}/2000</span>
            </div>

            {/* Location (moved here, under content) */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (optional)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 111.414-1.414l4.243 4.243a2 2 0 002.828 0l4.243-4.243a8 8 0 10-1.414 1.414z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where is this happening?"
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Add Photos or Videos (optional)
            </label>
            <MediaUploadWidget 
              onMediaUploaded={(urls, types) => {
                // Append newly uploaded media instead of replacing
                setMediaUrls(prev => [...prev, ...urls]);
                setMediaTypes(prev => [...prev, ...types]);
              }}
              onUploadStateChange={(uploading) => setIsUploadingMedia(uploading)}
              autoUpload
              maxFiles={4}
            />
            {isUploadingMedia && (
              <div className="mt-2 text-xs text-gray-500">Uploading media… Please wait before posting.</div>
            )}
          </div>



          {/* Removed event and collaboration specific fields - keeping it simple */}

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
              disabled={isSubmitting || !content.trim() || isUploadingMedia}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}