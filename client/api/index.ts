// Vercel serverless entry: serves the Expo web app and its API routes (src/app/**/+api.ts).
// Generated per https://docs.expo.dev/router/web/api-routes/ (Vercel). Keep CommonJS style.
const { createRequestHandler } = require('expo-server/adapter/vercel');

module.exports = createRequestHandler({
  build: require('path').join(__dirname, '../dist/server'),
});
