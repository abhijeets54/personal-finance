# Vercel Deployment Troubleshooting Guide

## 🚨 Current Issue: Deployment Failed

### Quick Fix Steps

1. **Check Environment Variables in Vercel Dashboard**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Ensure these are set:
     ```
     MONGODB_URI = mongodb+srv://as9184635:K6ID1cfkAjkk0aFL@cluster0.omuka7r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     MONGODB_DB = personal_finance
     ```

2. **Verify MongoDB Atlas Configuration**
   - **Network Access**: Go to MongoDB Atlas → Network Access
   - Add IP Address: `0.0.0.0/0` (Allow access from anywhere)
   - **Database Access**: Ensure user `as9184635` has `readWrite` permissions

3. **Check Vercel Build Logs**
   - In Vercel dashboard, click on the failed deployment
   - Click "View Function Logs" or "Build Logs"
   - Look for specific error messages

## 🔧 Common Deployment Issues & Solutions

### Issue 1: Build Timeout
**Symptoms**: Build process times out
**Solution**: 
- Vercel has build time limits (10 minutes for hobby plan)
- Our app should build in under 2 minutes

### Issue 2: Environment Variables Not Found
**Symptoms**: `Database configuration missing` errors
**Solution**:
```bash
# In Vercel Dashboard → Settings → Environment Variables
MONGODB_URI = your_mongodb_connection_string
MONGODB_DB = personal_finance
```

### Issue 3: MongoDB Connection Issues
**Symptoms**: Connection timeout or authentication errors
**Solution**:
1. **IP Whitelist**: Add `0.0.0.0/0` in MongoDB Atlas Network Access
2. **User Permissions**: Ensure database user has proper permissions
3. **Connection String**: Verify the connection string format

### Issue 4: Function Timeout
**Symptoms**: API routes return 504 errors
**Solution**: Already configured with 30-second timeout using `export const maxDuration = 30` in each API route

## 📋 Pre-Deployment Checklist

- [ ] Environment variables set in Vercel dashboard
- [ ] MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- [ ] Database user has `readWrite` permissions
- [ ] Latest code pushed to repository
- [ ] No TypeScript errors (run `npm run lint`)
- [ ] Build passes locally (if possible)

## 🔍 Debugging Steps

### Step 1: Check Build Logs
1. Go to Vercel dashboard
2. Click on the failed deployment
3. Look for error messages in build logs

### Step 2: Test API Routes After Deployment
Once deployed, test these endpoints:
```
https://your-app.vercel.app/api/test-db
https://your-app.vercel.app/api/analytics/dashboard
```

### Step 3: Check Function Logs
1. In Vercel dashboard → Functions tab
2. Look for runtime errors in function logs
3. Check for MongoDB connection issues

## 🛠️ Manual Deployment Steps

If automatic deployment fails:

1. **Clone and Build Locally** (if possible):
   ```bash
   git clone your-repo
   cd personal-finance-visualizer
   npm install
   npm run build
   ```

2. **Deploy via Vercel CLI**:
   ```bash
   npm i -g vercel
   vercel --prod
   ```

## 📞 Getting Help

### Check These Resources:
1. **Vercel Documentation**: https://vercel.com/docs
2. **Next.js Deployment**: https://nextjs.org/docs/deployment
3. **MongoDB Atlas**: https://docs.atlas.mongodb.com/

### Common Error Messages:

**"Database configuration missing"**
- Environment variables not set in Vercel

**"Connection timeout"**
- MongoDB Atlas IP whitelist issue

**"Authentication failed"**
- Incorrect MongoDB credentials or permissions

**"Function timeout"**
- Database query taking too long (should be resolved with our optimizations)

## 🎯 Next Steps

1. **Immediate**: Check Vercel build logs for specific error
2. **Verify**: Environment variables in Vercel dashboard
3. **Test**: MongoDB connection from Atlas dashboard
4. **Deploy**: Push any fixes and redeploy

## 📱 Contact Support

If issues persist:
1. Check Vercel status page: https://vercel-status.com/
2. MongoDB Atlas status: https://status.mongodb.com/
3. Review our deployment guide: `DEPLOYMENT_GUIDE.md`

---

**Last Updated**: After fixing MongoDB connection pooling and serverless configuration
**Status**: Ready for deployment with proper configuration
