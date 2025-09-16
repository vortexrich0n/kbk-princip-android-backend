# KBK Princip Backend - Deployment Guide

## Current Production Setup
- **URL**: https://kbk-princip-android-backend.vercel.app
- **Database**: Neon PostgreSQL
- **Status**: ✅ WORKING - DO NOT MODIFY DIRECTLY

## How to Add New Features Safely

### 1. Create Development Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Test Locally First
```bash
npm run dev
```

### 3. Deploy to Staging (Preview)
When you push to your feature branch, Vercel automatically creates a preview deployment.

### 4. Merge to Production
Only after thorough testing:
```bash
git checkout main
git merge feature/your-feature-name
git push
```

## Important Files - DO NOT MODIFY
- `/prisma/schema.prisma` - Database schema (working version)
- `/app/api/login/route.ts` - Authentication endpoint
- `/app/api/register/route.ts` - Registration with email verification
- `/lib/email.ts` - Gmail SMTP configuration

## Environment Variables (Set in Vercel)
- `DATABASE_URL` - Neon PostgreSQL connection
- `JWT_SECRET` - Authentication secret
- `GMAIL_USER` - principkbk@gmail.com
- `GMAIL_APP_PASSWORD` - App-specific password
- `BASE_URL` - https://kbk-princip-android-backend.vercel.app

## Testing Endpoints
```bash
# Registration
curl -X POST https://kbk-princip-android-backend.vercel.app/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456","name":"Test User"}'

# Login
curl -X POST https://kbk-princip-android-backend.vercel.app/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456"}'
```

## Vercel Settings to Configure
1. Go to Vercel Dashboard → Project Settings
2. Set **Production Branch**: `main`
3. Enable **Preview Deployments** for feature branches
4. Set **Ignored Build Step**: Add `.vercelignore` if needed

## If You Need Major Changes
Consider creating a separate Vercel project for experimentation:
- `kbk-princip-backend-dev` for development
- Keep this one as stable production