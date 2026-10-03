/**
 * Storefront API documents.
 *
 * Factual product information lives in product metafields, namespace `mummas`:
 *   net_quantity · claims · ingredients · nutrition · allergens · storage · shelf_life · fssai
 * Create these metafield definitions in Shopify Admin (Settings → Custom data →
 * Products) and expose them to the Storefront API.
 */

const METAFIELD_KEYS = [
  "net_quantity",
  "claims",
  "ingredients",
  "nutrition",
  "allergens",
  "storage",
  "shelf_life",
  "fssai",
  "short_description",
];

const imageFields = `url altText width height`;

export const productFragment = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    availableForSale
    featuredImage { ${imageFields} }
    images(first: 8) { nodes { ${imageFields} } }
    priceRange { minVariantPrice { amount currencyCode } }
    variants(first: 20) {
      nodes {
        id
        title
        availableForSale
        price { amount currencyCode }
        selectedOptions { name value }
      }
    }
    metafields(identifiers: [${METAFIELD_KEYS.map((k) => `{ namespace: "mummas", key: "${k}" }`).join(", ")}]) {
      key
      value
    }
  }
`;

export const productsQuery = /* GraphQL */ `
  ${productFragment}
  query Products($first: Int!) {
    products(first: $first, sortKey: BEST_SELLING) { nodes { ...ProductFields } }
  }
`;

export const productByHandleQuery = /* GraphQL */ `
  ${productFragment}
  query ProductByHandle($handle: String!) {
    product(handle: $handle) { ...ProductFields }
  }
`;

const cartFragment = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost { subtotalAmount { amount currencyCode } }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost { totalAmount { amount currencyCode } }
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            product { handle title featuredImage { ${imageFields} } }
          }
        }
      }
    }
  }
`;

export const cartQuery = /* GraphQL */ `
  ${cartFragment}
  query Cart($id: ID!) { cart(id: $id) { ...CartFields } }
`;

export const cartCreateMutation = /* GraphQL */ `
  ${cartFragment}
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) { cart { ...CartFields } userErrors { message } }
  }
`;

export const cartLinesAddMutation = /* GraphQL */ `
  ${cartFragment}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { message } }
  }
`;

export const cartLinesUpdateMutation = /* GraphQL */ `
  ${cartFragment}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { message } }
  }
`;

export const cartLinesRemoveMutation = /* GraphQL */ `
  ${cartFragment}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } userErrors { message } }
  }
`;
