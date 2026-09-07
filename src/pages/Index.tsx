import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowRight, Heart, Users, Globe2, HandHeart,
  MapPin, Building2, Gift, HeartHandshake, Briefcase, 
  Sparkles, Scale, Package, Wifi, Coffee
} from "lucide-react";
import { useMtscnlHomePageLive } from "@/hooks/usePayloadLive";

// Image imports for the Hero Section
import heroImg3 from "@/assets/pocket2.jpeg";
import skyline from "@/assets/labradoor-skyline.png";

// Background image imports
import waterImg from "@/assets/water1.jpg";
import seaImg2 from "@/assets/old-bg.webp";

// Icon mapping for dynamic CMS selections
const iconMap: Record<string, any> = {
  users: Users,
  package: Package,
  briefcase: Briefcase,
  heart: Heart,
  sparkles: Sparkles,
  scale: Scale,
  'map-pin': MapPin,
  wifi: Wifi,
  coffee: Coffee,
  globe2: Globe2,
  building2: Building2,
};

// Default fallback data mimicking the payload seed perfectly
const defaultData = {
  hero_eyebrow: 'Mission to Seafarers · Newfoundland and Labrador',
  hero_title_line_1: 'Here When Seafarers',
  hero_title_highlight: 'Come Ashore',
  hero_paragraph_1: 'After days, weeks, and sometimes months at sea, seafarers arrive in port with only a short window ashore.',
  hero_paragraph_2: 'Mission to Seafarers Newfoundland and Labrador is here during that window—with practical support, a welcoming place to step off the vessel, and people to speak with while they are ashore.',
  hero_paragraph_3_prefix: 'We are part of',
  hero_paragraph_3_link_text: 'Mission to Seafarers Canada',
  hero_paragraph_3_link_url: 'https://mtsc.ca/',
  hero_paragraph_3_suffix: 'and connected to a wider global network caring for seafarers in ports around the world.',
  hero_button_1_label: 'Contact the Station',
  hero_button_1_link: '/contact',
  hero_button_2_label: 'Donate',
  hero_image_badge: 'Newfoundland and Labrador Station',
  hero_image_title: 'Welcoming crews who keep global trade moving.',
  trust_stats: [
    { stat_number: '90%', stat_label: 'Transportation of the world’s goods and fuels' },
    { stat_number: '74K', stat_label: 'Operating ships' },
    { stat_number: '1.89 M', stat_label: 'Seafarers all over the world' },
    { stat_number: '1856', stat_label: 'History dating back to' },
  ],
  help_eyebrow: 'How We Help',
  help_title: 'How We Support the World’s Seafarers in Newfoundland and Labrador',
  help_subtitle: 'As part of a 160+ year legacy, we offer practical, emotional and spiritual support to seafarers visiting Newfoundland and Labrador, helping ensure that no seafarer feels alone.',
  featured_services_title: 'Featured Services',
  featured_services: [
    {
      icon: 'users',
      eyebrow: 'At the Station',
      title: 'Community Connection',
      description: 'Refreshments and a comfortable place to sit, pause and reconnect with loved ones in a welcoming station space.',
      button_label: 'Come Visit Us at the Station',
      button_link: '/contact',
    },
    {
      icon: 'package',
      eyebrow: 'Logistics',
      title: 'Seafarers Parcel Pickup Service',
      description: 'Order essentials online and have them delivered securely to our station for pickup when your vessel arrives in port.',
      button_label: 'Send Your Parcel',
      button_link: 'https://parcelservice.mtsc.ca/',
    },
  ],
  care_items_title: 'How We Care for Seafarers',
  care_items: [
    { icon: 'briefcase', title: 'Practical Support' },
    { icon: 'heart', title: 'Mental and Emotional Health' },
    { icon: 'sparkles', title: 'Spiritual Care' },
    { icon: 'scale', title: 'Advocacy and Rights' },
    { icon: 'users', title: 'Community Connection' },
    { icon: 'package', title: 'Seafarers Parcel Pickup Service' },
    { icon: 'map-pin', title: 'Transportation and Local Guidance' },
    { icon: 'wifi', title: 'Wi-Fi and Communication Tools' },
    { icon: 'coffee', title: 'Refreshments and Hospitality' },
  ],
  network_title: 'Local Presence. Connected in Purpose.',
  network_subtitle: 'Mission to Seafarers Newfoundland and Labrador is part of a connected network of care.',
  network_cards: [
    {
      icon: 'globe2',
      eyebrow: 'Global Network',
      title: 'The Mission to Seafarers',
      description: 'Connected globally across more than 200 ports.',
      link_text: 'Visit Website',
      link_url: 'https://www.missiontoseafarers.org/',
    },
    {
      icon: 'building2',
      eyebrow: 'National Body',
      title: 'Mission to Seafarers Canada',
      description: 'Mission to Seafarers Canada provides the national leadership, fund development, partnerships and support that strengthen stations across the country.',
      link_text: 'Visit Website',
      link_url: 'https://mtsc.ca/',
    },
  ],
  support_title: 'Support Locally. Care Globally.',
  support_subtitle: 'Whether you volunteer, donate, attend an event or simply help us welcome a seafarer, you become part of a connected network of care reaching from Newfoundland and Labrador to ports around the world.',
  support_button_label: 'Get Involved',
  support_button_link: '/get-involved',
  involved_eyebrow: 'Get Involved',
  involved_title: 'Help Us Welcome Seafarers to Newfoundland and Labrador',
  involved_description: 'There are many ways to support our station and the seafarers we serve. You can:',
  involved_bullets: [
    { bullet: 'Volunteer at the station or during local events' },
    { bullet: 'Donate snacks, refreshments, gift cards, furniture or supplies' },
    { bullet: 'Support haircut and wellness services for seafarers' },
    { bullet: 'Help furnish and maintain a welcoming station space' },
    { bullet: 'Support a local project or event' },
    { bullet: 'Become a community or business partner' },
  ],
  involved_footer_italic: 'Local volunteers, supporters and community partners help make Mission to Seafarers Newfoundland and Labrador possible.',
  involved_button_label: 'Contact the Newfoundland and Labrador Station',
  involved_button_link: '/contact',
  donate_eyebrow: 'Donate',
  donate_title: 'Help Care for Seafarers',
  donate_description: 'Every gift helps us provide hospitality, transportation, Wi-Fi, refreshments and a welcoming place for seafarers visiting Newfoundland and Labrador.',
  donate_bullets_title: 'You can:',
  donate_bullets: [
    { bullet: 'Become a monthly donor' },
    { bullet: 'Make a one-time gift' },
    { bullet: 'Support Mission to Seafarers Newfoundland and Labrador through Mission to Seafarers Canada' },
  ],
  donate_footer_italic: 'National donations and partnerships help strengthen the work of Mission to Seafarers Canada across the country. Donations are processed through Mission to Seafarers Canada in support of the Newfoundland and Labrador station and the wider Mission across Canada.',
  donate_button_label: 'Donate Now',
  donation_iframe_url: 'https://www.canadahelps.org/en/dn/73316',
};

