# Ansu Create

Mobile-first React + TypeScript + Vite starter for the Ansu Create digital store.

## Current implementation
- Responsive storefront homepage and mobile bottom navigation
- Product categories, search and category filtering
- Product cards and local demo cart (saved in browser localStorage)
- Login modal placeholder
- Firebase initialization scaffold
- Checkout is intentionally disabled until a verified payment provider and secure backend are configured

## Run locally
1. Install Node.js on a computer or use a browser-based development environment.
2. Run `npm install`
3. Run `npm run dev`
4. Open the local URL shown by Vite.

## Firebase setup
1. Create a Firebase project at https://console.firebase.google.com/
2. Add a Web App.
3. Enable Email/Password in Authentication.
4. Create Firestore and Storage.
5. Copy `.env.example` to `.env` and fill in the Firebase web configuration.
6. Restart the dev server.

Never place Firebase Admin SDK credentials, service-account JSON, payment gateway secrets, or private keys in frontend environment variables.

## Important before real launch
This is Stage 1: storefront UI and demo cart. Authentication, real product database, protected downloads, admin permissions and payment verification are not yet connected. Do not accept real orders or payments until a trusted payment gateway/server-side verification flow and Firestore/Storage security rules are implemented and tested. A UPI screenshot is not proof of payment.

## Deployment
Push the project to GitHub and import the repository into Vercel. Set the build command to `npm run build` and output directory to `dist`. Add the Firebase public web config as Vercel environment variables.
