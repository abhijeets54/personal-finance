# Vercel Deployment Guide

## Issues Fixed

### 1. MongoDB Connection Pooling
- **Problem**: API routes were creating new MongoDB connections for each request without proper pooling
- **Solution**: Implemented connection caching and pooling optimized for serverless environments
- **Files Updated**: 
  - `src/lib/mongodb.ts` - Added proper connection caching with serverless-optimized settings
  - All API routes now use `getDatabase()` function instead of direct MongoDB client connections

### 2. Connection Management
- **Problem**: Routes were manually closing connections, causing issues in serverless environment
- **Solution**: Removed manual connection closing, letting the connection pool handle lifecycle
- **Files Updated**: All API routes in `src/app/api/`

### 3. Serverless Function Configuration
- **Problem**: Default Vercel timeout was too short for database operations
- **Solution**: Added proper Vercel configuration
- **Files Updated**: 
  - `vercel.json` - Added function timeout and environment variable configuration
  - `next.config.ts` - Added serverless optimizations

## Deployment Steps

### 1. Environment Variables in Vercel
Set these environment variables in your Vercel dashboard:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=personal_finance
```

### 2. MongoDB Atlas Configuration
1. **Network Access**: Add `0.0.0.0/0` to IP whitelist (allow access from anywhere)
2. **Database User**: Ensure user has `readWrite` permissions on the database
3. **Connection String**: Use the connection string format shown above

### 3. Vercel Deployment
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy the application

### 4. Testing the Deployment
After deployment, test these endpoints:
- `/api/test-db` - Verify database connection
- `/api/analytics/dashboard` - Test dashboard data
- `/api/analytics/monthly` - Test monthly analytics
- `/api/analytics/categories` - Test category analytics

## Key Changes Made

### MongoDB Connection (`src/lib/mongodb.ts`)
```typescript
// Optimized connection options for serverless
const options = {
  maxPoolSize: 1,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 30000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  retryReads: true,
  maxIdleTimeMS: 30000,
  minPoolSize: 0,
};

// Global connection caching
let cached = global.mongo || { conn: null, promise: null };
```

### Vercel Configuration (`vercel.json`)
```json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "MONGODB_URI": "@mongodb_uri",
    "MONGODB_DB": "@mongodb_db"
  }
}
```

### Next.js Configuration (`next.config.ts`)
```typescript
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mongodb']
  },
  api: {
    bodyParser: { sizeLimit: '1mb' },
    responseLimit: '8mb',
  },
};
```

## Common Issues and Solutions

### 1. 500 Internal Server Error
- **Cause**: Environment variables not set correctly
- **Solution**: Verify `MONGODB_URI` and `MONGODB_DB` in Vercel dashboard

### 2. Connection Timeout
- **Cause**: MongoDB Atlas network access restrictions
- **Solution**: Add `0.0.0.0/0` to IP whitelist in MongoDB Atlas

### 3. Authentication Failed
- **Cause**: Incorrect database user permissions
- **Solution**: Ensure database user has `readWrite` role

### 4. Function Timeout
- **Cause**: Database operations taking too long
- **Solution**: Already configured with 30-second timeout in `vercel.json`

## Monitoring and Debugging

### Vercel Function Logs
1. Go to Vercel dashboard
2. Select your project
3. Click on "Functions" tab
4. View logs for each API route

### Test Database Connection
Use the `/api/test-db` endpoint to verify:
- Environment variables are loaded
- Database connection is working
- Collections are accessible

## Performance Optimizations

1. **Connection Pooling**: Implemented proper connection caching
2. **Timeout Configuration**: Set appropriate timeouts for serverless environment
3. **Error Handling**: Added detailed error messages for debugging
4. **MongoDB Driver**: Using latest stable version (^6.17.0)

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Database Access**: Use specific database user with minimal required permissions
3. **Network Security**: Consider restricting IP access if possible
4. **Connection String**: Keep MongoDB connection string secure

## Next Steps

1. Deploy to Vercel
2. Test all API endpoints
3. Monitor function logs for any issues
4. Set up monitoring/alerting for production use
