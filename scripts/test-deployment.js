#!/usr/bin/env node

/**
 * Test script to verify deployment readiness
 * This script checks if all API routes are properly configured for serverless deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking deployment readiness...\n');

// Check environment variables
const envFile = path.join(__dirname, '../.env.local');
if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf8');
  const hasMongoUri = envContent.includes('MONGODB_URI=');
  const hasMongoDb = envContent.includes('MONGODB_DB=');
  
  console.log('✅ Environment variables:');
  console.log(`   MONGODB_URI: ${hasMongoUri ? '✓' : '✗'}`);
  console.log(`   MONGODB_DB: ${hasMongoDb ? '✓' : '✗'}`);
} else {
  console.log('⚠️  .env.local file not found');
}

// Check API routes for proper connection handling
const apiDir = path.join(__dirname, '../src/app/api');
const routeFiles = [];

function findRouteFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findRouteFiles(filePath);
    } else if (file === 'route.ts') {
      routeFiles.push(filePath);
    }
  }
}

findRouteFiles(apiDir);

console.log('\n🔧 API Routes Analysis:');
let issuesFound = 0;

for (const routeFile of routeFiles) {
  const content = fs.readFileSync(routeFile, 'utf8');
  const relativePath = path.relative(path.join(__dirname, '..'), routeFile);
  
  // Check for problematic patterns
  const hasDirectMongoClient = content.includes('new MongoClient(') && !content.includes('getDatabase()');
  const hasClientClose = content.includes('client.close()');
  const hasProperImport = content.includes("from '@/lib/mongodb'") || content.includes("from '@/lib/db-utils'");
  
  if (hasDirectMongoClient || hasClientClose) {
    console.log(`   ⚠️  ${relativePath}: Uses direct MongoDB client (potential connection issues)`);
    issuesFound++;
  } else if (hasProperImport) {
    console.log(`   ✅ ${relativePath}: Properly configured`);
  } else {
    console.log(`   ❓ ${relativePath}: Check manually`);
  }
}

// Check package.json for MongoDB version
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
const mongoVersion = packageJson.dependencies?.mongodb;
console.log(`\n📦 MongoDB Driver Version: ${mongoVersion || 'Not found'}`);

// Check vercel.json configuration
const vercelConfigPath = path.join(__dirname, '../vercel.json');
if (fs.existsSync(vercelConfigPath)) {
  const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
  console.log('\n⚙️  Vercel Configuration:');
  console.log(`   Functions timeout: ${vercelConfig.functions ? '✓ Configured' : '✗ Not configured'}`);
  console.log(`   Environment variables: ${vercelConfig.env ? '✓ Configured' : '✗ Not configured'}`);
} else {
  console.log('\n⚠️  vercel.json not found');
}

console.log('\n📋 Summary:');
if (issuesFound === 0) {
  console.log('✅ All API routes appear to be properly configured for serverless deployment!');
  console.log('\n🚀 Deployment checklist:');
  console.log('   1. Ensure MONGODB_URI and MONGODB_DB are set in Vercel environment variables');
  console.log('   2. MongoDB Atlas IP whitelist includes 0.0.0.0/0 (allow all)');
  console.log('   3. Database user has proper read/write permissions');
  console.log('   4. Test the deployment with a small subset of data first');
} else {
  console.log(`⚠️  Found ${issuesFound} potential issues that should be reviewed`);
}

console.log('\n🔗 Useful links:');
console.log('   - Vercel Serverless Functions: https://vercel.com/docs/functions/serverless-functions');
console.log('   - MongoDB Atlas Network Access: https://docs.atlas.mongodb.com/security/ip-access-list/');
console.log('   - Next.js API Routes: https://nextjs.org/docs/api-routes/introduction');
