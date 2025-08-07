// Client-side service exports
export { createPostsService } from './posts';
export { createCommentsService } from './comments';
export { createUsersService } from './users';
export { createIndividualProfilesService } from './individual_profiles';
export { createClientExperienceService } from './experience';
export { createClientPerformancesService } from './performances';
export { updateCompleteProfile, validateProfileUpdate } from './profileUpdate';
export type { CompleteProfileUpdate, UpdateResult } from './profileUpdate';
export { 
  createFollowsService,
  followUser,
  unfollowUser,
  isFollowing,
  getCurrentUserFollowing,
  getCurrentUserFollowers,
  getCurrentUserFollowingIds
} from './follows';

// Re-export types for convenience
export type {
  Post,
  PostWithAuthor,
  FeedPost,
  PostComment,
  CommentWithAuthor,
  CommentThread,
  User,
  UserWithProfile,
  IndividualProfile,
  ExperienceEntry,
  PastPerformance,
  Database,
  Follow,
  SimpleFollow,
  FollowWithUser,
  FollowWithProfiles
} from '@/types/database';