/**
 * Store policies. Shopify is the source of truth: when a policy is filled in
 * Shopify Admin (Settings → Policies) the site shows that version. These are
 * the site's own copies, used until then. Keep both in step.
 */

import { ADDRESS, SUPPORT_EMAIL, whatsappLink } from "./contact";

const ADDRESS_HTML = ADDRESS.lines.join("<br>");
const CONTACT = `<h3>Contact</h3><p>Email: <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a><br>WhatsApp: <a href="${whatsappLink()}" target="_blank" rel="noopener noreferrer">chat with us</a></p>`;

export type PolicySlug = "refund-policy" | "shipping-policy" | "terms-of-service" | "privacy-policy" | "contact-information";

export type Policy = { slug: PolicySlug; title: string; description: string; body: string };

export const POLICIES: Record<PolicySlug, Policy> = {
  "shipping-policy": {
    slug: "shipping-policy",
    title: "Shipping policy",
    description: "Where Mumma's Bite delivers, delivery charges, dispatch times and tracking.",
    body: `<h3>Where we deliver</h3><p>We currently deliver to addresses across India. We do not ship internationally at this time.</p>
<h3>Delivery charges</h3><ul><li>Standard delivery: ₹79 per order.</li><li>Free delivery on orders of ₹1,299 and above.</li></ul><p>The delivery charge for your address is shown in your cart once you enter your PIN code, and confirmed at checkout before you pay.</p>
<h3>Dispatch and delivery time</h3><p>Orders are packed fresh and usually dispatched within <strong>1–2 business days</strong> (Monday to Saturday, excluding public holidays) from Visakhapatnam, Andhra Pradesh. Delivery typically takes 3–7 business days after dispatch depending on your location; remote areas may take longer. An estimated delivery date is shown at checkout.</p>
<h3>Tracking</h3><p>Once your order is dispatched, you will receive an email with the courier name and tracking number so you can follow your parcel.</p>
<h3>Delays</h3><p>Courier delays caused by weather, strikes, public holidays or other events outside our control can occasionally happen. If your order has not arrived within the expected time, contact us and we will follow up with the courier.</p>
<h3>Receiving your order</h3><p>Please check the package when it arrives. If it looks damaged or tampered with, take photos and contact us within 48 hours of delivery (see our Refund policy).</p>${CONTACT}`,
  },
  "refund-policy": {
    slug: "refund-policy",
    title: "Refund & cancellation policy",
    description: "Replacements, refunds and cancellations for Mumma's Bite orders.",
    body: `<p>We want every Mumma's Bite order to reach you fresh and exactly as you ordered it. Because our bars are food, we can't accept returns of opened or unopened products for reasons of hygiene and food safety. If something is wrong with your order, we will make it right.</p>
<h3>Damaged, wrong or missing items</h3><p>If your order arrives damaged, tampered with, incorrect or with items missing, please contact us <strong>within 48 hours of delivery</strong> with your order number and clear photos of the package and products (an unboxing video helps us resolve it faster). After checking, we will send a free replacement or give you a full refund for the affected items, whichever you prefer.</p>
<h3>Quality concerns</h3><p>If you have a concern about the taste, freshness or quality of a product within its shelf life, contact us with your order number and photos of the product and its batch/expiry details. We review every case personally.</p>
<h3>Cancellations</h3><p>You can cancel an order at no cost before it has been dispatched. Message us on WhatsApp or email us as soon as possible. Once an order has been handed to the courier it cannot be cancelled.</p>
<h3>Refunds</h3><p>Approved refunds are made to your original payment method (UPI, card, net banking or wallet) through Razorpay. Refunds are usually processed within 2 business days of approval and typically appear in your account within 5–7 business days, depending on your bank.</p>
<h3>Undelivered orders</h3><p>If an order is returned to us because the address was incorrect or the parcel could not be delivered after repeated attempts, we will refund the product value. Delivery charges for the failed delivery may be deducted.</p>${CONTACT}`,
  },
  "terms-of-service": {
    slug: "terms-of-service",
    title: "Terms of service",
    description: "The terms for using mummasbite.com and ordering from Mumma's Bite.",
    body: `<h3>Overview</h3><p>This website is operated by Mumma's Bite ("we", "us", "our"). By browsing mummasbite.com or placing an order, you agree to these terms.</p>
<h3>Products and information</h3><p>Our products are packaged food. We describe ingredients, nutrition, allergens and shelf life from our product labels. Always read the label on the pack before eating, especially if you have allergies. Our products contain tree nuts, peanuts and/or sesame. Photos are for illustration; packaging may vary slightly.</p>
<h3>Prices and payment</h3><p>Prices are in Indian Rupees (₹). Delivery charges and any offers are shown at checkout before you pay. Payments are processed securely by Razorpay; we do not store your card or bank details. We may correct pricing errors and cancel orders placed at an incorrect price, with a full refund.</p>
<h3>Orders</h3><p>An order is confirmed when you receive our order confirmation email. We may decline or cancel an order (for example, if a product is out of stock or we cannot deliver to the address); any payment is then refunded in full.</p>
<h3>Offers</h3><p>Offers apply automatically at checkout as described on the site. One order-level offer applies per order. Offers have no cash value.</p>
<h3>Shipping, refunds and cancellations</h3><p>These are covered by our Shipping policy and Refund policy, which form part of these terms.</p>
<h3>Use of the website</h3><p>Do not misuse the website or use its content unlawfully. All text, images, logos and designs on this website belong to Mumma's Bite and may not be reused without permission.</p>
<h3>Limitation of liability</h3><p>To the extent permitted by law, our liability for any order is limited to the amount you paid for that order.</p>
<h3>Governing law</h3><p>These terms are governed by the laws of India. Disputes are subject to the jurisdiction of the courts of Visakhapatnam, Andhra Pradesh.</p>
<h3>Changes</h3><p>We may update these terms. The version on the website when you order applies to that order.</p>${CONTACT}`,
  },
  "privacy-policy": {
    slug: "privacy-policy",
    title: "Privacy policy",
    description: "How Mumma's Bite collects and uses your information.",
    body: `<p>We collect only what we need to take and deliver your order: your name, contact details, delivery address and order details. Payments are handled by Razorpay; we never see or store your card or bank details. Orders and checkout are run on Shopify.</p>
<p>We use your information to process and deliver orders, send order and shipping updates, and answer your questions. We share it only with the services that make this possible (Shopify, Razorpay and our courier partners). We do not sell your information.</p>
<p>To ask about, correct or delete your information, contact us.</p>${CONTACT}`,
  },
  "contact-information": {
    slug: "contact-information",
    title: "Contact information",
    description: "How to reach Mumma's Bite.",
    body: `<p><strong>Mumma's Bite</strong></p><p>${ADDRESS_HTML}</p><p>Email: <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a><br>WhatsApp: <a href="${whatsappLink()}" target="_blank" rel="noopener noreferrer">chat with us</a></p><p>FSSAI Lic. No. 20126052001147</p>`,
  },
};

/** Footer order. */
export const POLICY_LINKS: { slug: PolicySlug; label: string }[] = [
  { slug: "shipping-policy", label: "Shipping" },
  { slug: "refund-policy", label: "Refunds & cancellations" },
  { slug: "terms-of-service", label: "Terms" },
  { slug: "privacy-policy", label: "Privacy" },
  { slug: "contact-information", label: "Contact information" },
];
