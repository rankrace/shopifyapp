import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useSearchParams } from "@remix-run/react";
import { Page, Layout, Card, TextField, Button, Banner, Text } from "@shopify/polaris";
import { useState } from "react";
import { shopify } from "~/lib/shopify.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  
  if (!shop) {
    // Return null to show the form
    return null;
  }

  try {
    console.log("Starting OAuth for shop:", shop);
    console.log("Shopify API Key:", process.env.SHOPIFY_API_KEY ? "Set" : "Missing");
    console.log("Shopify API Secret:", process.env.SHOPIFY_API_SECRET ? "Set" : "Missing");
    console.log("Shopify App URL:", process.env.SHOPIFY_APP_URL);
    
    // Begin OAuth process
    const authRoute = await shopify.auth.begin({
      shop,
      callbackPath: "/auth/callback",
      isOnline: false,
    });

    console.log("Auth route generated:", authRoute.url);
    return redirect(authRoute.url);
  } catch (error) {
    console.error("Auth error details:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    // Return more specific error information
    const errorMessage = error.message || "Unknown authentication error";
    return redirect(`/auth?error=${encodeURIComponent(errorMessage)}`);
  }
}

export default function Auth() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");
  const [shopDomain, setShopDomain] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    if (!shopDomain.includes("myshopify.com")) {
      event.preventDefault();
      alert("Please enter a valid Shopify store domain (e.g., your-store.myshopify.com)");
    }
  };

  return (
    <Page title="Install SEO AI Optimizer">
      <Layout>
        <Layout.Section>
          <Card>
            <div style={{ padding: "20px" }}>
              <Text variant="headingLg" as="h2">
                Install SEO AI Optimizer
              </Text>
              <div style={{ marginTop: "16px", marginBottom: "20px" }}>
                <Text variant="bodyMd" as="p">
                  Enter your Shopify store domain to install the app.
                </Text>
              </div>
              
              {error && (
                <div style={{ marginBottom: "20px" }}>
                  <Banner tone="critical" title="Authentication Error">
                    <p><strong>Error:</strong> {error}</p>
                    <p style={{ marginTop: "8px" }}>
                      Please check:
                    </p>
                    <ul style={{ marginTop: "4px", paddingLeft: "20px" }}>
                      <li>Your Shopify Partner Dashboard app configuration</li>
                      <li>Environment variables in Vercel dashboard</li>
                      <li>App URL and redirection URLs are correct</li>
                    </ul>
                  </Banner>
                </div>
              )}
              
              <Form method="get" onSubmit={handleSubmit}>
                <div style={{ marginBottom: "20px" }}>
                  <TextField
                    label="Shop Domain"
                    value={shopDomain}
                    onChange={setShopDomain}
                    placeholder="your-store.myshopify.com"
                    name="shop"
                    required
                    helpText="Enter your complete Shopify store domain"
                  />
                </div>
                <Button primary submit>
                  Install App
                </Button>
              </Form>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
} 