import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Lazy initialization of Shopify API to avoid runtime errors
let shopifyInstance: any = null;

function getShopify() {
  if (!shopifyInstance) {
    shopifyInstance = shopifyApi({
      apiKey: process.env.SHOPIFY_API_KEY!,
      apiSecretKey: process.env.SHOPIFY_API_SECRET!,
      scopes: process.env.SHOPIFY_SCOPES?.split(',') || [],
      hostName: process.env.SHOPIFY_APP_URL?.replace(/https:\/\//, '') || '',
      apiVersion: LATEST_API_VERSION,
      isEmbeddedApp: true,
    });
  }
  return shopifyInstance;
}

export const shopify = {
  get auth() {
    return getShopify().auth;
  },
  get rest() {
    return getShopify().rest;
  },
  get webhooks() {
    return getShopify().webhooks;
  },
};

// Get shop session
export async function getShopSession(shop: string) {
  const shopRecord = await prisma.shop.findUnique({
    where: { shopifyDomain: shop },
  });

  if (!shopRecord) {
    throw new Error('Shop not found');
  }

  return {
    shop,
    accessToken: shopRecord.accessToken,
    scope: shopRecord.scope,
  };
}

// Create or update shop
export async function createOrUpdateShop(shop: string, accessToken: string, scope: string) {
  return await prisma.shop.upsert({
    where: { shopifyDomain: shop },
    update: {
      accessToken,
      scope,
      updatedAt: new Date(),
    },
    create: {
      shopifyDomain: shop,
      accessToken,
      scope,
    },
  });
}

// Check usage limits
export async function checkUsageLimit(shopId: string): Promise<{ allowed: boolean; current: number; limit: number }> {
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
  });

  if (!shop) {
    throw new Error('Shop not found');
  }

  return {
    allowed: shop.usageCount < shop.usageLimit,
    current: shop.usageCount,
    limit: shop.usageLimit,
  };
}

// Increment usage count
export async function incrementUsage(shopId: string, action: string, itemType?: string, itemId?: string) {
  await prisma.$transaction([
    prisma.shop.update({
      where: { id: shopId },
      data: { usageCount: { increment: 1 } },
    }),
    prisma.usageLog.create({
      data: {
        shopId,
        action,
        itemType,
        itemId,
      },
    }),
  ]);
}