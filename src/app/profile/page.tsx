import type { Metadata } from "next";
import { Profile } from "@/components/profile/Profile";
import { getCustomerSession } from "@/lib/commerce/customer";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your Mumma's Bite account.",
  alternates: { canonical: "/profile" },
  robots: { index: false, follow: true },
};

export default async function ProfilePage() {
  const session = await getCustomerSession();
  return <Profile session={session} />;
}
