import { createClient } from '@/lib/supabase/client';
import type { 
  Database, 
  User, 
  SimpleFollow, 
  FollowWithUser,
  Follow,
  FollowWithProfiles
} from '@/types/database';

type SupabaseClient = ReturnType<typeof createClient>;

export class FollowsService {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Follow a user
   */
  async followUser(targetUserId: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .rpc('toggle_follow_user', { target_user_id: targetUserId });

      if (error) {
        console.error('Error following user:', error);
        return false;
      }

      // Return true if now following, false if unfollowed
      return data === true;
    } catch (error) {
      console.error('Error in followUser:', error);
      return false;
    }
  }

  /**
   * Unfollow a user
   */
  async unfollowUser(targetUserId: string): Promise<boolean> {
    try {
      // The toggle function will unfollow if already following
      const { data, error } = await this.supabase
        .rpc('toggle_follow_user', { target_user_id: targetUserId });

      if (error) {
        console.error('Error unfollowing user:', error);
        return false;
      }

      // Return true if successfully unfollowed (data should be false)
      return data === false;
    } catch (error) {
      console.error('Error in unfollowUser:', error);
      return false;
    }
  }

  /**
   * Check if current user is following a specific user
   */
  async isFollowing(targetUserId: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .rpc('is_following_user', { target_user_id: targetUserId });

      if (error) {
        console.error('Error checking follow status:', error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error('Error in isFollowing:', error);
      return false;
    }
  }

  /**
   * Get users that the current user is following
   */
  async getUserFollowing(userId: string, limit: number = 50): Promise<FollowWithUser[]> {
    try {
      const { data, error } = await this.supabase
        .from('follows')
        .select(`
          id,
          follower_user_id,
          followed_user_id,
          created_at,
          following:followed_user_id(id, full_name, avatar_url)
        `)
        .eq('follower_user_id', userId)
        .eq('status', 'active')
        .is('followed_user_id', 'not.null') // Only user follows, not organizations
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error getting user following:', error);
        return [];
      }

      // Transform the data to match our FollowWithUser interface
      const transformedData: FollowWithUser[] = (data || []).map(follow => ({
        id: follow.id,
        follower_id: follow.follower_user_id,
        following_id: follow.followed_user_id!,
        created_at: follow.created_at,
        following: follow.following as User
      }));

      return transformedData;
    } catch (error) {
      console.error('Error in getUserFollowing:', error);
      return [];
    }
  }

  /**
   * Get users that are following the specified user
   */
  async getUserFollowers(userId: string, limit: number = 50): Promise<FollowWithUser[]> {
    try {
      const { data, error } = await this.supabase
        .from('follows')
        .select(`
          id,
          follower_user_id,
          followed_user_id,
          created_at,
          follower:follower_user_id(id, full_name, avatar_url)
        `)
        .eq('followed_user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error getting user followers:', error);
        return [];
      }

      // Transform the data to match our FollowWithUser interface
      const transformedData: FollowWithUser[] = (data || []).map(follow => ({
        id: follow.id,
        follower_id: follow.follower_user_id,
        following_id: follow.followed_user_id!,
        created_at: follow.created_at,
        follower: follow.follower as User
      }));

      return transformedData;
    } catch (error) {
      console.error('Error in getUserFollowers:', error);
      return [];
    }
  }

  /**
   * Get follower count for a user
   */
  async getUserFollowerCount(userId: string): Promise<number> {
    try {
      const { data, error } = await this.supabase
        .rpc('get_user_follower_count', { target_user_id: userId });

      if (error) {
        console.error('Error getting follower count:', error);
        return 0;
      }

      return data || 0;
    } catch (error) {
      console.error('Error in getUserFollowerCount:', error);
      return 0;
    }
  }

  /**
   * Get following count for a user
   */
  async getUserFollowingCount(userId: string): Promise<number> {
    try {
      const { data, error } = await this.supabase
        .rpc('get_user_following_count', { target_user_id: userId });

      if (error) {
        console.error('Error getting following count:', error);
        return 0;
      }

      return data || 0;
    } catch (error) {
      console.error('Error in getUserFollowingCount:', error);
      return 0;
    }
  }

  /**
   * Get list of user IDs that the current user follows (for feed filtering)
   */
  async getFollowingUserIds(userId: string): Promise<string[]> {
    try {
      const { data, error } = await this.supabase
        .from('follows')
        .select('followed_user_id')
        .eq('follower_user_id', userId)
        .eq('status', 'active')
        .is('followed_user_id', 'not.null'); // Only user follows

      if (error) {
        console.error('Error getting following user IDs:', error);
        return [];
      }

      return (data || [])
        .map(follow => follow.followed_user_id)
        .filter((id): id is string => id !== null);
    } catch (error) {
      console.error('Error in getFollowingUserIds:', error);
      return [];
    }
  }

  /**
   * Get mutual followers between current user and target user
   */
  async getMutualFollowers(targetUserId: string, currentUserId: string): Promise<User[]> {
    try {
      // Get users who follow both current user and target user
      const { data, error } = await this.supabase
        .from('follows')
        .select(`
          follower_user_id,
          follower:follower_user_id(id, full_name, avatar_url)
        `)
        .eq('followed_user_id', targetUserId)
        .eq('status', 'active')
        .in('follower_user_id', 
          // Subquery to get users who follow current user
          this.supabase
            .from('follows')
            .select('follower_user_id')
            .eq('followed_user_id', currentUserId)
            .eq('status', 'active')
        );

      if (error) {
        console.error('Error getting mutual followers:', error);
        return [];
      }

      return (data || [])
        .map(follow => follow.follower as User)
        .filter(user => user !== null);
    } catch (error) {
      console.error('Error in getMutualFollowers:', error);
      return [];
    }
  }
}

// Factory function for client-side usage
export function createFollowsService() {
  const supabase = createClient();
  return new FollowsService(supabase);
}

// Convenience functions for direct usage
export async function followUser(targetUserId: string): Promise<boolean> {
  const service = createFollowsService();
  return service.followUser(targetUserId);
}

export async function unfollowUser(targetUserId: string): Promise<boolean> {
  const service = createFollowsService();
  return service.unfollowUser(targetUserId);
}

export async function isFollowing(targetUserId: string): Promise<boolean> {
  const service = createFollowsService();
  return service.isFollowing(targetUserId);
}

export async function getCurrentUserFollowing(limit?: number): Promise<FollowWithUser[]> {
  const service = createFollowsService();
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  
  return service.getUserFollowing(user.id, limit);
}

export async function getCurrentUserFollowers(limit?: number): Promise<FollowWithUser[]> {
  const service = createFollowsService();
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  
  return service.getUserFollowers(user.id, limit);
}

export async function getCurrentUserFollowingIds(): Promise<string[]> {
  const service = createFollowsService();
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  
  return service.getFollowingUserIds(user.id);
}
