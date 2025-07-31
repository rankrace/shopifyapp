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
  ],
}; 