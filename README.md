<<<<<<< HEAD
# SEO AI Optimizer - Shopify App

An AI-powered SEO analysis and optimization app for Shopify merchants. This app helps store owners improve their search engine rankings by analyzing products, collections, pages, and blog posts, then providing AI-generated suggestions for optimization.

## Features

### Core Functionality
- **OAuth Authentication** with Shopify
- **SEO Analysis** of products, collections, pages, and blog posts
- **AI-Powered Suggestions** using OpenAI GPT-4
- **One-Click Optimization** with Shopify Admin API integration
- **Usage Tracking** with tiered subscription plans
- **Mobile-Responsive** Polaris-based UI

### SEO Analysis Includes
- Meta title presence and length optimization
- Meta description presence and length optimization
- H1/H2 heading structure analysis
- Image alt text optimization
- Keyword density analysis
- Word count assessment
- Overall SEO score (0-100%)

### Subscription Plans
- **Free**: 10 analyses per month
- **Basic ($19/month)**: 50 analyses per month
- **Pro ($29/month)**: 100 analyses per month
- **Enterprise ($59/month)**: 250 analyses per month

## Tech Stack

- **Frontend**: React 18, Remix 2.5, Shopify Polaris 12
- **Backend**: Node.js, Remix loaders/actions
- **Database**: Prisma ORM with PostgreSQL
- **Authentication**: Shopify OAuth (Public App)
- **AI**: OpenAI GPT-4 API
- **Deployment**: Render/Railway ready

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Shopify Partner account
- OpenAI API key

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd seo-ai-optimizer
npm install
```

### 2. Environment Configuration

Copy the environment example file and configure your variables:

```bash
cp env.example .env
```

Fill in the required environment variables:

```env
# Shopify App Configuration
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
SHOPIFY_SCOPES=read_products,write_products,read_collections,write_collections,read_pages,write_pages,read_blog_posts,write_blog_posts
SHOPIFY_APP_URL=https://your-app-domain.com
SHOPIFY_APP_NAME="SEO AI Optimizer"

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/seo_ai_db"

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# App Configuration
NODE_ENV=development
SESSION_SECRET=your_session_secret_key
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Run migrations
npm run db:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Shopify App Setup

### 1. Create Shopify App

1. Go to your [Shopify Partner Dashboard](https://partners.shopify.com)
2. Create a new app
3. Set app type to "Public app"
4. Configure the following URLs:
   - **App URL**: `https://your-domain.com`
   - **Allowed redirection URLs**: `https://your-domain.com/auth/callback`

### 2. Configure App Scopes

Ensure your app has the following scopes:
- `read_products`, `write_products`
- `read_collections`, `write_collections`
- `read_pages`, `write_pages`
- `read_blog_posts`, `write_blog_posts`

### 3. Set Up Webhooks (Optional)

For real-time updates, configure webhooks for:
- `products/update`
- `collections/update`
- `pages/update`
- `articles/update`

## Deployment

### Render Deployment

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure environment variables** from your `.env` file
4. **Set build command**: `npm install && npm run build`
5. **Set start command**: `npm start`
6. **Add PostgreSQL database** and update `DATABASE_URL`

### Railway Deployment

1. **Connect your GitHub repository** to Railway
2. **Add PostgreSQL plugin**
3. **Configure environment variables**
4. **Deploy automatically**

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL=your_production_database_url
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
OPENAI_API_KEY=your_openai_api_key
SESSION_SECRET=your_secure_session_secret
```

## Usage

### For Merchants

1. **Install the app** from the Shopify App Store
2. **Grant permissions** during installation
3. **Navigate to the dashboard** to see your store's SEO overview
4. **Analyze items** by selecting product, collection, page, or blog post types
5. **Review SEO scores** and recommendations
6. **Generate AI suggestions** for optimization
7. **Apply optimizations** with one-click updates

### For Developers

The app is structured for easy extension:

- **Add new SEO factors** in `app/lib/seo-analyzer.server.ts`
- **Create new routes** in `app/routes/`
- **Extend database schema** in `prisma/schema.prisma`
- **Add new Shopify API integrations** in `app/lib/shopify.server.ts`

## API Endpoints

### Authentication
- `GET /auth` - Initiate OAuth flow
- `GET /auth/callback` - OAuth callback handler

### Main App
- `GET /` - Dashboard with SEO overview
- `GET /analyze` - Item analysis page
- `GET /analyze/:id` - Detailed analysis view
- `GET /billing` - Subscription management

## Database Schema

### Core Tables
- `shops` - Store shop information and usage limits
- `seo_analyses` - SEO analysis results and AI suggestions
- `usage_logs` - Track usage for billing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact:
- Email: support@seoaioptimizer.com
- Documentation: [docs.seoaioptimizer.com](https://docs.seoaioptimizer.com)

## Changelog

### v1.0.0 (2025-01-XX)
- Initial release
- SEO analysis for products, collections, pages, and blog posts
- AI-powered optimization suggestions
- Subscription-based usage tracking
- Shopify OAuth integration
- Polaris-based responsive UI 
=======
# shopifyapp
>>>>>>> 59aa517569c38bd5d960dd4dc593a98d6f40f6bd
