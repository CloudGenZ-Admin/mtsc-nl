import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMtscnlGetInvolvedPageLive } from "@/hooks/usePayloadLive";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Heart, Package, Briefcase, Users, HandHeart, CheckCircle2, X, Gift, Mail
} from "lucide-react";

import getInvolvedBg from "@/assets/GetInvoled.avif";
import maritimeImage from "@/assets/GTimagemaritime.jpg";

// ==========================================
// FORM COMPONENTS (Unchanged to preserve state/UI exactly)
// ==========================================

interface FormProps {
  onClose: () => void;
}

const DonateGoodsForm = ({ onClose }: FormProps) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", category: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast({ title: "Offer Received", description: "Thank you! Your donation offer has been received. Our team will contact you shortly." });
      setForm({ name: "", email: "", phone: "", category: "", description: "" });
      onClose();
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="relative rounded-2xl bg-white p-6 md:p-8 shadow-card space-y-5 animate-in fade-in slide-in-from-bottom-4">
      <button type="button" onClick={onClose} className="absolute top-6 right-6 text-text-mid hover:text-navy transition-colors"><X size={24} /></button>

      <div className="flex items-center gap-2 mb-2 pr-8">
        <Package className="h-6 w-6 text-coral" />
        <h3 className="text-2xl font-extrabold text-navy">Donate Goods or Services</h3>
      </div>
      <p className="text-sm text-text-mid mb-4">
        Thank you for your interest in supporting the Newfoundland and Labrador Station through in-kind gifts. Please fill out the form below so we can coordinate your donation.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div><Label>Full Name *</Label><Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1.5 bg-warm-gray" /></div>
        <div><Label>Email Address *</Label><Input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1.5 bg-warm-gray" /></div>
        <div><Label>Phone Number</Label><Input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="mt-1.5 bg-warm-gray" /></div>
        <div>
          <Label>Donation Type *</Label>
          <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-warm-gray px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-1.5">
            <option value="" disabled>Select a category...</option>
            <option value="Snacks and refreshments">Snacks and refreshments</option>
            <option value="Gift cards">Gift cards</option>
            <option value="Technology and Wi-Fi support">Technology and Wi-Fi support</option>
            <option value="Haircut supplies and personal care items">Haircut supplies and personal care items</option>
            <option value="Furniture and lounge items for the station">Furniture and lounge items for the station</option>
            <option value="Professional Services">Professional Services</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="sm:col-span-2"><Label>Description of Items / Services *</Label><Textarea rows={4} required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="mt-1.5 bg-warm-gray" placeholder="Please describe what you would like to donate..." /></div>
      </div>
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full bg-coral hover:bg-coral-light text-white font-bold h-12">
        {isSubmitting ? "Submitting..." : "Submit Donation Offer"}
      </Button>
    </form>
  );
};

