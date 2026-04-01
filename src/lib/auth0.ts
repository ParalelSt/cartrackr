import { Auth0Client } from "@auth0/nextjs-auth0/server";

/**
 * Whether Auth0 is fully configured.
 * When false, the app runs without authentication.
 */
export const isAuth0Configured =
  !!process.env.AUTH0_DOMAIN &&
  !!process.env.AUTH0_CLIENT_ID &&
  !!process.env.AUTH0_CLIENT_SECRET &&
  !!process.env.AUTH0_SECRET;

export const auth0 = isAuth0Configured ? new Auth0Client({
  signInReturnToPath: "/",
}) : null;
