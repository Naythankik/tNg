import { buildWhatsAppInquiryLink } from '../utils/whatsapp';
import { BUSINESS_WHATSAPP_NUMBER } from '../constants';

function Footer() {
  const contactLink = buildWhatsAppInquiryLink(
    BUSINESS_WHATSAPP_NUMBER,
    "Hi, I'd like to know more about Take n Go Confectionery."
  );

  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-8 text-center text-sm text-stone-500">
        <p className="font-medium text-brand-navy">Your Yummy's Delight</p>
        <a
          href={contactLink}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-brand hover:underline"
        >
          Chat with us on WhatsApp
        </a>
        <p className="mt-4">© {new Date().getFullYear()} Take n Go Confectionery</p>
      </div>
    </footer>
  );
}

export default Footer;
