import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { HandHeart, Heart, Gift, ArrowRight } from "lucide-react";
import { useMtscnlDonatePageLive } from "@/hooks/usePayloadLive";

const defaultData = {
  hero_eyebrow: "Donate",
  hero_title: "Help care for seafarers visiting Toronto",
  hero_description: "Every gift helps us provide hospitality, transportation, Wi-Fi, refreshments, haircuts, and a welcoming place for seafarers far from home.",
  hero_primary_cta_label: "Become a Monthly Donor",
  hero_primary_cta_link: "#monthly",
  hero_secondary_cta_label: "Make a One-Time Gift",
  hero_secondary_cta_link: "#one-time",

  monthly_title: "Become a Monthly Donor",
  monthly_description: "Monthly gifts help us plan ahead and ensure seafarers in Toronto always have access to the support they need.",
  monthly_tiers: [
    { amount: "$15", period: "/month", body: "Help provide refreshments and hospitality." },
    { amount: "$25", period: "/month", body: "Support transportation and communication needs." },
    { amount: "$50", period: "/month", body: "Provide care, comfort, and practical assistance for visiting crews." },
  ],
  monthly_button_label: "Become a Monthly Donor",
  monthly_button_link: "https://www.canadahelps.org/en/dn/145961",

  onetime_title: "Make a One-Time Donation",
  onetime_description: "Your gift helps create a welcoming station space, support local programs, and care for seafarers when they arrive in Toronto.",
  onetime_amounts: [
    { amount: "$50" },
    { amount: "$100" },
    { amount: "$250" },
  ],
  onetime_button_label: "Give Now",
  onetime_button_link: "https://www.canadahelps.org/en/dn/145961",
  onetime_footer: "All donations are processed through Mission to Seafarers Canada in support of the Toronto station and the national mission.",

  inkind_title: "Donate Goods or Services",
  inkind_description: "We are always grateful for in-kind gifts that help us create a welcoming and comfortable space for seafarers — from snacks to furniture to professional services.",
  inkind_btn1_label: "Contact About In-Kind",
  inkind_btn1_link: "/contact",
  inkind_btn2_label: "View Wish List",
  inkind_btn2_link: "/get-involved",
  inkind_items: [
    { text: "Snacks and refreshments" },
    { text: "Gift cards" },
    { text: "Technology and Wi-Fi support" },
    { text: "Office supplies" },
    { text: "Haircut and personal care" },
    { text: "Professional services" },
    { text: "Event support" },
    { text: "Furniture & lounge items" },
  ],

  cta_title: "Support locally. Give nationally. Care globally.",
  cta_description: "Donations sustain the work of Mission to Seafarers Canada and the Toronto station.",
  cta_btn1_label: "Volunteer Locally",
  cta_btn1_link: "/get-involved",
  cta_btn2_label: "Contact Toronto",
  cta_btn2_link: "/contact",
};

