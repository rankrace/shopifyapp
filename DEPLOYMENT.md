# Deployment Guide - SEO AI Optimizer

This guide will walk you through deploying the SEO AI Optimizer Shopify app to production.

## Prerequisites

1. **Shopify Partner Account**: Create an app in your Shopify Partner Dashboard
2. **Database**: PostgreSQL database (local or cloud)
3. **Domain**: A domain for your app (for OAuth callbacks)
4. **OpenAI API Key**: For AI-powered suggestions

## Step 1: Shopify App Setup

### 1.1 Create Shopify App

1. Go to [Shopify Partners Dashboard](https://partners.shopify.com)
2. Click "Apps" → "Create app"
3. Choose "Public app"
4. Fill in app details:
   - **App name**: SEO AI Optimizer
   - **App URL**: `https://your-domain.com`
   - **Allowed redirection URLs**: `https://your-domain.com/auth/callback`

### 1.2 Configure App Scopes

In your app settings, add these scopes:
```
read_products, write_products
read_collections, write_collections
read_pages, write_pages
read_blog_posts, write_blog_posts
```

### 1.3 Get API Credentials

Copy your:
- **API key**
- **API secret key**

## Step 2: Database Setup

### Option A: Local PostgreSQL

```bash
# Install PostgreSQL
brew install postgresql  # macOS
sudo apt-get install postgresql  # Ubuntu

# Create database
createdb seo_ai_db

# Create user (optional)
createuser seo_ai_user
```

### Option B: Cloud Database

**Render PostgreSQL:**
1. Create new PostgreSQL service
2. Copy connection string

**Railway PostgreSQL:**
1. Add PostgreSQL plugin
2. Copy connection string

**Supabase:**
1. Create new project
2. Copy connection string

## Step 3: Environment Configuration

Create `.env` file with your production values:

```env
# Shopify App Configuration
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
SHOPIFY_SCOPES=read_products,write_products,read_collections,write_collections,read_pages,write_pages,read_blog_posts,write_blog_posts
SHOPIFY_APP_URL=https://your-domain.com
SHOPIFY_APP_NAME="SEO AI Optimizer"

# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# App Configuration
NODE_ENV=production
SESSION_SECRET=your_secure_random_session_secret
```

## Step 4: Deploy to Render

### 4.1 Connect Repository

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository

### 4.2 Configure Service

- **Name**: seo-ai-optimizer
- **Environment**: Node
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 4.3 Add Environment Variables

Add all variables from your `.env` file to Render's environment variables section.

### 4.4 Add Database

1. Create new PostgreSQL service
2. Copy connection string to `DATABASE_URL`

## Step 5: Deploy to Railway

### 5.1 Connect Repository

1. Go to [Railway Dashboard](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository

### 5.2 Add PostgreSQL

1. Click "New" → "Database" → "PostgreSQL"
2. Railway will automatically set `DATABASE_URL`

### 5.3 Configure Environment Variables

Add all variables from your `.env` file in the Variables tab.

## Step 6: Database Migration

After deployment, run database migrations:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

Or use Railway/Render shell:

```bash
# In your deployment platform's shell
npx prisma generate
npx prisma db push
```

## Step 7: Webhook Setup (Optional)

For real-time updates, configure webhooks in your Shopify app:

1. Go to your app settings
2. Add webhook endpoints:
   - **Topic**: `products/update`, **Address**: `https://your-domain.com/webhooks`
   - **Topic**: `collections/update`, **Address**: `https://your-domain.com/webhooks`
   - **Topic**: `pages/update`, **Address**: `https://your-domain.com/webhooks`
   - **Topic**: `articles/update`, **Address**: `https://your-domain.com/webhooks`

## Step 8: Testing

### 8.1 Test OAuth Flow

1. Visit `https://your-domain.com/auth?shop=your-test-shop.myshopify.com`
2. Complete OAuth installation
3. Verify redirect to dashboard

### 8.2 Test SEO Analysis

1. Install app on a test store
2. Navigate to dashboard
3. Try analyzing products/collections
4. Test AI suggestions

### 8.3 Test Billing

1. Try upgrading to a paid plan
2. Verify Shopify billing integration
3. Test usage limits

## Step 9: App Store Submission

### 9.1 Prepare App Listing

1. **App name**: SEO AI Optimizer
2. **Description**: AI-powered SEO analysis and optimization for Shopify stores
3. **Category**: Marketing and SEO
4. **Pricing**: Free with paid plans ($19-$59/month)

### 9.2 Required Assets

- App icon (1024x1024)
- Screenshots (minimum 3)
- App description
- Privacy policy URL
- Support URL

### 9.3 Submit for Review

1. Complete app listing
2. Submit for Shopify review
3. Address any feedback
4. Launch when approved

## Troubleshooting

### Common Issues

**OAuth Errors:**
- Verify app URL and callback URLs
- Check API key/secret
- Ensure scopes are correct

**Database Connection:**
- Verify `DATABASE_URL` format
- Check database permissions
- Ensure database is accessible

**OpenAI API Errors:**
- Verify API key is valid
- Check API usage limits
- Ensure proper error handling

**Build Failures:**
- Check Node.js version (18+)
- Verify all dependencies installed
- Check build logs for errors

### Monitoring

**Logs:**
- Check application logs in your deployment platform
- Monitor error rates and performance

**Database:**
- Monitor connection pool usage
- Check query performance
- Set up alerts for disk space

**API Usage:**
- Monitor OpenAI API usage
- Track Shopify API rate limits
- Monitor billing usage

## Security Checklist

- [ ] Environment variables are secure
- [ ] Database connection uses SSL
- [ ] OAuth tokens are encrypted
- [ ] API keys are not exposed
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Input validation is implemented
- [ ] Error messages don't expose sensitive data

## Performance Optimization

- [ ] Database indexes are optimized
- [ ] API calls are cached where appropriate
- [ ] Images are optimized
- [ ] Bundle size is minimized
- [ ] CDN is configured
- [ ] Database connection pooling is enabled

## Support

For deployment issues:
- Check deployment platform documentation
- Review application logs
- Test locally first
- Contact platform support if needed

For app-specific issues:
- Review Shopify API documentation
- Check OpenAI API status
- Verify database connectivity 