// Builds a wa.me deep link pre-filled with product details, per the proposal's
// "Order via WhatsApp" flow (no cart/checkout — just a conversational handoff).
export function buildWhatsAppOrderLink({ phoneNumber, productName, size, price }) {
  const sizePart = size ? ` (${size})` : '';
  const message = `Hi, I'm interested in ordering the ${productName}${sizePart} for ${price}.`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encoded}`;
}