const Donate = () => {
  const { data: rawData } = useMtscnlDonatePageLive();
  const data = rawData ? { ...defaultData, ...rawData } : defaultData;

  // Resolve Images: CMS (Will pass background to PageHero and CTA section if set)
  const resolvedHeroBg = data?.hero_background_image?.url || undefined;
  const resolvedCtaBg = data?.cta_background_image?.url || undefined;

  return (
    <>
      <PageHero
        eyebrow={data.hero_eyebrow}
        title={data.hero_title}
        description={data.hero_description}
        backgroundImage={resolvedHeroBg} // Passes seamlessly if PageHero supports it
        primaryCta={{ label: data.hero_primary_cta_label, to: data.hero_primary_cta_link }}
        secondaryCta={{ label: data.hero_secondary_cta_label, to: data.hero_secondary_cta_link }}
      />

      {/* Two giving paths */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-page">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Monthly */}
            <div id="monthly" className="rounded-3xl bg-gradient-coral text-white p-8 md:p-10 shadow-warm scroll-mt-24">
              <HandHeart className="h-9 w-9 text-white" />
              <p className="mt-5 text-[11px] font-extrabold uppercase tracking-widest text-white/85">Recurring Giving</p>
              <h2 className="mt-2 text-3xl md:text-4xl font-extrabold !text-white leading-tight">{data.monthly_title}</h2>
              <p className="mt-4 text-white/90">
                {data.monthly_description}
              </p>
              <div className="mt-7 space-y-3">
                {data.monthly_tiers.map((t: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-4 rounded-xl bg-white/15 backdrop-blur-sm p-4">
                    <p className="text-2xl font-extrabold whitespace-nowrap">
                      {t.amount}<span className="text-sm font-bold opacity-80">{t.period}</span>
                    </p>
                    <p className="text-sm text-white/90 pt-1.5">{t.body}</p>
                  </div>
                ))}
              </div>
              <Button asChild size="lg" className="mt-8 w-full bg-white text-coral hover:bg-white/90 font-bold h-12">
                <a href={data.monthly_button_link} target="_blank" rel="noopener noreferrer">
                  {data.monthly_button_label} <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            {/* One-time */}
            <div id="one-time" className="rounded-3xl bg-warm-gray p-8 md:p-10 border-2 border-navy/10 scroll-mt-24">
              <Heart className="h-9 w-9 text-coral" />
              <p className="mt-5 text-[11px] font-extrabold uppercase tracking-widest text-coral">One-Time Gift</p>
              <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-navy leading-tight">{data.onetime_title}</h2>
              <p className="mt-4 text-text-mid">
                {data.onetime_description}
              </p>
              <div className="mt-7 grid grid-cols-3 gap-2.5">
                {data.onetime_amounts.map((a: any, idx: number) => (
                  <button key={idx} type="button" className="rounded-xl border-2 border-navy/15 bg-white py-4 text-lg font-extrabold text-navy hover:border-coral hover:text-coral transition-all">
                    {a.amount}
                  </button>
                ))}
              </div>
              <Button asChild size="lg" className="mt-7 w-full bg-navy hover:bg-navy-dark text-white font-bold h-12">
                <a href={data.onetime_button_link} target="_blank" rel="noopener noreferrer">
                  {data.onetime_button_label} <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <p className="mt-5 text-xs text-text-mid italic text-center">
                {data.onetime_footer}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* In-kind */}
      <section className="py-20 md:py-24 bg-warm-gray">
        <div className="container-page grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <Gift className="h-10 w-10 text-coral" />
            <h2 className="mt-5 text-3xl md:text-4xl font-extrabold text-navy leading-tight">
              {data.inkind_title}
            </h2>
            <p className="mt-5 text-base text-text-mid leading-relaxed">
              {data.inkind_description}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild className="bg-coral hover:bg-coral-light text-white font-bold shadow-warm h-11 px-6">
                {data.inkind_btn1_link.startsWith('http') ? (
                  <a href={data.inkind_btn1_link} target="_blank" rel="noopener noreferrer">{data.inkind_btn1_label}</a>
                ) : (
                  <Link to={data.inkind_btn1_link}>{data.inkind_btn1_label}</Link>
                )}
              </Button>
              <Button asChild variant="outline" className="border-2 border-navy text-navy hover:bg-navy hover:text-white font-bold h-11 px-6">
                {data.inkind_btn2_link.startsWith('http') ? (
                  <a href={data.inkind_btn2_link} target="_blank" rel="noopener noreferrer">{data.inkind_btn2_label}</a>
                ) : (
                  <Link to={data.inkind_btn2_link}>{data.inkind_btn2_label}</Link>
                )}
              </Button>
            </div>
          </div>

          <ul className="lg:col-span-7 grid sm:grid-cols-2 gap-3">
            {data.inkind_items.map((t: any, idx: number) => (
              <li key={idx} className="rounded-xl bg-white p-4 shadow-card flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-coral shrink-0" />
                <span className="text-sm font-semibold text-navy">{t.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 md:py-24 bg-gradient-hero text-white overflow-hidden">
        {resolvedCtaBg && (
          <div className="absolute inset-0 z-0">
            <img 
              src={resolvedCtaBg} 
              alt="CTA Background" 
              className="w-full h-full object-cover opacity-20 mix-blend-overlay" 
            />
          </div>
        )}
        <div className="container-page text-center max-w-2xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold !text-white">{data.cta_title}</h2>
          <p className="mt-5 text-white/85">
            {data.cta_description}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-coral hover:bg-coral-light text-white font-bold shadow-warm h-12 px-7">
              {data.cta_btn1_link.startsWith('http') ? (
                <a href={data.cta_btn1_link} target="_blank" rel="noopener noreferrer">{data.cta_btn1_label}</a>
              ) : (
                <Link to={data.cta_btn1_link}>{data.cta_btn1_label}</Link>
              )}
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-navy bg-transparent font-bold h-12 px-7">
              {data.cta_btn2_link.startsWith('http') ? (
                <a href={data.cta_btn2_link} target="_blank" rel="noopener noreferrer">{data.cta_btn2_label}</a>
              ) : (
                <Link to={data.cta_btn2_link}>{data.cta_btn2_label}</Link>
              )}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Donate;