import { FREE_DELIVERY_MIN } from "@/lib/commerce/offers";

/**
 * Plain answers to what people search for before buying a snack bar.
 * Every answer must stay true to the pack labels (see the product metafields).
 */
export const FAQ = [
  {
    q: "What's in Mumma's Bite bars?",
    a: "The Dry Fruit Energy Bar is mostly dates (45%), with cashews (15%), almonds (12.5%), pumpkin, sunflower and watermelon seeds, walnuts and pistachios (5% each), and a little ghee (2.5%). The Multi-Seed Energy Bar is dates, peanuts and pumpkin, sunflower, watermelon, sesame and flax seeds.",
  },
  {
    q: "Do the bars have added sugar?",
    a: "No. There is no added sugar and no preservatives. The sweetness comes from dates, so the bars do contain the natural sugar of the fruit (shown in the nutrition table on each product).",
  },
  {
    q: "How much protein is in each bar?",
    a: "A 22 g Dry Fruit bar has 3 g of protein and a 25 g Multi-Seed bar has 3.5 g, from the nuts and seeds. They're a wholesome snack, not a high-protein supplement.",
  },
  {
    q: "Are they a good snack for kids and for travel?",
    a: "Each bar is about 4 × 5 cm, small enough for a school tiffin, an office drawer, a gym bag or a travel bag. Please note they contain tree nuts, peanuts and/or sesame, and the Dry Fruit bar contains a little ghee (milk).",
  },
  {
    q: "How long do they last?",
    a: "Each pack has a shelf life of 30 days. The best-before date is printed on the pack.",
  },
  {
    q: "Do you deliver across India?",
    a: `Yes. Delivery is ₹79, and free when your order total after offers is ₹${FREE_DELIVERY_MIN.toLocaleString("en-IN")} or more. Enter your PIN code in the cart to see the charge for your address.`,
  },
];