const Index = () => {
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const { data: rawData } = useMtscnlHomePageLive();
  const data = rawData ? { ...defaultData, ...rawData } : defaultData;

  return (
    <>
      {/* ─────────── HERO ─────────── */}
      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat bg-white"
        style={{ backgroundImage: `url("${seaImg2}")` }} 
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />

        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-coral/10 blur-3xl z-0" />
        <div className="absolute top-1/3 -left-20 h-72 w-72 rounded-full bg-navy/10 blur-3xl z-0" />

        <div className="container-page relative z-10 pt-12 pb-14 md:pt-20 md:pb-20 lg:pt-24 lg:pb-24">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">

            {/* Left Column: Text Content */}
            <div className="lg:col-span-7 animate-fade-in-up">

              <div className="relative inline-block mt-4 md:mt-0">
                <img
                  src={skyline}
                  alt="Skyline"
                  aria-hidden="true"
                  className="absolute bottom-[90%] -right-0 w-28 md:w-40 opacity-80 animate-float pointer-events-none z-0"
                  loading="lazy"
                />
                <span className="eyebrow bg-white/50 text-navy backdrop-blur inline-block px-2 py-1 rounded-md relative z-10">
                  {data.hero_eyebrow}
                </span>
              </div>

              <h1 className="mt-5 text-[2.25rem] sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.05] text-navy tracking-tight drop-shadow-sm">
                {data.hero_title_line_1}
                <br />
                <span className="relative inline-block text-coral whitespace-nowrap mt-2">
                  {data.hero_title_highlight}
                  <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 200 10" fill="none">
                    <path d="M2 7 Q50 1, 100 5 T198 4" stroke="hsl(var(--coral))" strokeWidth="3" strokeLinecap="round" fill="none" />
                  </svg>
                </span>
              </h1>

              <div className="mt-6 text-lg md:text-xl text-navy/90 leading-relaxed max-w-2xl font-medium space-y-5">
                <p>{data.hero_paragraph_1}</p>
                <p>{data.hero_paragraph_2}</p>
                <p>
                  {data.hero_paragraph_3_prefix}{" "}
                  <a href={data.hero_paragraph_3_link_url} target="_blank" rel="noopener noreferrer" className="text-coral hover:text-coral-light underline underline-offset-4 transition-colors font-bold">
                    {data.hero_paragraph_3_link_text}
                  </a>{" "}
                  {data.hero_paragraph_3_suffix}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4 relative z-20">
                <Button asChild size="lg" variant="outline" className="border-2 border-navy text-navy bg-white/50 backdrop-blur hover:bg-navy hover:text-white font-bold h-12 px-7 cursor-pointer">
                  {data.hero_button_1_link.startsWith('http') ? (
                    <a href={data.hero_button_1_link} target="_blank" rel="noopener noreferrer">{data.hero_button_1_label}</a>
                  ) : (
                    <Link to={data.hero_button_1_link}>{data.hero_button_1_label}</Link>
                  )}
                </Button>
                <Button onClick={() => setIsDonateOpen(true)} size="lg" className="bg-coral hover:bg-coral-light text-white font-bold shadow-warm hover:shadow-warm-hover h-12 px-7 cursor-pointer">
                  {data.hero_button_2_label} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="lg:col-span-5 relative animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="relative rounded-2xl overflow-hidden shadow-soft aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
                <img
                  src={heroImg3}
                  alt="Aerial view"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-navy-dark/60 via-navy/10 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-5 md:p-7">
                  <div className="rounded-xl bg-white/95 backdrop-blur p-4 md:p-5 shadow-card">
                    <p className="text-xs font-bold uppercase tracking-wider text-coral">{data.hero_image_badge}</p>
                    <p className="mt-1.5 text-sm md:text-base font-semibold text-navy leading-snug">
                      {data.hero_image_title}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* trust strip */}
        <div className="border-t border-border bg-white/80 backdrop-blur relative z-10">
          <div className="container-page mx-auto py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center justify-center">
            {data.trust_stats.map((s: any, idx: number) => (
              <div key={idx}>
                <p className="text-2xl md:text-3xl font-extrabold text-navy">{s.stat_number}</p>
                <p className="text-[10px] md:text-xs mt-1 font-bold uppercase tracking-widest text-text-mid">{s.stat_label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── HOW WE HELP ─────────── */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container-page">
          <div className="text-center max-w-3xl mx-auto">
            <span className="eyebrow mx-auto">{data.help_eyebrow}</span>
            <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-extrabold text-navy leading-tight">
              {data.help_title}
            </h2>
            <p className="mt-5 text-base md:text-lg text-text-mid">
              {data.help_subtitle}
            </p>
          </div>

          <h3 className="mt-14 mb-6 text-2xl font-extrabold text-navy text-center">{data.featured_services_title}</h3>

          <div className="grid md:grid-cols-2 gap-5 mb-14">
            {data.featured_services.map((service: any, idx: number) => {
              const Icon = iconMap[service.icon] || Users;
              const isExternal = service.button_link.startsWith('http');
              return (
                <div key={idx} className="group rounded-2xl p-7 md:p-8 transition-all hover:-translate-y-1 flex flex-col items-start bg-warm-gray hover:shadow-card-hover">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-coral-pale mb-4">
                    <Icon className="h-6 w-6 text-coral" />
                  </span>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-text-mid mb-1">{service.eyebrow}</span>
                  <h3 className="text-xl md:text-2xl font-extrabold leading-tight text-navy">
                    {service.title}
                  </h3>
                  <p className="mt-3 mb-6 text-sm leading-relaxed flex-1 text-text-mid">
                    {service.description}
                  </p>
                  <Button asChild className="bg-navy hover:bg-navy-light text-white font-bold h-12">
                    {isExternal ? (
                      <a href={service.button_link} target="_blank" rel="noopener noreferrer">
                        {service.button_label}
                      </a>
                    ) : (
                      <Link to={service.button_link}>{service.button_label}</Link>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>

          <h3 className="mb-6 text-2xl font-extrabold text-navy text-center">{data.care_items_title}</h3>

          <div className="grid md:grid-cols-3 gap-5">
            {data.care_items.map((item: any, idx: number) => {
              const Icon = iconMap[item.icon] || Briefcase;
              return (
                <div
                  key={idx}
                  className="group rounded-2xl p-7 transition-all hover:-translate-y-1 flex flex-col items-start bg-warm-gray hover:shadow-card-hover"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-coral-pale">
                    <Icon className="h-6 w-6 text-coral" />
                  </span>
                  <h3 className="mt-5 text-lg font-extrabold leading-tight text-navy">
                    {item.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────── CONNECTED IN PURPOSE ─────────── */}
      <section className="py-20 bg-coral-pale/30 border-y border-border">
        <div className="container-page">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="mt-5 text-3xl md:text-4xl font-extrabold text-navy leading-tight">
              {data.network_title}
            </h2>
            <p className="mt-5 text-base md:text-lg text-text-mid leading-relaxed">
              {data.network_subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {data.network_cards.map((card: any, idx: number) => {
              const Icon = iconMap[card.icon] || Globe2;
              return (
                <a key={idx} href={card.link_url} target="_blank" rel="noopener noreferrer" className="block rounded-3xl bg-white/95 backdrop-blur p-8 md:p-10 shadow-card hover:shadow-card-hover transition-all border-2 border-coral/15 flex flex-col justify-between">
                  <div>
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-coral-pale text-coral">
                      <Icon className="h-6 w-6" />
                    </span>
                    <p className="mt-5 text-[11px] font-extrabold uppercase tracking-widest text-coral">{card.eyebrow}</p>
                    <h3 className="mt-2 text-2xl md:text-3xl font-extrabold text-navy leading-tight">
                      {card.title}
                    </h3>
                    <p className="mt-3 mb-4 text-base text-text-mid leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                  <div className="mt-4 font-bold text-coral flex items-center group-hover:text-coral-light">
                    {card.link_text} <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────── SUPPORT LOCALLY. CARE GLOBALLY. ─────────── */}
      <section className="py-20 md:py-24 bg-warm-gray">
        <div className="container-page">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-extrabold text-navy leading-tight">
              {data.support_title}
            </h2>
            <p className="mt-5 text-base md:text-lg text-text-mid">
              {data.support_subtitle}
            </p>
          </div>

          <div className="mt-12 text-center max-w-2xl mx-auto flex justify-center">
            <Button asChild size="lg" className="bg-navy hover:bg-navy-light text-white font-bold h-12">
              <Link to={data.support_button_link}>{data.support_button_label} <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─────────── GET INVOLVED & DONATE SECTION ─────────── */}
      <section
        className="relative py-20 md:py-24 bg-cover bg-center bg-no-repeat bg-warm-gray"
        style={{ backgroundImage: `url("${waterImg}")` }}
      >
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />

        <div className="container-page relative z-10">

          <div className="grid md:grid-cols-2 gap-6">
            {/* Get Involved Card */}
            <div className="rounded-3xl bg-white/95 backdrop-blur p-8 md:p-10 shadow-card hover:shadow-card-hover transition-all border-2 border-coral/15 flex flex-col justify-between">
              <div>
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-coral-pale text-coral">
                  <HeartHandshake className="h-6 w-6" />
                </span>
                <p className="mt-5 text-[11px] font-extrabold uppercase tracking-widest text-coral">{data.involved_eyebrow}</p>
                <h3 className="mt-2 text-2xl md:text-3xl font-extrabold text-navy leading-tight">
                  {data.involved_title}
                </h3>
                <p className="mt-3 mb-4 text-base text-text-mid leading-relaxed">
                  {data.involved_description}
                </p>
                <ul className="list-disc pl-5 mb-8 text-base text-text-mid leading-relaxed space-y-1">
                  {data.involved_bullets.map((b: any, idx: number) => (
                    <li key={idx}>{b.bullet}</li>
                  ))}
                </ul>
                <p className="mb-8 text-sm italic text-navy/70 leading-relaxed font-medium">
                  {data.involved_footer_italic}
                </p>
              </div>

              <Button asChild size="lg" className="w-full bg-coral hover:bg-coral-light text-white font-bold shadow-warm h-12">
                {data.involved_button_link.startsWith('http') ? (
                  <a href={data.involved_button_link} target="_blank" rel="noopener noreferrer">{data.involved_button_label}</a>
                ) : (
                  <Link to={data.involved_button_link}>{data.involved_button_label}</Link>
                )}
              </Button>
            </div>

            {/* Donate Card */}
            <div className="rounded-3xl bg-gradient-hero text-white p-8 md:p-10 shadow-soft relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-coral/30 blur-3xl" />
              <div className="relative flex-1">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/15 text-coral-light">
                  <Gift className="h-6 w-6" />
                </span>
                <p className="mt-5 text-[11px] font-extrabold uppercase tracking-widest text-coral-light">{data.donate_eyebrow}</p>
                <h3 className="mt-2 text-2xl md:text-3xl font-extrabold !text-white leading-tight">
                  {data.donate_title}
                </h3>
                <p className="mt-3 mb-4 text-base text-white/90 leading-relaxed">
                  {data.donate_description}
                </p>
                <p className="font-bold text-white mb-2">{data.donate_bullets_title}</p>
                <ul className="list-disc pl-5 mb-8 text-base text-white/90 leading-relaxed space-y-1">
                  {data.donate_bullets.map((b: any, idx: number) => (
                    <li key={idx}>{b.bullet}</li>
                  ))}
                </ul>
                <p className="mb-8 text-sm italic text-white/80 leading-relaxed font-medium">
                  {data.donate_footer_italic}
                </p>
              </div>
              <div className="relative mt-8">
                <Button onClick={() => setIsDonateOpen(true)} size="lg" className="w-full bg-coral hover:bg-coral-light text-white font-bold shadow-warm h-12 px-2 text-sm sm:text-base cursor-pointer">
                  {data.donate_button_label} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────── MODAL: DONATION WIDGET ─────────── */}
      <Dialog open={isDonateOpen} onOpenChange={setIsDonateOpen}>
        <DialogContent className="max-w-5xl h-[95vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="p-[6px] pb-3 shrink-0 border-b">
            <DialogTitle className="flex items-center gap-3 text-xl font-extrabold text-navy">
              <Gift className="h-5 w-5 text-coral" />
              Secure Donation Form
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden p-2">
            <div className="w-full h-full bg-white rounded-lg border border-border overflow-hidden">
              <iframe
                src={data.donation_iframe_url}
                title="CanadaHelps Secure Donation Form"
                className="w-full h-full border-none block bg-transparent"
                allow="payment"
              ></iframe>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Index;