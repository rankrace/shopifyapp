# 🚀 Deployment Checklist

## Pre-Deployment Checklist

### ✅ Environment Variables
- [ ] `SHOPIFY_API_KEY` - Your Shopify app API key
- [ ] `SHOPIFY_API_SECRET` - Your Shopify app API secret
- [ ] `SHOPIFY_SCOPES` - Required scopes: `read_products,write_products,read_collections,write_collections,read_pages,write_pages`
- [ ] `SHOPIFY_APP_URL` - Your Vercel domain (e.g., `https://shopify.rankrace.com`)
- [ ] `SHOPIFY_APP_NAME` - App name: "SEO AI Optimizer"
- [ ] `DATABASE_URL` - Supabase PostgreSQL connection string
- [ ] `OPENAI_API_KEY` - Your OpenAI API key
- [ ] `NODE_ENV` - Set to `production`
- [ ] `SESSION_SECRET` - Random 32+ character string
- [ ] `SHOPIFY_BILLING_PLANS` - JSON string with pricing plans

### ✅ Database Setup
- [ ] Supabase project created
- [ ] PostgreSQL database connected
- [ ] Prisma schema pushed: `npx prisma db push`
- [ ] Prisma client generated: `npx prisma generate`

### ✅ Shopify Partner Setup
- [ ] App created in Shopify Partner dashboard
- [ ] App URL configured: `https://your-domain.vercel.app`
- [ ] Allowed redirection URLs: `https://your-domain.vercel.app/auth/callback`
- [ ] Required scopes enabled
- [ ] App type: Public app

### ✅ Vercel Setup
- [ ] GitHub repository connected
- [ ] Environment variables configured
- [ ] Build command: `npm run build`
- [ ] Output directory: `build`
- [ ] Node.js version: 18.x

## Post-Deployment Checklist

### ✅ Deployment Verification
- [ ] Build succeeds without errors
- [ ] App loads at `https://your-domain.vercel.app`
- [ ] No 500 errors in Vercel logs
- [ ] Database connection working
- [ ] Prisma client generated successfully

### ✅ OAuth Flow Test
- [ ] Visit app URL
- [ ] Click "Install App" or similar
- [ ] Redirected to Shopify for authorization
- [ ] Successfully redirected back to app
- [ ] Shop data stored in database

### ✅ Core Functionality Test
- [ ] Dashboard loads with shop data
- [ ] SEO analysis can be initiated
- [ ] AI suggestions generated
- [ ] Usage tracking working
- [ ] Billing page accessible

### ✅ Error Monitoring
- [ ] Check Vercel function logs
- [ ] Monitor database connection
- [ ] Verify Shopify API calls
- [ ] Test OpenAI API integration

## 🔧 Common Fixes

### If Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma
npx prisma generate

# Check for version conflicts
npm ls @shopify/shopify-api
npm ls isbot
```

### If App Shows 500 Error
1. Check Vercel function logs
2. Verify environment variables
3. Test database connection
4. Check Shopify API configuration

### If OAuth Fails
1. Verify app URL in Shopify Partner dashboard
2. Check redirect URLs
3. Ensure scopes are correct
4. Verify API key/secret

## 📊 Monitoring Setup

### Vercel Monitoring
- [ ] Function execution time
- [ ] Error rates
- [ ] Cold start performance
- [ ] Memory usage

### Database Monitoring
- [ ] Connection pool status
- [ ] Query performance
- [ ] Storage usage
- [ ] Backup status

### Shopify App Monitoring
- [ ] Installation success rate
- [ ] API usage limits
- [ ] Webhook delivery
- [ ] App store metrics

## 🔄 Maintenance Schedule

### Daily
- [ ] Check Vercel deployment status
- [ ] Monitor error logs
- [ ] Verify database connectivity

### Weekly
- [ ] Review usage analytics
- [ ] Check Shopify API limits
- [ ] Monitor OpenAI API usage

### Monthly
- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance review
- [ ] Backup verification

## 🆘 Emergency Contacts

- **Vercel Support**: https://vercel.com/support
- **Supabase Support**: https://supabase.com/support
- **Shopify Partner Support**: https://partners.shopify.com/support
- **OpenAI Support**: https://help.openai.com

## 📝 Deployment Notes

**Last Deployment**: [Date]
**Deployed By**: [Name]
**Version**: v1.0.0
**Environment**: Production

**Issues Resolved**:
- [ ] Shopify API adapter error
- [ ] isbot import error
- [ ] Prisma client generation
- [ ] Version conflicts

**Next Steps**:
- [ ] Monitor for 24 hours
- [ ] Test all user flows
- [ ] Set up alerts
- [ ] Document any issues 