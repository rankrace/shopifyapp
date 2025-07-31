import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  DataTable,
  Badge,
  Button,
  Banner,
  Select,
  Text,
  ProgressBar,
  EmptyState,
} from "@shopify/polaris";
import { useState } from "react";
import { getShopSession, checkUsageLimit } from "~/lib/shopify.server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  
  if (!shop) {
    return json({
      shop: null,
      usage: { allowed: true, current: 0, limit: 10 },
      seoAnalyses: [],
      error: null,
    });
  }

  try {
    const session = await getShopSession(shop);
    const usage = await checkUsageLimit(session.shop);
    
    // Fetch existing SEO analyses
    const seoAnalyses = await prisma.seoAnalysis.findMany({
      where: { shopId: session.shop },
      orderBy: { lastAnalyzed: 'desc' },
    });

    return json({
      shop,
      usage,
      seoAnalyses,
    });
  } catch (error) {
    console.error("Loader error:", error);
    return json({
      shop,
      usage: { allowed: true, current: 0, limit: 10 },
      seoAnalyses: [],
      error: "Shop not found. Please reinstall the app.",
    });
  }
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const { shop, usage, seoAnalyses } = data;
  const error = 'error' in data ? data.error : null;
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // If no shop parameter, show installation page
  if (!shop) {
    return (
      <Page title="SEO AI Optimizer">
        <Layout>
          <Layout.Section>
            <Card>
              <EmptyState
                heading="Welcome to SEO AI Optimizer"
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
                <p>
                  Boost your Shopify store's search engine rankings with AI-powered SEO analysis and optimization.
                </p>
                <div style={{ marginTop: "20px" }}>
                  <Text variant="headingMd" as="h3">Features:</Text>
                  <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
                    <li>Analyze products, collections, pages, and blog posts</li>
                    <li>Get AI-powered SEO suggestions</li>
                    <li>One-click optimization with Shopify Admin API</li>
                    <li>Usage tracking with tiered pricing plans</li>
                  </ul>
                </div>
                <div style={{ marginTop: "20px" }}>
                  <Button 
                    primary 
                    url="/auth"
                  >
                    Install App
                  </Button>
                </div>
              </EmptyState>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  // Filter data based on selected filters
  const filteredData = seoAnalyses.filter((item: any) => {
    const matchesStatus = filter === "all" || 
      (filter === "needs_work" && item.status === "needs_work") ||
      (filter === "optimized" && item.status === "optimized");
    
    const matchesType = typeFilter === "all" || item.itemType === typeFilter;
    
    return matchesStatus && matchesType;
  });

  // Prepare data for DataTable
  const rows = filteredData.map((item: any) => [
    item.itemTitle,
    `${item.seoScore}%`,
    <Badge tone={item.status === "optimized" ? "success" : "warning"}>
      {item.status === "optimized" ? "Optimized" : "Needs Work"}
    </Badge>,
    item.itemType.charAt(0).toUpperCase() + item.itemType.slice(1),
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button size="micro" onClick={() => navigate(`/analyze/${item.id}?shop=${shop}`)}>
        View
      </Button>
      <Button size="micro" onClick={() => navigate(`/suggest/${item.id}?shop=${shop}`)}>
        Suggest
      </Button>
      <Button size="micro" onClick={() => navigate(`/apply/${item.id}?shop=${shop}`)}>
        Apply AI Fix
      </Button>
    </div>,
  ]);

  const averageScore = seoAnalyses.length > 0 
    ? Math.round(seoAnalyses.reduce((sum: number, item: any) => sum + item.seoScore, 0) / seoAnalyses.length)
    : 0;

  return (
    <Page
      title="SEO AI Optimizer"
      subtitle={shop ? `Analyzing ${shop}` : "Welcome to SEO AI Optimizer"}
      primaryAction={{
        content: "Analyze New Items",
        onAction: () => navigate(`/analyze?shop=${shop}`),
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
              <div>
                <Text variant="headingMd" as="h3">Overall SEO Score</Text>
                <Text variant="headingLg" as="p">{averageScore}%</Text>
              </div>
              <div>
                <Text variant="headingMd" as="h3">Usage</Text>
                <Text variant="bodyMd" as="p">{usage.current} / {usage.limit}</Text>
                <ProgressBar progress={(usage.current / usage.limit) * 100} size="small" />
              </div>
              <div>
                <Text variant="headingMd" as="h3">Items Analyzed</Text>
                <Text variant="headingLg" as="p">{seoAnalyses.length}</Text>
              </div>
            </div>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
              <Select
                label="Status Filter"
                options={[
                  { label: "All Items", value: "all" },
                  { label: "Needs Work", value: "needs_work" },
                  { label: "Optimized", value: "optimized" },
                ]}
                value={filter}
                onChange={setFilter}
              />
              <Select
                label="Type Filter"
                options={[
                  { label: "All Types", value: "all" },
                  { label: "Products", value: "product" },
                  { label: "Collections", value: "collection" },
                  { label: "Pages", value: "page" },
                  { label: "Blog Posts", value: "blog" },
                ]}
                value={typeFilter}
                onChange={setTypeFilter}
              />
            </div>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <DataTable
              columnContentTypes={["text", "text", "text", "text", "text"]}
              headings={["Title", "SEO Score", "Status", "Type", "Actions"]}
              rows={rows}
            />
            {rows.length === 0 && (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <Text variant="bodyMd" as="p">
                  No items analyzed yet. Start by analyzing your products, collections, or pages.
                </Text>
                <Button onClick={() => navigate(`/analyze?shop=${shop}`)}>
                  Start Analysis
                </Button>
              </div>
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
} 