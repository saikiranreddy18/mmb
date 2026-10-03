import type { CustomerSession } from "./types";

/**
 * Customer account boundary.
 *
 * Shopify's Customer Account API uses OAuth (PKCE) and a hosted login. When
 * customer accounts are enabled, implement this to:
 *   1. read the session cookie set by the OAuth callback route,
 *   2. query the Customer Account API for customer, addresses and orders,
 *   3. return { status: "signed-in", customer, logoutUrl } or "signed-out".
 *
 * Until then it reports "not-connected" — the profile never renders a
 * fabricated customer, address or order.
 */
export async function getCustomerSession(): Promise<CustomerSession> {
  return { status: "not-connected" };
}
