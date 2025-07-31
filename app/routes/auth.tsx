import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useSearchParams } from "@remix-run/react";
import { Page, Layout, Card, TextField, Button, Banner } from "@shopify/polaris";
import { shopify } from "~/lib/shopify.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  
  if (!shop) {
    // Return null to show the form
    return null;
  }

  try {
    // Begin OAuth process
    const authRoute = await shopify.auth.begin({
      shop,
      callbackPath: "/auth/callback",
      isOnline: false,
    });

    return redirect(authRoute.url);
  } catch (error) {
    console.error("Auth error:", error);
    throw new Error("Failed to start authentication");
  }
}

export default function Auth() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");

  return (
    <Page title="Install SEO AI Optimizer">
      <Layout>
        <Layout.Section>
          <Card>
            <div style={{ padding: "20px" }}>
              <h2>Install SEO AI Optimizer</h2>
              <p style={{ marginBottom: "20px" }}>
                Enter your Shopify store domain to install the app.
              </p>
              
              {error && (
                <Banner tone="critical" title="Error">
                  {error}
                </Banner>
              )}
              
              <Form method="get">
                <div style={{ marginBottom: "20px" }}>
                  <TextField
                    label="Shop Domain"
                    value=""
                    placeholder="your-store.myshopify.com"
                    name="shop"
                    required
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