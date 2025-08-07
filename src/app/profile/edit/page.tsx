import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerUserWithProfile } from '@/lib/auth/utils';
import { ProfilePictureUpload } from '@/components/profile/ProfilePictureUpload';
import { 
  BasicInfoForm, 
  ProfessionalInfoForm, 
  SocialLinksForm, 
  ExperiencePerformancesSection 
} from '@/components/profile/edit';

export default async function ProfileEditPage() {
  // Get authenticated user with profile (auto-creates profile if needed)
  const userWithProfile = await getServerUserWithProfile();

  if (!userWithProfile) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
              <p className="text-gray-600 mt-1">
                Update your information to showcase your musical talents and connect with opportunities.
              </p>
            </div>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Profile Picture Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Picture</h2>
          <div className="flex justify-center">
            <ProfilePictureUpload 
              userWithProfile={userWithProfile}
              editable={true}
              size="xl"
              showUploadPrompt={true}
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            Upload a professional photo that represents you as a musician
          </p>
        </div>

        {/* Basic Information */}
        <BasicInfoForm userWithProfile={userWithProfile} />

        {/* Professional Information */}
        <ProfessionalInfoForm userWithProfile={userWithProfile} />

        {/* Social Media Links */}
        <SocialLinksForm userWithProfile={userWithProfile} />

        {/* Experience & Performances */}
        <ExperiencePerformancesSection userWithProfile={userWithProfile} />

        {/* Bottom Spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}