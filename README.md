# AI-powered SEO Score and Optimizer for Shopify

A complete Shopify app that provides AI-powered SEO analysis and optimization for products, collections, and pages.

## 🚀 Features

- **OAuth Authentication** with Shopify
- **SEO Analysis** with scoring (0-100%)
- **AI-Powered Suggestions** using OpenAI GPT-4
- **One-click Optimization** via Shopify Admin API
- **Usage Tracking** with tiered pricing plans
- **Mobile-responsive** Polaris UI
- **Real-time Webhooks** for data updates

## 🛠 Tech Stack

- **Frontend**: React 18.3.1, Remix 2.17.0, Shopify Polaris 12.27.0
- **Backend**: Node.js, Remix loaders/actions
- **Database**: PostgreSQL with Prisma ORM 5.22.0
- **Authentication**: Shopify OAuth
- **AI**: OpenAI API 4.104.0
- **Deployment**: Vercel
- **Shopify APIs**: App Bridge 3.7.10, Shopify API 10.0.0

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (Supabase recommended)
- Shopify Partner account
- OpenAI API key
- Vercel account

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd SEOAI
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and fill in:

```env
# Shopify App
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_SCOPES=read_products,write_products,read_collections,write_collections,read_pages,write_pages
SHOPIFY_APP_URL=https://your-domain.vercel.app
SHOPIFY_APP_NAME="SEO AI Optimizer"

# Database
DATABASE_URL=your_supabase_postgres_url

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# App
NODE_ENV=production
SESSION_SECRET=your_session_secret

# Billing Plans (JSON)
SHOPIFY_BILLING_PLANS={"basic":{"name":"Basic","price":19,"usage_limit":50},"pro":{"name":"Pro","price":29,"usage_limit":100},"enterprise":{"name":"Enterprise","price":59,"usage_limit":250}}
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 4. Development

```bash
npm run dev
```

### 5. Deploy to Vercel

1. Connect your GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

## 🔧 Configuration

### Version Management

This project uses **exact versions** and **overrides** to prevent conflicts:

```json
{
  "overrides": {
    "@shopify/shopify-api": "10.0.0",
    "isbot": "5.1.29"
  }
}
```

### Remix Configuration

Key settings in `remix.config.js`:

```javascript
serverDependenciesToBundle: [
  /^@shopify\/shopify-app-remix.*/,
  /^@shopify\/polaris.*/,
  /^@shopify\/app-bridge.*/,
  /^@shopify\/app-bridge-react.*/,
  /^@shopify\/shopify-api.*/,
  /^isbot.*/,
]
```

## 🚨 Common Issues & Fixes

### 1. Shopify API Adapter Error
**Error**: `Missing adapter implementation for 'abstractRuntimeString'`
**Fix**: Use lazy initialization in `app/lib/shopify.server.ts`

### 2. isbot Import Error
**Error**: `isbot.default is not a function`
**Fix**: Use named import: `import { isbot } from "isbot"`

### 3. Prisma Client Error
**Error**: `@prisma/client did not initialize yet`
**Fix**: Add `prisma generate` to build script

### 4. Version Conflicts
**Error**: Multiple versions of same package
**Fix**: Use `overrides` and `resolutions` in package.json

## 🔄 Maintenance

### Regular Updates

1. **Monthly**: Check for security updates
   ```bash
   npm audit
   npm audit fix
   ```

2. **Quarterly**: Update dependencies
   ```bash
   npm update
   npm run typecheck
   npm run build
   ```

3. **Version Conflicts**: Check with
   ```bash
   npm ls @shopify/shopify-api
   npm ls isbot
   ```

### Database Migrations

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Deploy migration
npx prisma migrate deploy
```

### Environment Variables

Keep these updated in both local `.env` and Vercel:
- `SHOPIFY_API_KEY/SECRET`
- `DATABASE_URL`
- `OPENAI_API_KEY`
- `SESSION_SECRET`

## 📊 Monitoring

### Vercel Logs
Monitor deployment and runtime errors in Vercel dashboard.

### Database Health
Check Supabase dashboard for:
- Connection status
- Query performance
- Storage usage

### Shopify App Health
Monitor in Shopify Partner dashboard:
- App installations
- API usage
- Webhook delivery

## 🔒 Security

- **HMAC Validation**: All webhooks validated
- **OAuth Tokens**: Securely stored in database
- **API Keys**: Environment variables only
- **CORS**: Configured for Shopify domains

## 📈 Scaling

### Performance
- Lazy loading for Shopify API
- Database indexing on frequently queried fields
- Caching for SEO analysis results

### Cost Optimization
- OpenAI API usage tracking
- Database query optimization
- Vercel function optimization

## 🆘 Support

### Debug Mode
Enable detailed logging:
```env
NODE_ENV=development
DEBUG=shopify:*
```

### Common Commands
```bash
# Check versions
npm ls @shopify/shopify-api

# Regenerate Prisma
npx prisma generate

# Type check
npm run typecheck

# Lint
npm run lint
```

## 📝 Changelog

### v1.0.0
- Initial release
- OAuth authentication
- SEO analysis engine
- AI-powered suggestions
- Usage tracking
- Vercel deployment

---

**Built with ❤️ for Shopify merchants**
