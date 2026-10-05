export type PincodeLocation = {
  pincode: string;
  city: string;
  state: string;
  /** Shopify province code for the state, when known. */
  provinceCode: string | null;
};

export const PINCODE_PATTERN = /^[1-9][0-9]{5}$/;
