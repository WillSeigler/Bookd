import { createClient } from '@/lib/supabase/client';
import type { 
  Database, 
  User, 
  IndividualProfile, 
  UserWithProfile
} from '@/types/database';

type SupabaseClient = ReturnType<typeof createClient>;

export class UsersService {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      
      if (error || !user) {
        return null;
      }

      // Get full user data from our users table
      const { data: userData, error: userError } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        return null;
      }

      return userData;
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      return null;
    }
  }

  /**
   * Get current authenticated user with their individual profile
   * Auto-creates individual profile if it doesn't exist
   */
  async getCurrentUserWithProfile(): Promise<UserWithProfile | null> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      
      if (error || !user) {
        return null;
      }

      return this.getUserWithProfile(user.id);
    } catch (error) {
      console.error('Error in getCurrentUserWithProfile:', error);
      return null;
    }
  }

  /**
   * Get user with their individual profile
   * Auto-creates individual profile if it doesn't exist
   */
  async getUserWithProfile(userId: string): Promise<UserWithProfile | null> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select(`
          *,
          individual_profile:individual_profiles(*)
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user with profile:', error);
        return null;
      }

      // If user exists but has no individual profile, create one
      if (data && !data.individual_profile) {
        try {
          const { data: newProfile } = await this.supabase
            .from('individual_profiles')
            .insert({
              user_id: userId,
              looking_for_gigs: true,
              available_for_hire: true,
              profile_complete: false,
              verified: false,
              total_performances: 0,
              average_rating: 0.0,
              social_links: {},
              availability: {}
            })
            .select()
            .single();

          // Attach the new profile to the user data
          if (newProfile) {
            data.individual_profile = newProfile;
          }
        } catch (profileError) {
          console.error('Error creating individual profile:', profileError);
          // Continue without profile rather than failing entirely
        }
      }

      return data as UserWithProfile;
    } catch (error) {
      console.error('Error in getUserWithProfile:', error);
      return null;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user by ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserById:', error);
      return null;
    }
  }

  /**
   * Update user data in the users table
   */
  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      // Remove fields that shouldn't be updated directly
      const { id, created_at, ...validUpdates } = updates;

      const { data, error } = await this.supabase
        .from('users')
        .update({
          ...validUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  }

  /**
   * Update current authenticated user's data
   */
  async updateCurrentUser(updates: Partial<User>): Promise<User | null> {
    try {
      const { data: { user }, error: authError } = await this.supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      return this.updateUser(user.id, updates);
    } catch (error) {
      console.error('Error in updateCurrentUser:', error);
      throw error;
    }
  }
}

// Factory function for client-side usage
export function createUsersService() {
  const supabase = createClient();
  return new UsersService(supabase);
}

// Convenience functions for common operations
export async function getCurrentUser() {
  const service = createUsersService();
  return service.getCurrentUser();
}

export async function getCurrentUserWithProfile() {
  const service = createUsersService();
  return service.getCurrentUserWithProfile();
}

export async function getUserWithProfile(userId: string) {
  const service = createUsersService();
  return service.getUserWithProfile(userId);
}

export async function updateCurrentUser(updates: Partial<User>) {
  const service = createUsersService();
  return service.updateCurrentUser(updates);
}