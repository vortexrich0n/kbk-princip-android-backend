# Deploy Instructions

## 1. Push to GitHub

```bash
git remote add origin https://github.com/vortexrich0n/kbk-princip-android-backend.git
git push -u origin main
```

## 2. Deploy to Vercel

1. Go to https://vercel.com
2. Import the GitHub repository
3. Add these environment variables:
   - DATABASE_URL = postgresql://neondb_owner:npg_VkxulS56JXyH@ep-restless-mud-agpy12tw.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
   - JWT_SECRET = your-secret-key-change-in-production-123456789
   - NEXTAUTH_SECRET = your-nextauth-secret-change-in-production-987654321

## 3. Update Android App

Once deployed, update the NetworkConfig.kt file in the Android app with the Vercel URL.

## API Endpoints

- POST `/api/login` - User login
- POST `/api/register` - User registration
- GET `/api/users` - Get all users (admin only)
- PATCH `/api/users/[userId]` - Update user membership
- DELETE `/api/users/[userId]` - Delete user
- GET `/api/auth/session` - Get current session