const CorporateSponsorForm = ({ onClose }: FormProps) => {
  const [form, setForm] = useState({ 
    orgName: "", firstName: "", lastName: "", email: "", phone: "", 
    address: "", city: "", interests: [] as string[], level: "", 
    whyPartner: "", howHeard: "", howHeardOther: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const interestOptions = [
    'Financial Sponsorship', 
    'In-Kind Donation (products/services)', 
    'Volunteering as a Corporate Team',
    'Hosting Fundraising Events', 
    'Other'
  ];

  const levelOptions = [
    'Anchor Sponsor ($25,000+)',
    'Lighthouse Sponsor ($10,000–$24,999)',
    'Compass Sponsor ($5,000–$9,999)',
    'Crew Sponsor ($1,000–$4,999)',
    'Not Sure Yet'
  ];

  const heardOptions = [
    'Word of Mouth', 'Social Media', 'News/Media', 'Referred by Employee/Volunteer', 'Other'
  ];

  const handleCheckboxChange = (interest: string) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast({ title: "Inquiry Submitted", description: "Thank you for reaching out! Our partnerships team will be in touch soon." });
      onClose();
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="relative rounded-2xl bg-white p-6 md:p-8 shadow-card space-y-5 animate-in fade-in slide-in-from-bottom-4">
      <button type="button" onClick={onClose} className="absolute top-6 right-6 text-text-mid hover:text-navy transition-colors"><X size={24} /></button>

      <div className="flex items-center gap-2 mb-2 pr-8">
        <Briefcase className="h-6 w-6 text-coral" />
        <h3 className="text-2xl font-extrabold text-navy">Partner With Us</h3>
      </div>
      <p className="text-sm text-text-mid mb-4">
        Partner with the Newfoundland and Labrador station for lasting impact. Fill out the inquiry form below.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2"><Label>Organization Name *</Label><Input required value={form.orgName} onChange={e => setForm({ ...form, orgName: e.target.value })} className="mt-1.5 bg-warm-gray" /></div>
        
        <div className="sm:col-span-2 mt-2"><Label className="font-bold text-navy">Contact Person Full Name *</Label></div>
        <div><Label>First Name *</Label><Input required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="mt-1.5 bg-warm-gray" /></div>
        <div><Label>Last Name *</Label><Input required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="mt-1.5 bg-warm-gray" /></div>
        
        <div><Label>Email Address *</Label><Input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1.5 bg-warm-gray" /></div>
        <div><Label>Phone Number</Label><Input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="mt-1.5 bg-warm-gray" /></div>
        
        <div><Label>Organization Other Address</Label><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="mt-1.5 bg-warm-gray" /></div>
        <div><Label>City/Province</Label><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="mt-1.5 bg-warm-gray" /></div>

        <div className="sm:col-span-2 mt-2">
          <Label className="mb-3 block font-bold text-navy">I’m Interested In (Select all that apply)</Label>
          <div className="grid sm:grid-cols-2 gap-3">
            {interestOptions.map((interest) => (
              <label key={interest} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-warm-gray transition-colors border border-transparent hover:border-border">
                <input type="checkbox" checked={form.interests.includes(interest)} onChange={() => handleCheckboxChange(interest)} className="w-4 h-4 text-coral border-gray-300 rounded focus:ring-coral" />
                <span className="text-sm text-navy font-medium">{interest}</span>
              </label>
            ))}
          </div>
          {form.interests.includes('Other') && (
            <Input className="mt-3 bg-warm-gray" placeholder="Other (Please specify)" />
          )}
        </div>

        <div className="sm:col-span-2">
          <Label className="font-bold text-navy">Preferred Sponsorship Level (if known)</Label>
          <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-warm-gray px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-1.5">
            <option value="" disabled>Select a level...</option>
            {levelOptions.map(level => <option key={level} value={level}>{level}</option>)}
          </select>
        </div>

        <div className="sm:col-span-2"><Label>Tell Us Why You're Interested in Partnering with Us</Label><Textarea rows={3} value={form.whyPartner} onChange={e => setForm({ ...form, whyPartner: e.target.value })} className="mt-1.5 bg-warm-gray" /></div>

        <div className="sm:col-span-2">
          <Label className="font-bold text-navy">How Did You Hear About Us?</Label>
          <select value={form.howHeard} onChange={e => setForm({ ...form, howHeard: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-warm-gray px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-1.5">
            <option value="" disabled>Select an option...</option>
            {heardOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
          {form.howHeard === 'Other' && (
            <Input className="mt-3 bg-warm-gray" placeholder="Other (Please specify)" value={form.howHeardOther} onChange={e => setForm({...form, howHeardOther: e.target.value})} />
          )}
        </div>
      </div>
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full bg-coral hover:bg-coral-light text-white font-bold h-12">
        {isSubmitting ? "Submitting..." : "Submit Partnership Inquiry"}
      </Button>
    </form>
  );
};

const VolunteerForm = ({ onClose }: FormProps) => {
  const [form, setForm] = useState({ 
    firstName: "", lastName: "", email: "", phone: "", city: "", 
    interests: [] as string[], interestsOther: "", availability: [] as string[], availabilityOther: "", 
    hasLicense: "", experience: "", whyVolunteer: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const interestOptions = [
    'Ship Visits', 'Driving/Transportation Assistance', 
    'Centre-Based Support (Hospitality, Admin, Cleaning)', 
    'Event Support', 'Fundraising & Outreach', 'Other (Please specify)'
  ];

  const availabilityOptions = ['Weekdays', 'Weekends', 'Flexible', 'Other (Please specify)'];

  const handleInterestChange = (interest: string) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleAvailabilityChange = (avail: string) => {
    setForm(prev => ({
      ...prev,
      availability: prev.availability.includes(avail)
        ? prev.availability.filter(a => a !== avail)
        : [...prev.availability, avail]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast({ title: "Volunteer Request Sent", description: "Thank you for your interest! We will contact you soon." });
      onClose();
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="relative rounded-2xl bg-white p-6 md:p-8 shadow-card space-y-5 animate-in fade-in slide-in-from-bottom-4">
      <button type="button" onClick={onClose} className="absolute top-6 right-6 text-text-mid hover:text-navy transition-colors"><X size={24} /></button>

      <div className="flex items-center gap-2 mb-2 pr-8">
        <Users className="h-6 w-6 text-coral" />
        <h3 className="text-2xl font-extrabold text-navy">Volunteer with Us</h3>
      </div>
      <p className="text-sm text-text-mid mb-4">
        Be a part of something meaningful. Volunteers are the heart and soul of our mission.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2 mt-2"><Label className="font-bold text-navy">Name *</Label></div>
        <div><Label>First name</Label><Input required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="mt-1.5 bg-warm-gray" /></div>
        <div><Label>Last name</Label><Input required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="mt-1.5 bg-warm-gray" /></div>
        
        <div><Label>Email *</Label><Input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1.5 bg-warm-gray" /></div>
        <div><Label>Phone number</Label><Input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="mt-1.5 bg-warm-gray" /></div>
        
        <div className="sm:col-span-2"><Label>City/Town</Label><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="mt-1.5 bg-warm-gray" /></div>

        <div className="sm:col-span-2 mt-2">
          <Label className="mb-3 block font-bold text-navy">I’m Interested In (Select all that apply)</Label>
          <div className="grid sm:grid-cols-2 gap-3">
            {interestOptions.map((interest) => (
              <label key={interest} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-warm-gray transition-colors border border-transparent hover:border-border">
                <input type="checkbox" checked={form.interests.includes(interest)} onChange={() => handleInterestChange(interest)} className="w-4 h-4 text-coral border-gray-300 rounded focus:ring-coral" />
                <span className="text-sm text-navy font-medium">{interest}</span>
              </label>
            ))}
          </div>
          {form.interests.includes('Other (Please specify)') && (
            <Input className="mt-3 bg-warm-gray" placeholder="Other (Specify here)" value={form.interestsOther} onChange={e => setForm({...form, interestsOther: e.target.value})} />
          )}
        </div>

        <div className="sm:col-span-2 mt-2">
          <Label className="mb-3 block font-bold text-navy">Availability</Label>
          <div className="grid sm:grid-cols-2 gap-3">
            {availabilityOptions.map((avail) => (
              <label key={avail} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-warm-gray transition-colors border border-transparent hover:border-border">
                <input type="checkbox" checked={form.availability.includes(avail)} onChange={() => handleAvailabilityChange(avail)} className="w-4 h-4 text-coral border-gray-300 rounded focus:ring-coral" />
                <span className="text-sm text-navy font-medium">{avail}</span>
              </label>
            ))}
          </div>
          {form.availability.includes('Other (Please specify)') && (
            <Input className="mt-3 bg-warm-gray" placeholder="Availability (other)" value={form.availabilityOther} onChange={e => setForm({...form, availabilityOther: e.target.value})} />
          )}
        </div>

        <div className="sm:col-span-2">
          <Label className="font-bold text-navy">Do you have a valid driver’s license?</Label>
          <select value={form.hasLicense} onChange={e => setForm({ ...form, hasLicense: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-warm-gray px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-1.5">
            <option value="" disabled>Select...</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="sm:col-span-2"><Label>Any relevant experience or certifications?</Label><Textarea rows={3} value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} className="mt-1.5 bg-warm-gray" /></div>
        <div className="sm:col-span-2"><Label>Why do you want to volunteer with us?</Label><Textarea rows={3} value={form.whyVolunteer} onChange={e => setForm({ ...form, whyVolunteer: e.target.value })} className="mt-1.5 bg-warm-gray" /></div>
      </div>
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full bg-coral hover:bg-coral-light text-white font-bold h-12">
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};

// ==========================================
// MAIN COMPONENT & CMS INTEGRATION
// ==========================================

const defaultData = {
  hero_badge: 'Get Involved',
  hero_title: 'Get Involved with Mission to Seafarers Newfoundland and Labrador',
  hero_subtitle: 'Whether you volunteer, donate, attend an event or simply help us welcome a seafarer, you become part of a connected network of care reaching from Newfoundland and Labrador to ports around the world.',
  hero_button_label: 'Get Involved',
  involved_title: 'Help Us Welcome Seafarers to Newfoundland and Labrador',
  involved_description: 'There are many ways to support our station and the seafarers we serve. You can:',
  involved_bullets: [
    { text: 'Volunteer at the station or during local events' },
    { text: 'Donate snacks, refreshments, gift cards, furniture or supplies' },
    { text: 'Support haircut and wellness services for seafarers' },
    { text: 'Help furnish and maintain a welcoming station space' },
    { text: 'Support a local project or event' },
    { text: 'Become a community or business partner' }
  ],
  involved_footer: 'Local volunteers, supporters and community partners help make Mission to Seafarers Newfoundland and Labrador possible.',
  involved_button_label: 'Contact the Newfoundland and Labrador Station',
  involved_button_link: '/contact',
  donate_title: 'Help Care for Seafarers',
  donate_description: 'Every gift helps us provide hospitality, transportation, Wi-Fi, refreshments and a welcoming place for seafarers visiting Newfoundland and Labrador.',
  donate_bullets_title: 'You can:',
  donate_bullets: [
    { text: 'Become a monthly donor' },
    { text: 'Make a one-time gift' },
    { text: 'Support Mission to Seafarers Newfoundland and Labrador through Mission to Seafarers Canada' }
  ],
  donate_footer: 'National donations and partnerships help strengthen the work of Mission to Seafarers Canada across the country. Donations are processed through Mission to Seafarers Canada in support of the Newfoundland and Labrador station and the wider Mission across Canada.',
  donate_button_label: 'Donate Now',
  donate_iframe_url: 'https://www.canadahelps.org/en/dn/145961',
  ways_eyebrow: 'Other Ways to Help',
  ways_title: 'Choose How You Would Like to Support',
  ways_cards: [
    { title: 'Donate Goods', desc: 'Wish list & in-kind gifts' },
    { title: 'Partner With Us', desc: 'Corporate & community support' },
    { title: 'Volunteer', desc: 'Share your time & skills' }
  ],
  inkind_title: 'In-Kind Gifts',
  inkind_description: 'We are always grateful for donations that help us create a welcoming space. Examples include:',
  inkind_bullets: [
    { text: 'Snacks and refreshments' },
    { text: 'Gift cards' },
    { text: 'Technology and Wi-Fi support' },
    { text: 'Haircut supplies and personal care items' },
    { text: 'Furniture and lounge items for the station' }
  ],
  inkind_button_1_label: 'Donate Goods Form',
  inkind_button_2_label: 'Order from our wishlist',
  inkind_button_2_link: 'https://www.amazon.ca/hz/wishlist/ls/3C9KTQNHTZ0NM?ref_=wl_fv_le.',
  partner_title: 'Partnership Options',
  partner_description: 'We welcome support from local businesses, schools, and groups. You can support:',
  partner_bullets: [
    { text: 'Local events & Volunteer activities' },
    { text: 'Hospitality and care for seafarers' },
    { text: 'Station furnishings and supplies' },
    { text: 'Haircut and wellness services' }
  ],
  partner_button_label: 'Partner with the Newfoundland and Labrador Station',
  partner_footer: 'For larger corporate partnerships and national giving opportunities, please visit Mission to Seafarers Canada.',
  ecard_eyebrow: 'Send a Card',
  ecard_title: 'Send a Seafarer a Card',
  ecard_description: 'Send a handwritten or digital card with words of encouragement, holiday wishes, or simple thanks. Brighten a seafarer’s day with a message of hope and encouragement! Your message will be printed and displayed at our Seafarers’ Centres for visiting crew members to read and feel supported.',
  ecard_steps: [
    { title: 'Step 1: Choose Your eCard Design', desc: 'Select from our beautiful collection of seafarer-themed eCards.' },
    { title: 'Step 2: Select a Charity', desc: 'Search and select “Mission to Seafarers Canada” as your charity of choice. (This step may be required by the donation platform to complete your submission.)' },
    { title: 'Step 3: Add Your Message and Optional Donation', desc: 'Write a thoughtful message or prayer for the seafarers. Add a donation if you’d like to support our mission—your gift helps provide meals, mental health support, and more.' }
  ],
  ecard_summary_title: 'Once submitted, we will:',
  ecard_summary_bullets: [
    { text: '📄 Print your eCard and message.' },
    { text: '📌 Display it at one of our Seafarers’ Centers.' },
    { text: '🤝 Share your support with the visiting crew who may be far from home.' }
  ],
  ecard_summary_callout: '💙 Thank you for sending kindness across the sea.\nEvery word matters.',
  ecard_button_label: 'Send Ecard',
  ecard_button_link: 'https://www.canadahelps.org/en/donate/ecard-donation/',
  cta_title: 'Every Act of Kindness Makes a Difference',
  cta_description: 'From a warm drink and a haircut to a monthly donation or a few hours of volunteering, every act of support helps remind seafarers that they are not alone.',
  cta_btn_1_label: 'Donate Now',
  cta_btn_2_label: 'Become a Volunteer',
  cta_btn_3_label: 'Contact the Station',
  cta_btn_3_link: '/contact',
  cta_btn_4_label: 'Order from our wishlist',
  cta_btn_4_link: 'https://www.amazon.ca/hz/wishlist/ls/3C9KTQNHTZ0NM?ref_=wl_fv_le.'
};

const GetInvolved = () => {
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [isDonateActive, setIsDonateActive] = useState(false);
  const { data: rawData } = useMtscnlGetInvolvedPageLive();
  const data = rawData ? { ...defaultData, ...rawData } : defaultData;
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Rebuild the Action Cards dynamically using the CMS data but mapping exactly to the local IDs and Icons
  const actionCards = [
    { id: 'goods', icon: Package, title: data.ways_cards[0]?.title || "Donate Goods", desc: data.ways_cards[0]?.desc || "Wish list & in-kind gifts" },
    { id: 'partner', icon: Briefcase, title: data.ways_cards[1]?.title || "Partner With Us", desc: data.ways_cards[1]?.desc || "Corporate & community support" },
    { id: 'volunteer', icon: Users, title: data.ways_cards[2]?.title || "Volunteer", desc: data.ways_cards[2]?.desc || "Share your time & skills" },
  ];

  const handleDonateClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsDonateActive(true);
    setTimeout(() => scrollToSection('donation-form'), 100);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeForm && formContainerRef.current && !formContainerRef.current.contains(event.target as Node)) {
        if (!(event.target as Element).closest('.form-trigger-btn')) {
          setActiveForm(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeForm]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const renderActiveForm = () => {
    switch (activeForm) {
      case 'goods': return <DonateGoodsForm onClose={() => setActiveForm(null)} />;
      case 'partner': return <CorporateSponsorForm onClose={() => setActiveForm(null)} />;
      case 'volunteer': return <VolunteerForm onClose={() => setActiveForm(null)} />;
      default: return null;
    }
  };

  return (
    <>
      {/* ─────────── HERO SECTION ─────────── */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-navy min-h-[45vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src={getInvolvedBg} 
            alt="Get Involved Background" 
            className="w-full h-full object-cover object-center opacity-40 mix-blend-overlay" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy/60 to-transparent" />
        </div>
        
        <div className="container-page relative z-10 text-center max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral/20 text-coral-light text-xs font-extrabold uppercase tracking-widest mb-6 border border-coral/30">
            {data.hero_badge}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            {data.hero_title}
          </h1>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed font-medium mb-8">
            {data.hero_subtitle}
          </p>
          <Button size="lg" onClick={() => scrollToSection('get-involved-donate')} className="bg-coral hover:bg-coral-light text-white font-bold h-14 px-10 text-lg">
            {data.hero_button_label}
          </Button>
        </div>
      </section>

      {/* ─────────── GET INVOLVED & DONATE SECTION (Two-Part Layout) ─────────── */}
      <section id="get-involved-donate" className="py-20 md:py-28 bg-white overflow-hidden scroll-mt-24">
        <div className="container-page">
          <div className={`grid gap-12 items-start transition-all duration-500 ${isDonateActive ? 'lg:grid-cols-12 lg:gap-16' : 'max-w-6xl mx-auto'}`}>

            {/* Left Content Context (or full width if not active) */}
            <div className={`${isDonateActive ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
              
              <div className={`grid gap-6 ${!isDonateActive ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                
                {/* Part One: Get Involved */}
                <div className="bg-warm-gray rounded-2xl p-6 md:p-8 border border-border flex flex-col h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Users size={80} /></div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-navy mb-4">
                    {data.involved_title}
                  </h3>
                  <p className="text-sm text-text-mid mb-5">
                    {data.involved_description}
                  </p>
                  <ul className="space-y-3 mb-6 flex-grow">
                    {data.involved_bullets.map((bullet: any, idx: number) => (
                      <li key={idx} className="flex gap-2 items-start"><CheckCircle2 className="text-coral w-4 h-4 shrink-0 mt-0.5" /><span className="text-sm font-medium text-navy">{bullet.text}</span></li>
                    ))}
                  </ul>
                  <p className="text-xs text-text-mid italic mb-6">
                    {data.involved_footer}
                  </p>
                  <Button asChild className="w-full bg-navy hover:bg-navy-light text-white font-bold mt-auto">
                    {data.involved_button_link.startsWith('http') ? (
                      <a href={data.involved_button_link} target="_blank" rel="noopener noreferrer">{data.involved_button_label}</a>
                    ) : (
                      <Link to={data.involved_button_link}>{data.involved_button_label}</Link>
                    )}
                  </Button>
                </div>

                {/* Part Two: Donate */}
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-border shadow-soft flex flex-col h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><HandHeart size={80} /></div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-navy mb-4">
                    {data.donate_title}
                  </h3>
                  <p className="text-sm text-text-mid mb-4">
                    {data.donate_description}
                  </p>
                  <p className="text-sm text-text-mid mb-3 font-bold">{data.donate_bullets_title}</p>
                  <ul className="space-y-3 mb-6 flex-grow">
                    {data.donate_bullets.map((bullet: any, idx: number) => (
                      <li key={idx} className="flex gap-2 items-start"><CheckCircle2 className="text-coral w-4 h-4 shrink-0 mt-0.5" /><span className="text-sm font-medium text-navy">{bullet.text}</span></li>
                    ))}
                  </ul>
                  <p className="text-xs text-text-mid italic mb-6">
                    {data.donate_footer}
                  </p>
                  <Button onClick={handleDonateClick} className="w-full bg-coral hover:bg-coral-light text-white font-bold mt-auto">
                    {data.donate_button_label}
                  </Button>
                </div>
                
              </div>
            </div>

            {/* Right Side - CanadaHelps Iframe Form (Only renders when active) */}
            {isDonateActive && (
              <div id="donation-form" className="lg:col-span-7 bg-warm-gray p-4 md:p-6 rounded-2xl border border-border shadow-card lg:sticky lg:top-24 animate-in slide-in-from-right-8 fade-in duration-500 scroll-mt-24">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <Gift className="text-coral h-6 w-6" />
                    <h3 className="font-extrabold text-navy text-xl sm:text-2xl">Secure Donation Form</h3>
                  </div>
                  <button onClick={() => setIsDonateActive(false)} className="text-text-mid hover:text-navy transition-colors p-2" aria-label="Close Donation Form">
                    <X size={24} />
                  </button>
                </div>
                <div className="w-full bg-white rounded-xl border border-border overflow-hidden shadow-inner h-[750px] sm:h-[750px] md:h-[740px]">
                  <iframe
                    src={data.donate_iframe_url}
                    title="CanadaHelps Secure Donation Form"
                    className="w-full h-full border-none block bg-transparent"
                    scrolling="auto"
                    allow="payment"
                  ></iframe>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* ─────────── WAYS TO HELP FORMS ─────────── */}
      <section id="ways-to-help" className="relative py-20 md:py-28 scroll-mt-24 overflow-hidden">
        <div className="absolute inset-0 z-0 ">
          <img 
            src={maritimeImage} 
            alt="Ways to help background" 
            className="w-full h-full object-cover object-center " 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/60 to-navy/90" />
        </div>

        <div className="container-page relative z-10">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-coral-light text-xs font-extrabold uppercase tracking-widest mb-4 border border-coral/30">
              {data.ways_eyebrow}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">{data.ways_title}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto">
            {actionCards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => {
                  setActiveForm(activeForm === card.id ? null : card.id);
                  if (activeForm !== card.id) {
                    setTimeout(() => scrollToSection('ways-to-help-forms'), 100);
                  }
                }}
                className={`form-trigger-btn p-6 rounded-xl border text-center transition-all hover:shadow-card hover:-translate-y-1 ${
                  activeForm === card.id 
                    ? "border-coral bg-coral-pale shadow-md" 
                    : "border-coral/90 bg-coral text-white"
                }`}
              >
                <card.icon className={`h-10 w-10 mx-auto mb-4 ${activeForm === card.id ? "text-coral" : "text-white"}`} />
                <h3 className={`font-bold mb-2 text-lg ${activeForm === card.id ? "text-navy" : "text-white"}`}>{card.title}</h3>
                <p className={`text-sm ${activeForm === card.id ? "text-text-mid" : "text-white/90"}`}>{card.desc}</p>
              </button>
            ))}
          </div>

          <div id="ways-to-help-forms" className="max-w-3xl mx-auto scroll-mt-32" ref={formContainerRef}>
            {
              renderActiveForm()
            }
          </div>
        </div>
      </section>

      {/* ─────────── IN KIND & PARTNER INFO ─────────── */}
      <section className={`py-16 bg-white border-t border-border transition-all duration-300 ${activeForm ? 'opacity-50 pointer-events-none hidden' : 'opacity-100 block'}`}>
        <div className="container-page grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-extrabold text-navy mb-4 flex items-center gap-2"><Package className="text-coral" /> {data.inkind_title}</h3>
            <p className="text-text-mid mb-4">{data.inkind_description}</p>
            <ul className="list-disc list-inside text-sm text-navy font-medium space-y-2 mb-6">
              {data.inkind_bullets.map((bullet: any, idx: number) => (
                <li key={idx}>{bullet.text}</li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={() => { setActiveForm('goods'); scrollToSection('ways-to-help'); }} variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white form-trigger-btn">
                {data.inkind_button_1_label}
              </Button>
              <Button asChild variant="outline" className="border-coral text-coral hover:bg-coral hover:text-white">
                <a href={data.inkind_button_2_link} target="_blank" rel="noopener noreferrer">{data.inkind_button_2_label}</a>
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-navy mb-4 flex items-center gap-2"><Briefcase className="text-coral" /> {data.partner_title}</h3>
            <p className="text-text-mid mb-4">{data.partner_description}</p>
            <ul className="list-disc list-inside text-sm text-navy font-medium space-y-2 mb-6">
              {data.partner_bullets.map((bullet: any, idx: number) => (
                <li key={idx}>{bullet.text}</li>
              ))}
            </ul>
            <Button type="button" onClick={() => { setActiveForm('partner'); scrollToSection('ways-to-help'); }} variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white form-trigger-btn">{data.partner_button_label}</Button>
            <p className="text-xs text-text-mid mt-4 italic">{data.partner_footer}</p>
          </div>
        </div>
      </section>

      {/* ─────────── SEND AN ECARD ─────────── */}
      <section className="py-20 md:py-24 bg-warm-gray border-t border-border">
        <div className="container-page max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="eyebrow flex justify-center items-center gap-2 mb-4"><Mail className="w-5 h-5 text-coral" /> {data.ecard_eyebrow}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy mb-6">{data.ecard_title}</h2>
            <p className="text-lg text-text-mid leading-relaxed font-medium max-w-3xl mx-auto">
              {data.ecard_description}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {data.ecard_steps.map((step: any, idx: number) => (
              <div key={idx} className="bg-white rounded-2xl p-8 border border-border shadow-sm text-center">
                <h4 className="text-xl font-extrabold text-navy mb-3">{step.title}</h4>
                <p className="text-sm text-text-mid font-medium">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-12 border border-border shadow-soft text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-extrabold text-navy mb-4">{data.ecard_summary_title}</h3>
            <ul className="text-lg text-text-mid font-medium space-y-2 mb-8 list-none">
              {data.ecard_summary_bullets.map((bullet: any, idx: number) => (
                <li key={idx}>{bullet.text}</li>
              ))}
            </ul>
            <p className="text-xl font-bold text-coral mb-8 whitespace-pre-line">{data.ecard_summary_callout}</p>
            
            <Button asChild size="lg" className="bg-coral hover:bg-coral-light text-white font-bold h-14 px-10 text-lg shadow-warm">
              <a href={data.ecard_button_link} target="_blank" rel="noopener noreferrer">{data.ecard_button_label}</a>
            </Button>
          </div>
        </div>
      </section>

      {/* ─────────── CTA FOOTER ─────────── */}
      <section className="py-20  bg-coral text-white text-center">
        <div className="container-page max-w-4xl mx-auto">
          <Heart className="mx-auto h-12 w-12 text-white/90 mb-6" />
          <h2 className="text-3xl md:text-4xl font-extrabold !text-white mb-6">{data.cta_title}</h2>
          <p className="text-lg text-white/90 mb-10 max-w-3xl mx-auto">
            {data.cta_description}
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 px-4 sm:px-0">
            <Button size="lg" onClick={handleDonateClick} className="w-full sm:w-auto bg-white hover:bg-gray-100 text-coral font-bold h-14 px-8">
              {data.cta_btn_1_label}
            </Button>

            <Button size="lg" variant="outline" type="button" onClick={() => { setActiveForm('volunteer'); scrollToSection('ways-to-help'); }} className="w-full sm:w-auto form-trigger-btn border-2 border-white text-white hover:bg-white hover:text-navy bg-transparent font-bold h-14 px-6">
              {data.cta_btn_2_label}
            </Button>

            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-navy bg-transparent font-bold h-14 px-6">
              {data.cta_btn_3_link.startsWith('http') ? (
                <a href={data.cta_btn_3_link} target="_blank" rel="noopener noreferrer">{data.cta_btn_3_label}</a>
              ) : (
                <Link to={data.cta_btn_3_link}>{data.cta_btn_3_label}</Link>
              )}
            </Button>

            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-navy bg-transparent font-bold h-14 px-6">
              <a href={data.cta_btn_4_link} target="_blank" rel="noopener noreferrer">{data.cta_btn_4_label}</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default GetInvolved;