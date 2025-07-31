import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate, Form } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Button,
  Banner,
  Select,
  Text,
  ProgressBar,
  EmptyState,
  List,
  Thumbnail,
} from "@shopify/polaris";
import { useState } from "react";
import { getShopSession, checkUsageLimit, shopify } from "~/lib/shopify.server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  
  if (!shop) {
    return json({
      shop: null,
      usage: { allowed: true, current: 0, limit: 10 },
      items: [],
      error: "No shop parameter. Please install the app from Shopify.",
    });
  }

  try {
    const session = await getShopSession(shop);
    const usage = await checkUsageLimit(session.shop);
    
    return json({
      shop,
      usage,
      items: [],
    });
  } catch (error) {
    console.error("Loader error:", error);
    return json({
      shop,
      usage: { allowed: true, current: 0, limit: 10 },
      items: [],
      error: "Failed to load data. Please reinstall the app.",
    });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const itemType = formData.get("itemType") as string;
  const shop = formData.get("shop") as string;
  
  if (!shop || !itemType) {
    return json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    const session = await getShopSession(shop);
    const usage = await checkUsageLimit(session.shop);
    
    if (!usage.allowed) {
      return json({ error: "Usage limit reached" }, { status: 403 });
    }

    // Fetch items from Shopify based on type
    let items = [];
    const client = new shopify.rest.Admin({
      session: {
        accessToken: session.accessToken,
        shop: shop,
      },
    });

    switch (itemType) {
      case "product":
        const productsResponse = await client.get({
          path: "products",
          query: { limit: 50 },
        });
        items = productsResponse.body.products || [];
        break;
      case "collection":
        const collectionsResponse = await client.get({
          path: "collections",
          query: { limit: 50 },
        });
        items = collectionsResponse.body.collections || [];
        break;
      case "page":
        const pagesResponse = await client.get({
          path: "pages",
          query: { limit: 50 },
        });
        items = pagesResponse.body.pages || [];
        break;
      case "blog":
        const blogsResponse = await client.get({
          path: "blogs",
          query: { limit: 50 },
        });
        items = blogsResponse.body.blogs || [];
        break;
    }

    return json({ items, itemType });
  } catch (error) {
    console.error("Action error:", error);
    return json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export default function Analyze() {
  const data = useLoaderData<typeof loader>();
  const { shop, usage, items } = data;
  const error = 'error' in data ? data.error : null;
  const navigate = useNavigate();
  const [itemType, setItemType] = useState("product");

  if (!shop) {
    return (
      <Page title="Install App">
        <Layout>
          <Layout.Section>
            <Card>
              <EmptyState
                heading="Install the SEO AI Optimizer app"
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
                <p>This app needs to be installed from your Shopify admin to work properly.</p>
                <Button primary url="/auth">
                  Install App
                </Button>
              </EmptyState>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page
      title="Analyze Items"
      subtitle="Select items to analyze for SEO optimization"
      backAction={{
        content: "Dashboard",
        onAction: () => navigate("/"),
      }}
    >
      <Layout>
        {error && (
          <Layout.Section>
            <Banner tone="critical" title="Error">
              {error}
            </Banner>
          </Layout.Section>
        )}

        {!usage.allowed && (
          <Layout.Section>
            <Banner tone="warning" title="Usage Limit Reached">
              You've reached your monthly limit of {usage.limit} analyses. 
              <Button url="/billing" size="micro">Upgrade Plan</Button>
            </Banner>
          </Layout.Section>
        )}

        <Layout.Section>
          <Card>
            <div style={{ padding: "20px" }}>
              <Text variant="headingMd" as="h3">
                Select Item Type to Analyze
              </Text>
              
              <div style={{ marginTop: "20px" }}>
                <Select
                  label="Item Type"
                  options={[
                    { label: "Products", value: "product" },
                    { label: "Collections", value: "collection" },
                    { label: "Pages", value: "page" },
                    { label: "Blog Posts", value: "blog" },
                  ]}
                  value={itemType}
                  onChange={setItemType}
                />
              </div>
              
              <div style={{ marginTop: "20px" }}>
                <Text variant="bodyMd" as="p">
                  This will analyze up to 50 {itemType}s from your store and provide SEO recommendations.
                </Text>
              </div>
              
              <div style={{ marginTop: "20px" }}>
                <Form method="post">
                  <input type="hidden" name="itemType" value={itemType} />
                  <input type="hidden" name="shop" value={shop} />
                  <Button
                    primary
                    submit
                    disabled={!usage.allowed}
                  >
                    Analyze {itemType}s
                  </Button>
                </Form>
              </div>
            </div>
          </Card>
        </Layout.Section>

        {items.length > 0 && (
          <Layout.Section>
            <Card>
              <div style={{ padding: "20px" }}>
                <Text variant="headingMd" as="h3">
                  Found {items.length} {itemType}s
                </Text>
                <div style={{ marginTop: "16px" }}>
                  <List type="bullet">
                    {items.slice(0, 10).map((item: any, index: number) => (
                      <List.Item key={index}>
                        {item.title || item.name || `Item ${index + 1}`}
                      </List.Item>
                    ))}
                    {items.length > 10 && (
                      <List.Item>... and {items.length - 10} more</List.Item>
                    )}
                  </List>
                </div>
              </div>
            </Card>
          </Layout.Section>
        )}
      </Layout>
    </Page>
  );
} 