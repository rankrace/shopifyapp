import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { shopify, createOrUpdateShop } from "~/lib/shopify.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  
  if (!shop) {
    throw new Error("Shop parameter is required");
  }

  try {
    // Complete OAuth process
    const callback = await shopify.auth.callback({
      rawRequest: request,
    });

    // Store shop session
    await createOrUpdateShop(
      shop,
      callback.session.accessToken,
      callback.session.scope
    );

    // Redirect to app with shop parameter
    return redirect(`/?shop=${shop}`);
  } catch (error) {
    console.error("Auth callback error:", error);
    throw new Error("Failed to complete authentication");
  }
} 