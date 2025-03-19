Got it! I’ll create a comprehensive `README.md` file for your project, including all the points you’ve mentioned. I’ll ensure nothing is left out and the documentation is clear and easy to follow. Here's the final `README.md`:

---

# **Supabase + Clerk Integration with Expo**

This project demonstrates how to integrate **Supabase** and **Clerk** in an **Expo** application. It includes authentication, webhook handling, and secure storage for a production-ready setup.

---

## **Table of Contents**

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configure Clerk](#configure-clerk)
4. [Supabase Setup](#supabase-setup)
5. [Webhook Configuration](#webhook-configuration)
6. [Theming](#theming)
7. [Expo Notifications](#expo-notifications)
8. [Running the Project](#running-the-project)
9. [Troubleshooting](#troubleshooting)

---

## **Prerequisites**

Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Docker](https://www.docker.com/) (for local Supabase development)
- A **Clerk** account ([sign up here](https://clerk.dev/))
- A **Supabase** account ([sign up here](https://supabase.com/))

---

## **Installation**

1. **Install Dependencies**  
   Run the following commands to install the required packages:

   ```bash
   npm install @clerk/clerk-expo
   npm install @clerk/types
   npm install expo-secure-store
   npm install expo-image
   npm install expo-image-picker expo-document-picker expo-image-manipulator
   npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
   ```

2. **Initialize Supabase**  
   Set up Supabase for local development:

   ```bash
   npx supabase login
   npx supabase init
   npx supabase link --project-ref <your-project-ref>
   ```

   Replace `<your-project-ref>` with your Supabase project reference (found in the Supabase dashboard under **Project Settings**).

---

## **Configure Clerk**

1. **Set Up Clerk in Your Expo App**

   - Go to the [Clerk Dashboard](https://dashboard.clerk.dev/) and create a new application.
   - Copy the **Publishable Key** and add it to your `.env` file:

     ```env
     EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
     ```

2. **Configure Clerk Provider**  
   Wrap your app with the `ClerkProvider` in your `App.tsx`:

   ```typescript
   import { ClerkProvider } from "@clerk/clerk-expo";

   const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

   export default function App() {
     return (
       <ClerkProvider publishableKey={clerkPublishableKey}>
         {/* Your app components */}
       </ClerkProvider>
     );
   }
   ```

3. **Username Configuration**  
   If you configure a username during sign-up, **Google Sign-In** may not work. Ensure you handle this case in your authentication flow.

---

## **Supabase Setup**

1. **Create a New Edge Function**  
   Create a new Supabase Edge Function for handling Clerk webhooks:

   ```bash
   npx supabase functions new clerk
   ```

2. **Copy and Paste the Code**  
   Replace the generated code in `supabase/functions/clerk/index.ts` with your webhook handling logic.

3. **Disable JWT Verification**  
   Update the `supabase/config.toml` file to disable JWT verification for the `clerk` function:

   ```toml
   [functions.clerk]
   verify_jwt = false
   ```

4. **Deploy the Function**  
   Deploy the function to Supabase:

   ```bash
   npx supabase functions deploy clerk
   ```

---

## **Webhook Configuration**

1. **Set Up Clerk Webhook**

   - Go to the **Clerk Dashboard** and create a new webhook.
   - Set the webhook URL to your Supabase Edge Function URL:
     ```
     https://<your-project-ref>.supabase.co/functions/v1/clerk
     ```
   - Add the **Webhook Secret** to your `.env` file:

     ```env
     CLERK_WEBHOOK_SECRET=your_webhook_secret
     ```

2. **Verify Webhook Signature**  
   Use the `svix` library to verify the webhook signature in your Edge Function.

---

## **Running the Project**

1. **Start the Development Server**  
   Run the Expo development server:

   ```bash
   npx expo start
   ```

2. **Test the Webhook Locally**  
   Use a tool like [ngrok](https://ngrok.com/) to expose your local server and test the webhook.

3. **Deploy to Production**  
   Deploy your Expo app to the App Store or Google Play Store.

---

## **Troubleshooting**

1. **Docker Issues**  
   Ensure Docker is running before starting the Supabase local development environment.

2. **Webhook Errors**

   - Check the **Clerk Dashboard** for webhook logs.
   - Verify the webhook URL and secret.

3. **TypeScript Errors**
   - Ensure `deno.json` and `tsconfig.json` are properly configured.
   - Use the `deno types > deno.d.ts` command to generate Deno type definitions.

---

## **Contributing**

Feel free to contribute to this project by opening issues or submitting pull requests.

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
