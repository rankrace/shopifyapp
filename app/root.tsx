import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    // Initialize Shopify App Bridge
    if (typeof window !== "undefined") {
      import("@shopify/app-bridge").then(({ createApp }) => {
        const app = createApp({
          apiKey: process.env.SHOPIFY_API_KEY || "",
          host: new URLSearchParams(window.location.search).get("host") || "",
          forceRedirect: true,
        });
      });
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AppProvider i18n={{}}>
          <Outlet />
        </AppProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
} 