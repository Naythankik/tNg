import { Link } from 'react-router-dom';
import { buildWhatsAppInquiryLink } from '../utils/whatsapp';
import { BUSINESS_WHATSAPP_NUMBER } from '../constants';

const TRUST_BADGES = ['100% Preservatives Free', '100% Cow Milk', '100% Homemade', '100% Natural Sweetener'];

const OFFERINGS = [
  {
    emoji: '🍨',
    title: 'Solo Treats',
    description:
      'Individual parfait cups for whenever a craving hits. Grab one for yourself, no order minimum, no waiting on a crowd.',
    message: "Hi, I'd like to order a parfait for myself.",
  },
  {
    emoji: '🎉',
    title: 'Private Gatherings',
    description:
      "Birthdays, get-togethers, family celebrations: tell us the headcount and the vibe, and we'll put together a spread that fits.",
    message: "Hi, I'm planning a private gathering and would like to know more about your packages.",
  },
  {
    emoji: '🥂',
    title: 'Event Catering',
    description:
      'Weddings, corporate events, large parties: bulk parfait platters and custom packaging, made fresh for the date that matters.',
    message: "Hi, I'm looking into catering for an upcoming event. Could you tell me more?",
  },
];

function TrustBadges({ className = '' }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {TRUST_BADGES.map((badge) => (
        <span
          key={badge}
          className="rounded-full bg-brand-sky-light px-3 py-1 text-xs font-medium text-brand-navy"
        >
          {badge}
        </span>
      ))}
    </div>
  );
}

function Landing() {
  const generalInquiryLink = buildWhatsAppInquiryLink(
    BUSINESS_WHATSAPP_NUMBER,
    "Hi, I'd like to know more about Take n Go Confectionery."
  );

  return (
    <main>
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-brand-navy sm:text-5xl">
              Homemade fruit parfaits, made fresh for you
            </h1>
            <p className="mt-4 text-lg text-stone-600">
              Take n Go Confectionery makes fruit parfaits by hand, whether it's one cup for
              yourself, a spread for a private gathering, or catering for your next event.
            </p>
            <TrustBadges className="mt-6" />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/menu"
                className="inline-flex items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-dark"
              >
                View Menu
              </Link>
              <a
                href={generalInquiryLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-brand-navy px-5 py-2.5 text-sm font-medium text-brand-navy transition hover:bg-brand-sky-light"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-sm">
            <img
              src="/hero.jpg"
              alt="Take n Go Confectionery fruit parfait"
              className="aspect-square w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-brand-navy">
            What We Offer
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-stone-500">
            Same homemade parfait, three ways to enjoy it.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {OFFERINGS.map((offering) => {
              const link = buildWhatsAppInquiryLink(BUSINESS_WHATSAPP_NUMBER, offering.message);
              return (
                <article
                  key={offering.title}
                  className="flex flex-col rounded-xl border border-stone-200 p-6 text-center"
                >
                  <span className="text-4xl">{offering.emoji}</span>
                  <h3 className="mt-3 text-lg font-semibold text-brand-navy">{offering.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-stone-600">{offering.description}</p>
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand-sky-light px-4 py-2 text-sm font-medium text-brand-navy transition hover:bg-brand-sky hover:text-white"
                  >
                    Ask about this
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-brand-navy">Your Yummy's Delight</h2>
        <p className="mx-auto mt-3 max-w-xl text-stone-600">
          Every parfait is made fresh to order, no shortcuts, no preservatives. Ready to see
          what's on the menu today?
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/menu"
            className="inline-flex items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-dark"
          >
            View Menu
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Landing;
