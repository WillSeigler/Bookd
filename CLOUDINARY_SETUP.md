# Cloudinary Setup Instructions

## Step 1: Create Cloudinary Account
1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account or log in
3. Go to your Dashboard

## Step 2: Get Your Cloud Name
1. In your Cloudinary dashboard, you'll see "Cloud name" at the top
2. Copy this value (it will be something like "your-cloud-name")

## Step 3: Create Environment File
Create a file called `.env.local` in the root of your project (same level as package.json) with:

```bash
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-actual-cloud-name

# Your existing Supabase config (if you have it)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 4: Create Upload Presets
1. In your Cloudinary dashboard, go to "Settings" → "Upload"
2. Scroll down to "Upload presets"
3. Click "Add upload preset"

### Create these three presets:

#### Preset 1: profile_pictures
- **Upload preset name**: `profile_pictures`
- **Signing Mode**: Unsigned
- **Folder**: `bookd/profiles` (optional)
- **Media transformations**:
  - Width: 200
  - Height: 200
  - Crop: Fill
  - Quality: Auto
  - Format: Auto
- **Save**

#### Preset 2: social_media_posts
- **Upload preset name**: `social_media_posts`
- **Signing Mode**: Unsigned
- **Folder**: `bookd/posts` (optional)
- **Media transformations**:
  - Width: 1080
  - Height: 1080
  - Crop: Limit
  - Quality: Auto
  - Format: Auto
- **Save**

#### Preset 3: video_posts
- **Upload preset name**: `video_posts`
- **Signing Mode**: Unsigned
- **Folder**: `bookd/posts` (optional)
- **Media transformations**:
  - Width: 1080
  - Height: 1920
  - Crop: Limit
  - Quality: Auto
  - Format: mp4
- **Save**

## Step 5: Restart Your Development Server
After creating the `.env.local` file:
```bash
npm run dev
```

## Testing
1. Try uploading an image in the create post modal
2. You should see upload progress and success indicators
3. The image should appear in your post after creation

## Troubleshooting
- Make sure `.env.local` is in the root folder (not in src/)
- Double-check your cloud name is correct
- Ensure upload presets are set to "Unsigned"
- Restart your dev server after adding environment variables
