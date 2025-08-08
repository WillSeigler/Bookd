import { createClient } from '@/lib/supabase/client';
import type { Database, Post, PostWithAuthor, FeedPost } from '@/types/database';

type SupabaseClient = ReturnType<typeof createClient>;

export class PostsService {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Get the user's personalized feed - FOLLOWING ONLY for MVP
   * Only shows posts from users the current user is following
   */
  async getUserFeed(userId?: string, limit: number = 20, offset: number = 0): Promise<FeedPost[]> {
    try {
      if (!userId) {
        return []; // No user, no feed
      }

      // Get list of user IDs that the current user follows
      const { data: followingData, error: followingError } = await this.supabase
        .from('follows')
        .select('followed_user_id')
        .eq('follower_user_id', userId)
        .eq('status', 'active')
        .is('followed_user_id', 'not.null'); // Only user follows, not organizations for MVP

      if (followingError) {
        console.error('Error getting following list:', followingError);
        throw followingError;
      }

      const followingUserIds = (followingData || [])
        .map(follow => follow.followed_user_id)
        .filter((id): id is string => id !== null);

      // Always include the current user's own posts in their feed
      const feedUserIds = Array.from(new Set<string>([...followingUserIds, userId]));

      // If user follows no one, return empty feed
      if (followingUserIds.length === 0) {
        return [];
      }

      // Get posts from followed users with author information
      const { data, error } = await this.supabase
        .from('posts')
        .select(`
          *,
          users:user_id(id, full_name, avatar_url),
          organization_profiles:organization_id(id, name, logo_url),
          post_likes(user_id, reaction_type),
          post_comments(id)
        `)
        .in('user_id', feedUserIds)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching user feed:', error);
        throw error;
      }

      // Transform the data to match FeedPost type
      const transformedData = (data || []).map(post => ({
        id: post.id,
        user_id: post.user_id,
        organization_id: post.organization_id,
        content: post.content,
        title: post.title,
        post_type: post.post_type,
        visibility: post.visibility,
        likes_count: post.post_likes?.length || 0,
        comments_count: post.post_comments?.length || 0,
        created_at: post.created_at,
        is_liked: post.post_likes?.some((like: any) => like.user_id === userId) || false,
        author: post.users || post.organization_profiles,
        media_urls: post.media_urls,
        media_types: post.media_types,
        tags: post.tags,
        location: post.location
      })) as FeedPost[];

      return transformedData;
    } catch (error) {
      console.error('Error in getUserFeed:', error);
      throw error;
    }
  }

  /**
   * Get the user's full feed using the original database function (includes public posts)
   * Keep this for potential future use or different feed views
   */
  async getFullUserFeed(userId?: string, limit: number = 20, offset: number = 0): Promise<FeedPost[]> {
    try {
      const { data, error } = await this.supabase.rpc('get_user_feed', {
        p_user_id: userId || null,
        p_limit: limit,
        p_offset: offset
      });

      if (error) {
        console.error('Error fetching user feed:', error);
        throw error;
      }

      // Fetch author information for each post
      const enrichedPosts = await Promise.all(
        (data || []).map(async (post: any) => {
          let author = null;
          
          // Fetch user author if post has user_id
          if (post.user_id) {
            const { data: userData, error: userError } = await this.supabase
              .from('users')
              .select('id, full_name, avatar_url')
              .eq('id', post.user_id)
              .single();
            
            if (!userError && userData) {
              author = userData;
            }
          }
          
          // Fetch organization author if post has organization_id
          if (post.organization_id) {
            const { data: orgData, error: orgError } = await this.supabase
              .from('organization_profiles')
              .select('id, name, logo_url')
              .eq('id', post.organization_id)
              .single();
            
            if (!orgError && orgData) {
              author = orgData;
            }
          }

          return {
            ...post,
            author
          } as FeedPost;
        })
      );

      return enrichedPosts;
    } catch (error) {
      console.error('Error in getFullUserFeed:', error);
      throw error;
    }
  }

  /**
   * Toggle like on a post (like/unlike)
   */
  async togglePostLike(postId: string, reactionType: string = 'like'): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.rpc('toggle_post_like', {
        p_post_id: postId,
        p_reaction_type: reactionType
      });

      if (error) {
        console.error('Error toggling post like:', error);
        throw error;
      }

      return data; // Returns true if liked, false if unliked
    } catch (error) {
      console.error('Error in togglePostLike:', error);
      throw error;
    }
  }

  /**
   * Create a new post
   */
  async createPost(postData: {
    content?: string;
    title?: string;
    post_type?: string;
    visibility?: string;
    media_urls?: string[];
    media_types?: string[];
    tags?: string[];
    location?: string;
    event_date?: string;
    venue_name?: string;
    collaboration_type?: string;
    instruments_needed?: string[];
    genres?: string[];
    compensation_offered?: string;
  }): Promise<Post | null> {
    try {
      // Require authentication and set user_id for RLS and NOT NULL constraint
      const { data: authData, error: authError } = await this.supabase.auth.getUser();
      if (authError || !authData?.user) {
        throw new Error('You must be signed in to create a post');
      }

      const authenticatedUserId = authData.user.id;

      // Ensure media arrays are valid per DB constraint
      const hasUrls = Array.isArray(postData.media_urls) && postData.media_urls.length > 0;
      const hasTypes = Array.isArray(postData.media_types) && postData.media_types.length > 0;
      const mediaLengthsMatch = hasUrls && hasTypes && postData.media_urls!.length === postData.media_types!.length;

      const insertPayload: any = {
        ...postData,
        user_id: authenticatedUserId,
        post_type: postData.post_type || 'general',
        visibility: postData.visibility || 'public',
        is_published: true,
      };

      if (!hasUrls) {
        insertPayload.media_urls = null;
        insertPayload.media_types = null;
      } else if (hasUrls && !mediaLengthsMatch) {
        insertPayload.media_types = null;
      }

      const { data, error } = await this.supabase
        .from('posts')
        .insert([insertPayload])
        .select()
        .single();

      if (error) {
        console.error('Error creating post:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createPost:', error);
      throw error;
    }
  }
}

// Factory function for client-side usage
export function createPostsService() {
  const supabase = createClient();
  return new PostsService(supabase);
}