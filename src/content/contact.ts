/** Contact details supplied by the brand. */
export const WHATSAPP_NUMBER = "918309532183"; // +91 83095 32183
export const WHATSAPP_DISPLAY = "+91 83095 32183";
export const whatsappLink = (text = "Hi Mumma's Bite! I have a question.") =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
