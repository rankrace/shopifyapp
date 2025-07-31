import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Button,
  Banner,
  Select,
  Text,
  ProgressBar,
} from "@shopify/polaris";
import { useState } from "react";
import { getShopSession, checkUsageLimit } from "~/lib/shopify.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  
  if (!shop) {
    return json({
      shop: null,
      usage: { allowed: true, current: 0, limit: 10 },
      error: "No shop parameter",
    });
  }

  try {
    const session = await getShopSession(shop);
    const usage = await checkUsageLimit(session.shop);
    
    return json({
      shop,
      usage,
    });
  } catch (error) {
    console.error("Loader error:", error);
    return json({
      shop,
      usage: { allowed: true, current: 0, limit: 10 },
      error: "Failed to load data",
    });
  }
}

export default function Analyze() {
  const data = useLoaderData<typeof loader>();
  const { shop, usage } = data;
  const error = 'error' in data ? data.error : null;
  const navigate = useNavigate();
  const [itemType, setItemType] = useState("product");

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
            <div style={{ padding: "16px" }}>
              <Text variant="headingMd" as="h3">
                Select Item Type to Analyze
              </Text>
              
              <div style={{ marginTop: "16px" }}>
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
              
              <div style={{ marginTop: "16px" }}>
                <Text variant="bodyMd" as="p">
                  This will analyze up to 50 {itemType}s from your store and provide SEO recommendations.
                </Text>
              </div>
              
              <div style={{ marginTop: "16px" }}>
                <Button
                  primary
                  disabled={!usage.allowed}
                >
                  Analyze {itemType}s
                </Button>
              </div>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
} 