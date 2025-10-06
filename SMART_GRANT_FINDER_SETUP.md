# Smart Grant Finder Setup Guide

## Overview
The Smart Grant Finder is an automated system that discovers new grants from configured source websites using AI (Google Gemini) and creates draft grants for admin review.

## Features Implemented

### Backend (Firebase Cloud Functions)
- **smartGrantFinder**: Scheduled function that runs every 24 hours
- Fetches source websites from `sourceWebsites` collection
- Uses Google Gemini AI to extract grant links and details
- Saves discovered grants to `pendingGrants` collection
- Prevents duplicate grants by checking existing URLs

### Frontend (Admin Dashboard)
- **Manage Sources**: Add/remove source websites for grant discovery
- **Grant Drafts**: Review and edit AI-discovered grants
- **Review Workflow**: Convert drafts to published grants with one click

## Setup Instructions

### 1. Environment Variables
Add the following environment variable to your Firebase Functions:

```bash
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY"
```

Or set it in your Firebase project settings:
- Go to Firebase Console > Functions > Configuration
- Add `GEMINI_API_KEY` with your Google AI API key

### 2. Get Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Copy the key and add it to your environment variables

### 3. Deploy Functions
```bash
cd client/grant-functions
npm install
npm run build
firebase deploy --only functions
```

### 4. Firestore Collections
The system will automatically create these collections:
- `sourceWebsites`: Stores configured source websites
- `pendingGrants`: Stores AI-discovered grant drafts

## Usage

### Adding Source Websites
1. Go to Admin Dashboard > "Manage Sources"
2. Add website name and URL
3. Click "Add Website"

### Reviewing Grant Drafts
1. Go to Admin Dashboard > "Grant Drafts"
2. Click "Review & Edit" on any draft
3. Modify the grant details as needed
4. Click "Save Grant" to publish

### Automated Discovery
- The system runs automatically every 24 hours
- Check the Firebase Functions logs for discovery progress
- New grants will appear in "Grant Drafts" section

## Data Flow

1. **Discovery**: AI scans source websites for grant links
2. **Extraction**: AI extracts grant details from each link
3. **Storage**: Grants saved as drafts in `pendingGrants`
4. **Review**: Admin reviews and edits drafts
5. **Publishing**: Approved grants moved to main `grants` collection

## Troubleshooting

### Common Issues
- **No grants discovered**: Check if source websites are accessible
- **AI extraction fails**: Verify Gemini API key is correct
- **Duplicate grants**: System automatically prevents duplicates

### Monitoring
- Check Firebase Functions logs for detailed execution info
- Monitor `pendingGrants` collection for new discoveries
- Review error logs for any extraction failures

## Customization

### AI Prompts
You can modify the AI prompts in `client/grant-functions/src/index.ts`:
- `extractGrantLinks()`: For finding grant links
- `extractGrantDetails()`: For extracting grant information

### Categories
Grant categories are predefined in the extraction prompt. To add more:
1. Update the prompt in `extractGrantDetails()`
2. Update the category list in `CreateGrantModal.tsx`

### Scheduling
To change the discovery frequency, modify the schedule in `smartGrantFinder`:
```typescript
export const smartGrantFinder = onSchedule(
  { schedule: "every 6 hours" }, // Change this
  async () => { ... }
);
```
