import type { CapacitorConfig } from "@capacitor/cli";

/**
 * The WebView loads bundled files from https://localhost.
 * CapacitorHttp performs API calls natively so the app does not depend on
 * loosening the Railway CORS allow-list.
 */
const config: CapacitorConfig = {
  appId: "app.janavignanam.mobile",
  appName: "JanaVignanam",
  webDir: "www",
  android: {
    allowMixedContent: false,
    captureInput: true,
  },
  server: {
    androidScheme: "https",
    hostname: "localhost",
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
