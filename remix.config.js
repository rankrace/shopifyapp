/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "cjs",
  serverDependenciesToBundle: [
    /^@shopify\/shopify-app-remix.*/,
    /^@shopify\/polaris.*/,
    /^@shopify\/app-bridge.*/,
    /^@shopify\/app-bridge-react.*/,
    /^@shopify\/shopify-api.*/,
    /^isbot.*/,
  ],
  future: {
    v3_fetcherPersist: true,
    v3_relativeSplatPath: true,
    v3_singleFetch: true,
    v3_throwAbortReason: true,
  },
}; 