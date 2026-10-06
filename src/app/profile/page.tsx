import { redirect } from "next/navigation";
import { ACCOUNT_URL } from "@/content/contact";

/** Accounts live on Shopify (sign in, orders, addresses); old /profile links go there. */
export default function ProfilePage() {
  redirect(ACCOUNT_URL);
}
