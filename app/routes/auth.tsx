import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { shopify } from "~/lib/shopify.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  
  if (!shop) {
    throw new Error("Shop parameter is required");
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