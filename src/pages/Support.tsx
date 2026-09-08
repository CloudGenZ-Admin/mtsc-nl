import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMtscnlSupportPageLive } from "@/hooks/usePayloadLive";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Ship, Home, Heart, MapPin, HeartHandshake, Phone, Globe, CheckCircle2, X, ExternalLink,
  Bus, BookHeart
} from "lucide-react";

import lounge from "@/assets/Algoma-Bear-Visit-21.avif";
import heroBg from "@/assets/SaintJohnport.jpg"; 
import religiousImg from "@/assets/religiousservice.webp";
import transportImg from "@/assets/Transportation Assistance.jpg";

// ==========================================
// FORM COMPONENTS (Left 100% Intact as Requested)
// ==========================================

interface FormProps {
  onClose: () => void;
}

const ShipVisitForm = ({ onClose }: FormProps) => {
  const [form, setForm] = useState({ 
    firstName: "", lastName: "", role: "", shipName: "", portLocation: "", 
    arrivalDate: "", crewCount: "", supportInterests: [] as string[], 
    supportOther: "", preferredDateTime: "", contactMethod: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supportOptions = [
    'Friendly visit and conversation', 
    'Practical assistance (e.g., SIM cards, transport info)', 
    'Spiritual support / prayer',
    'Welfare needs (e.g., supplies, contact family)', 
    'Other'
  ];

  const handleCheckboxChange = (interest: string) => {
    setForm(prev => ({
      ...prev,
      supportInterests: prev.supportInterests.includes(interest)
        ? prev.supportInterests.filter(i => i !== interest)
        : [...prev.supportInterests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfok1ZXI3M88lnpid0RW8o_3FKyKkJnzVMt8MqgJmFBN87wzA/formResponse";
    const formData = new URLSearchParams();

    if (form.firstName) formData.append("entry.594071822", form.firstName);
    if (form.lastName) formData.append("entry.1077362527", form.lastName);
    if (form.role) formData.append("entry.1920683143", form.role);
    if (form.shipName) formData.append("entry.1633043583", form.shipName);
    if (form.portLocation) formData.append("entry.1078866099", form.portLocation);
    if (form.arrivalDate) formData.append("entry.1052638757", form.arrivalDate);
    if (form.crewCount) formData.append("entry.1220835606", form.crewCount);

    form.supportInterests.forEach(interest => {
      if (interest === 'Other' && form.supportOther) {
        formData.append("entry.1345349579", "__other_option__");
        formData.append("entry.1345349579.other_option_response", form.supportOther);
      } else {
        formData.append("entry.1345349579", interest);
      }
    });

    if (form.preferredDateTime) {
      formData.append("entry.402214578", form.preferredDateTime);
    }
    
    if (form.contactMethod) formData.append("entry.59853682", form.contactMethod);

    try {
      await fetch(formUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      
      toast({ title: "Ship Visit Requested", description: "Thank you for reaching out! Our team will connect with you soon." });
      setForm({ firstName: "", lastName: "", role: "", shipName: "", portLocation: "", arrivalDate: "", crewCount: "", supportInterests: [], supportOther: "", preferredDateTime: "", contactMethod: "" });
      onClose();
    } catch (error) {
      toast({ title: "Submission Error", description: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-warm-gray p-6 md:p-8 shadow-card space-y-5 animate-in fade-in slide-in-from-bottom-4 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ship className="h-6 w-6 text-coral" />
          <h3 className="text-xl font-extrabold text-navy">Ship visit</h3>
        </div>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-coral transition-colors" aria-label="Close form">
          <X className="h-6 w-6" />
        </button>
      </div>
      <p className="text-sm text-text-mid mt-1">Connecting Seafarers with Support in Newfoundland and Labrador</p>
      
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div className="sm:col-span-2 mt-2"><Label className="font-bold text-navy">Name *</Label></div>
        <div><Label>First name</Label><Input required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="mt-1.5 bg-white" /></div>
        <div><Label>Last name</Label><Input required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="mt-1.5 bg-white" /></div>
        
        <div className="sm:col-span-2"><Label>Role/Position Onboard *</Label><Input required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="mt-1.5 bg-white" /></div>
        <div className="sm:col-span-2"><Label>Ship Name / Vessel *</Label><Input required value={form.shipName} onChange={e => setForm({ ...form, shipName: e.target.value })} className="mt-1.5 bg-white" /></div>
        <div className="sm:col-span-2"><Label>Port / Berth Location *</Label><Input required value={form.portLocation} onChange={e => setForm({ ...form, portLocation: e.target.value })} className="mt-1.5 bg-white" /></div>
        
        <div><Label>Estimated Date of Arrival *</Label><Input type="date" required value={form.arrivalDate} onChange={e => setForm({ ...form, arrivalDate: e.target.value })} className="mt-1.5 bg-white" /></div>
        <div><Label>Number of Crew Members Onboard</Label><Input type="number" value={form.crewCount} onChange={e => setForm({ ...form, crewCount: e.target.value })} className="mt-1.5 bg-white" /></div>

        <div className="sm:col-span-2 mt-2">
          <Label className="mb-3 block font-bold text-navy">What kind of support are you hoping for? (Select all that apply)</Label>
          <div className="grid sm:grid-cols-2 gap-3">
            {supportOptions.map((interest) => (
              <label key={interest} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-border">
                <input type="checkbox" checked={form.supportInterests.includes(interest)} onChange={() => handleCheckboxChange(interest)} className="w-4 h-4 text-coral border-gray-300 rounded focus:ring-coral" />
                <span className="text-sm text-navy font-medium">{interest}</span>
              </label>
            ))}
          </div>
          {form.supportInterests.includes('Other') && (
            <Input className="mt-3 bg-white" placeholder="Other (Please specify)" value={form.supportOther} onChange={e => setForm({...form, supportOther: e.target.value})} />
          )}
        </div>

        <div><Label>Preferred Date/Time for Visit</Label><Input type="date" value={form.preferredDateTime} onChange={e => setForm({ ...form, preferredDateTime: e.target.value })} className="mt-1.5 bg-white" /></div>
        <div><Label>Best Way To Reach You (Email/phone)</Label><Input value={form.contactMethod} onChange={e => setForm({ ...form, contactMethod: e.target.value })} placeholder="Email or Phone number here" className="mt-1.5 bg-white" /></div>
      </div>
      
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full bg-coral hover:bg-coral-light text-white font-bold h-12 mt-4">
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};

const SeafarersCentreForm = ({ onClose }: FormProps) => {
  const [form, setForm] = useState({ 
    firstName: "", lastName: "", email: "", shipName: "", visitDate: "", 
    visitorCount: "", services: [] as string[], servicesOther: "", transportAssistance: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceOptions = [
    'Free Wi-Fi & Phone Charging', 'Lounge with Snacks & Drinks', 
    'Local Information & Support', 'Friendly Conversation / Assistance', 'Other'
  ];

  const handleServiceChange = (service: string) => {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSecH3r9gEfMk9aP7qq-p5zyPqLarGHD3TpTgydxSaV_Vemmlg/formResponse";
    const formData = new URLSearchParams();

    if (form.firstName) formData.append("entry.1424198996", form.firstName);
    if (form.lastName) formData.append("entry.289806566", form.lastName);
    if (form.email) formData.append("entry.161040312", form.email);
    if (form.shipName) formData.append("entry.1028552249", form.shipName);
    if (form.visitDate) formData.append("entry.1334600406", form.visitDate);
    if (form.visitorCount) formData.append("entry.1425073945", form.visitorCount);

    form.services.forEach(service => {
      if (service === 'Other' && form.servicesOther) {
        formData.append("entry.854101858", "__other_option__");
        formData.append("entry.854101858.other_option_response", form.servicesOther);
      } else {
        formData.append("entry.854101858", service);
      }
    });

    if (form.transportAssistance) formData.append("entry.457678180", form.transportAssistance);

    try {
      await fetch(formUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      
      toast({ title: "Visit Planned", description: "We look forward to welcoming you to the Seafarers' Centre!" });
      setForm({ firstName: "", lastName: "", email: "", shipName: "", visitDate: "", visitorCount: "", services: [], servicesOther: "", transportAssistance: "" });
      onClose();
    } catch (error) {
      toast({ title: "Submission Error", description: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-warm-gray p-6 md:p-8 shadow-card space-y-5 animate-in fade-in slide-in-from-bottom-4 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Home className="h-6 w-6 text-coral" />
          <h3 className="text-xl font-extrabold text-navy">Seafarers’ Centre ship visit form</h3>
        </div>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-coral transition-colors" aria-label="Close form">
          <X className="h-6 w-6" />
        </button>
      </div>
      <p className="text-sm text-text-mid mt-1">A Welcoming Haven for Rest and Connection.</p>
      
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div className="sm:col-span-2 mt-2"><Label className="font-bold text-navy">Name *</Label></div>
        <div><Label>First name</Label><Input required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="mt-1.5 bg-white" /></div>
        <div><Label>Last name</Label><Input required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="mt-1.5 bg-white" /></div>
        
        <div><Label>Email *</Label><Input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1.5 bg-white" /></div>
        <div><Label>Ship Name / Vessel *</Label><Input required value={form.shipName} onChange={e => setForm({ ...form, shipName: e.target.value })} className="mt-1.5 bg-white" /></div>
        
        <div><Label>Estimated Date of Visit</Label><Input type="date" value={form.visitDate} onChange={e => setForm({ ...form, visitDate: e.target.value })} className="mt-1.5 bg-white" /></div>
        <div><Label>Estimated Number of Visitors</Label><Input type="number" value={form.visitorCount} onChange={e => setForm({ ...form, visitorCount: e.target.value })} className="mt-1.5 bg-white" /></div>

        <div className="sm:col-span-2 mt-2">
          <Label className="mb-3 block font-bold text-navy">Services You’re Interested In (Select all that apply)</Label>
          <div className="grid sm:grid-cols-2 gap-3">
            {serviceOptions.map((service) => (
              <label key={service} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-border">
                <input type="checkbox" checked={form.services.includes(service)} onChange={() => handleServiceChange(service)} className="w-4 h-4 text-coral border-gray-300 rounded focus:ring-coral" />
                <span className="text-sm text-navy font-medium">{service}</span>
              </label>
            ))}
          </div>
          {form.services.includes('Other') && (
            <Input className="mt-3 bg-white" placeholder="Other (Please specify)" value={form.servicesOther} onChange={e => setForm({...form, servicesOther: e.target.value})} />
          )}
        </div>

        <div className="sm:col-span-2">
          <Label className="font-bold text-navy">Would you like transportation assistance to the Centre?</Label>
          <select value={form.transportAssistance} onChange={e => setForm({ ...form, transportAssistance: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-1.5">
            <option value="" disabled>Select...</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>
      
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full bg-coral hover:bg-coral-light text-white font-bold h-12 mt-4">
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};

const TransportationForm = ({ onClose }: FormProps) => {
  const [form, setForm] = useState({ 
    name: "", lastName: "", vessel: "", destination: [] as string[], 
    destinationOthers: "", timePreferred: "", timePreferredSpecify: "", groupSize: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const destinationOptions = ['Grocery Store', 'Pharmacy', 'Mall'];
  
  const timeOptions = [
    'Early Morning (5:00 AM – 8:00 AM)',
    'Morning (8:00 AM – 12:00 PM)',
    'Afternoon (12:00 PM – 3:00 PM)',
    'Late Afternoon (3:00 PM – 5:00 PM)',
    'Evening (5:00 PM – 8:00 PM)',
    'Night (8:00 PM – 11:00 PM)',
    'Other / Specify Time(Specify in Notes)'
  ];

  const handleDestChange = (dest: string) => {
    setForm(prev => ({
      ...prev,
      destination: prev.destination.includes(dest)
        ? prev.destination.filter(d => d !== dest)
        : [...prev.destination, dest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLScM6mQgDkPqTZTvvSAWbIcT_LE9mGRCH7JkULaAE1FCWyC1yA/formResponse";
    const formData = new URLSearchParams();

    // Exact field mappings based on provided screenshots
    if (form.name) formData.append("entry.2014192505", form.name);
    if (form.lastName) formData.append("entry.27574850", form.lastName);
    if (form.vessel) formData.append("entry.1319008399", form.vessel);
    
    // Checkboxes for Destination
    form.destination.forEach(dest => {
      formData.append("entry.903172900", dest);
    });

    if (form.destinationOthers) formData.append("entry.1484568363", form.destinationOthers);
    if (form.timePreferred) formData.append("entry.234299714", form.timePreferred);
    if (form.timePreferredSpecify) formData.append("entry.1061872894", form.timePreferredSpecify);
    if (form.groupSize) formData.append("entry.860678818", form.groupSize);

    try {
      await fetch(formUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      
      toast({ title: "Request Sent", description: "Your transportation request has been received!" });
      setForm({ name: "", lastName: "", vessel: "", destination: [], destinationOthers: "", timePreferred: "", timePreferredSpecify: "", groupSize: "" });
      onClose();
    } catch (error) {
      toast({ title: "Submission Error", description: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-warm-gray p-6 md:p-8 shadow-card space-y-5 animate-in fade-in slide-in-from-bottom-4 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bus className="h-6 w-6 text-coral" />
          <h3 className="text-xl font-extrabold text-navy">Transportation Assistance</h3>
        </div>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-coral transition-colors" aria-label="Close form">
          <X className="h-6 w-6" />
        </button>
      </div>
      <p className="text-sm text-text-mid mt-1">Making Your Time in Port Easier.</p>
      
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1.5 bg-white" /></div>
        <div><Label>Last Name</Label><Input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="mt-1.5 bg-white" /></div>
        
        <div className="sm:col-span-2"><Label>Ship Name / Vessel</Label><Input value={form.vessel} onChange={e => setForm({ ...form, vessel: e.target.value })} className="mt-1.5 bg-white" /></div>

        <div className="sm:col-span-2 mt-2">
          <Label className="mb-3 block font-bold text-navy">Destination</Label>
          <div className="grid sm:grid-cols-3 gap-3">
            {destinationOptions.map((dest) => (
              <label key={dest} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-border">
                <input type="checkbox" checked={form.destination.includes(dest)} onChange={() => handleDestChange(dest)} className="w-4 h-4 text-coral border-gray-300 rounded focus:ring-coral" />
                <span className="text-sm text-navy font-medium">{dest}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2"><Label>Destination (others)</Label><Input value={form.destinationOthers} onChange={e => setForm({ ...form, destinationOthers: e.target.value })} className="mt-1.5 bg-white" /></div>

        <div className="sm:col-span-2 mt-2">
          <Label className="mb-2 block font-bold text-navy">Time Preferred</Label>
          <select value={form.timePreferred} onChange={e => setForm({ ...form, timePreferred: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-1.5">
            <option value="" disabled>Select Time Preferred</option>
            {timeOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2"><Label>Time Preferred (Specify)</Label><Input value={form.timePreferredSpecify} onChange={e => setForm({ ...form, timePreferredSpecify: e.target.value })} className="mt-1.5 bg-white" /></div>
        <div className="sm:col-span-2"><Label>Group size (if applicable)</Label><Input value={form.groupSize} onChange={e => setForm({ ...form, groupSize: e.target.value })} className="mt-1.5 bg-white" /></div>
      </div>
      
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full bg-coral hover:bg-coral-light text-white font-bold h-12 mt-4">
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};

const ReligiousServicesForm = ({ onClose }: FormProps) => {
  const [form, setForm] = useState({ 
    name: "", lastname: "", vessel: "", faith: "", faithOthers: "", doYouNeed: "", dateTime: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faithOptions = [
    'Christianity', 'Islam', 'Hinduism', 'Buddhism', 'Sikhism', 'Judaism', 
    'Bahá\'í Faith', 'Jainism', 'Shinto', 'Taoism (Daoism)', 
    'African Traditional Religions', 'Indigenous Spirituality', 
    'No Religion / Atheist', 'Agnostic', 'Other:'
  ];
  
  const needOptions = ['Transport to service', 'Prayer space onboard'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSc4JWN5wBghTEvLH0ExW6PxTQKyDtAp8vSjdHoiKYiJAQnbyg/formResponse";
    const formData = new URLSearchParams();

    // Exact mappings based on screenshots
    if (form.name) formData.append("entry.761126395", form.name);
    if (form.lastname) formData.append("entry.1099797967", form.lastname);
    if (form.vessel) formData.append("entry.719476341", form.vessel);
    
    if (form.faith === 'Other:') {
      formData.append("entry.271917750", "__other_option__");
      // Populate native Google "Other" value (fallback just in case)
      if (form.faithOthers) {
        formData.append("entry.271917750.other_option_response", form.faithOthers);
      }
    } else if (form.faith) {
      formData.append("entry.271917750", form.faith);
    }

    // Submit to explicit separate field requested
    if (form.faithOthers) formData.append("entry.1278130571", form.faithOthers);
    
    if (form.doYouNeed) formData.append("entry.1007152570", form.doYouNeed);
    if (form.dateTime) formData.append("entry.702244614", form.dateTime);

    try {
      await fetch(formUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      
      toast({ title: "Request Sent", description: "Your spiritual support request has been received." });
      setForm({ name: "", lastname: "", vessel: "", faith: "", faithOthers: "", doYouNeed: "", dateTime: "" });
      onClose();
    } catch (error) {
      toast({ title: "Submission Error", description: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-warm-gray p-6 md:p-8 shadow-card space-y-5 animate-in fade-in slide-in-from-bottom-4 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookHeart className="h-6 w-6 text-coral" />
          <h3 className="text-xl font-extrabold text-navy">Religious Services</h3>
        </div>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-coral transition-colors" aria-label="Close form">
          <X className="h-6 w-6" />
        </button>
      </div>
      <p className="text-sm text-text-mid mt-1">Spiritual Support for All Beliefs.</p>
      
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1.5 bg-white" /></div>
        <div><Label>Lastname</Label><Input value={form.lastname} onChange={e => setForm({ ...form, lastname: e.target.value })} className="mt-1.5 bg-white" /></div>
        
        <div className="sm:col-span-2"><Label>Ship Name / Vessel</Label><Input value={form.vessel} onChange={e => setForm({ ...form, vessel: e.target.value })} className="mt-1.5 bg-white" /></div>

        <div className="sm:col-span-2 mt-2">
          <Label className="mb-2 block font-bold text-navy">Faith / Worship Preference</Label>
          <select value={form.faith} onChange={e => setForm({ ...form, faith: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-1.5">
            <option value="" disabled>Select Preference</option>
            {faithOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2"><Label>Faith / Worship Preference (others)</Label><Input value={form.faithOthers} onChange={e => setForm({ ...form, faithOthers: e.target.value })} className="mt-1.5 bg-white" /></div>

        <div className="sm:col-span-2 mt-2">
          <Label className="mb-2 block font-bold text-navy">Do you need</Label>
          <select value={form.doYouNeed} onChange={e => setForm({ ...form, doYouNeed: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-1.5">
            <option value="" disabled>Select Option</option>
            {needOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2"><Label>Date/time preferred</Label><Input type="text" value={form.dateTime} onChange={e => setForm({ ...form, dateTime: e.target.value })} className="mt-1.5 bg-white" /></div>
      </div>
      
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full bg-coral hover:bg-coral-light text-white font-bold h-12 mt-4">
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};

const MentalHealthForm = ({ onClose }: FormProps) => {
  const [form, setForm] = useState({ 
    name: "", contactInfo: "", vessel: "", contactPreference: "", urgency: "", details: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfaOMpp9EAa91Oj2hP_VJvfPzGlSJSYx5uFx9shiLf-h-nk9A/formResponse";
    const formData = new URLSearchParams();

    if (form.name) formData.append("entry.2124010631", form.name);
    if (form.contactInfo) formData.append("entry.7026268", form.contactInfo);
    if (form.vessel) formData.append("entry.161302826", form.vessel);
    if (form.contactPreference) formData.append("entry.2105483593", form.contactPreference);
    if (form.urgency) formData.append("entry.1864206089", form.urgency);
    if (form.details) formData.append("entry.2040256631", form.details);

    try {
      await fetch(formUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      
      toast({ title: "Request Sent", description: "Your secure request has been received. Support is on the way." });
      setForm({ name: "", contactInfo: "", vessel: "", contactPreference: "", urgency: "", details: "" });
      onClose();
    } catch (error) {
      toast({ title: "Submission Error", description: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-warm-gray p-6 md:p-8 shadow-card space-y-5 animate-in fade-in slide-in-from-bottom-4 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HeartHandshake className="h-6 w-6 text-coral" />
          <h3 className="text-xl font-extrabold text-navy">Mental Health & Crisis Support</h3>
        </div>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-coral transition-colors" aria-label="Close form">
          <X className="h-6 w-6" />
        </button>
      </div>
      <p className="text-sm text-text-mid mt-1">This request is strictly confidential. You do not have to face challenges alone.</p>
      
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div className="sm:col-span-2 mt-2"><Label className="font-bold text-navy">Name *</Label></div>
        <div className="sm:col-span-2"><Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" className="mt-1.5 bg-white" /></div>
        
        <div><Label>Contact Information (Email/Phone) *</Label><Input required value={form.contactInfo} onChange={e => setForm({ ...form, contactInfo: e.target.value })} className="mt-1.5 bg-white" /></div>
        <div><Label>Ship Name / Vessel</Label><Input value={form.vessel} onChange={e => setForm({ ...form, vessel: e.target.value })} className="mt-1.5 bg-white" /></div>

        <div>
          <Label className="font-bold text-navy">Preferred Contact Method</Label>
          <select value={form.contactPreference} onChange={e => setForm({ ...form, contactPreference: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-1.5">
            <option value="" disabled>Select...</option>
            <option value="Phone">Phone</option>
            <option value="Email">Email</option>
            <option value="WhatsApp">WhatsApp</option>
          </select>
        </div>

        <div>
          <Label className="font-bold text-navy">Urgency</Label>
          <select value={form.urgency} onChange={e => setForm({ ...form, urgency: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-1.5">
            <option value="" disabled>Select...</option>
            <option value="Immediate">Immediate</option>
            <option value="Within 24 Hours">Within 24 Hours</option>
            <option value="Within a few days">Within a few days</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <Label>Details / How can we support you?</Label>
          <textarea 
            value={form.details} 
            onChange={e => setForm({ ...form, details: e.target.value })} 
            className="flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-1.5 resize-y"
            placeholder="Please briefly describe your situation..."
          />
        </div>
      </div>
      
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full bg-coral hover:bg-coral-light text-white font-bold h-12 mt-4">
        {isSubmitting ? "Submitting..." : "Reach Out for Support"}
      </Button>
    </form>
  );
};


// ==========================================
// MAIN COMPONENT & CMS INTEGRATION
// ==========================================

const iconMap: Record<string, any> = {
  Ship,
  Home,
  HeartHandshake,
  Globe,
};

const defaultData = {
  hero_badge: 'For Seafarers',
  hero_title: 'Support While You’re at Port',
  hero_subtitle: 'Wherever you’re from, you are welcome here. We’re here to support you with practical help, connection and care while you’re in Newfoundland and Labrador.',
  quick_access_title: 'How Can We Support You Today?',
  quick_access_cards: [
    { id: 'visit', icon: 'Ship', title: 'Ship Visits', desc: 'Connect Us Today', isLink: false, isExternal: false, link: '' },
    { id: 'centre', icon: 'Home', title: 'Seafarers’ Centre', desc: 'Come visit us', isLink: false, isExternal: false, link: '' },
    { id: 'mental', icon: 'HeartHandshake', title: 'Mental Health Support', desc: 'Reach Out for Support', isLink: false, isExternal: false, link: '' },
    { id: 'explore', icon: 'Globe', title: 'Explore NL', desc: 'An Adventure Awaits', isLink: true, isExternal: true, link: 'https://www.newfoundlandlabrador.com/' }
  ],
  centre_title: 'Seafarers’ Centre',
  centre_subtitle: 'A Welcoming Haven for Rest and Connection',
  centre_description: 'Our Seafarers’ Centre is a safe, welcoming space designed to help seafarers relax, recharge, and connect with loved ones. When you come ashore, you can access a variety of services, including',
  centre_bullets: [
    { text: 'Free Wi-Fi and phone charging' },
    { text: 'Comfortable lounge with snacks and drinks' },
    { text: 'Friendly volunteers available to assist' },
    { text: 'Local info and support resources on hand' }
  ],
  centre_button: 'Come visit us',
  transport_title: 'Transportation Assistance',
  transport_subtitle: 'Making Your Time in Port Easier',
  transport_desc_1: 'Whether you’re staying on board or able to go ashore, our transportation assistance ensures your time in port is as comfortable as possible.',
  transport_bullets: [
    { text: 'If you can’t leave the ship, our volunteers can shop for essentials (SIM cards, toiletries, snacks) and deliver them directly to your vessel' },
    { text: 'If you’re able to go ashore, we can assist with transportation to nearby stores, pharmacies, or other locations to help you get what you need' }
  ],
  transport_desc_2: 'We strive to provide fast, friendly, and reliable service to make your visit as stress-free as possible.',
  transport_button: 'Request Transportation',
  ship_title: 'Ship Visits',
  ship_subtitle: 'Connecting Seafarers with Support in Newfoundland and Labrador',
  ship_description: 'At Mission to Seafarers Newfoundland and Labrador, we are committed to visiting every ship that arrives at our ports. Seafarers often face long voyages with limited access to support during their time in port. Our ship visits provide a vital connection by offering a friendly face, a listening ear, and practical assistance. These visits bridge the gap between life at sea and the world ashore, reminding seafarers that they are seen, valued, and cared for.',
  ship_callout: 'If you would like to learn more about our ship visit program or request a visit to your vessel, we would be happy to connect with you.',
  ship_button: 'Connect Us Today',
  religion_title: 'Religious Services',
  religion_subtitle: 'Spiritual Support for All Beliefs',
  religion_description: 'Our chaplain is available to provide spiritual care, regardless of your faith tradition. Whether you seek Anglican, Catholic, Orthodox, or multi-faith services, we are here to support you. We also offer:',
  religion_bullets: [
    { text: 'Spiritual care and prayer are available upon request' },
    { text: 'Quiet space for personal reflection' },
    { text: 'Faith-based support for all beliefs' }
  ],
  religion_button: 'Let Us Connect with You',
  mental_title: 'Mental Health & Crisis Resources',
  mental_subtitle: 'Your Well-being is Our Priority',
  mental_description: 'Life at sea can be stressful, and our Mental Health & Crisis Resources provide confidential emotional and mental health support to seafarers in need:',
  mental_bullets: [
    { text: 'Pastoral care and emotional support from our trained team' },
    { text: 'Referrals to local mental health services and global seafarer support partners' },
    { text: 'Emergency crisis resources available 24/7' }
  ],
  mental_callout: 'You do not have to face challenges alone support is always available when you need it most.',
  mental_button: 'Reach Out for Support',
  explore_title: 'Explore Newfoundland & Labrador',
  explore_subtitle: 'An Adventure Awaits',
  explore_description: 'Newfoundland and Labrador offer unforgettable natural beauty, historic towns, and warm local hospitality. When you have time ashore, take the opportunity to explore our rugged coastlines, scenic landscapes, and vibrant culture.',
  explore_button: 'Explore Now',
  explore_link: 'https://www.newfoundlandlabrador.com/',
  explore_map_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2690.250901896602!2d-52.69271455!3d47.601810799999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4b0ca148b3fca06f%3A0xbca2e587c54ade57!2sSt.%20John&#39;s%2C%20NL%20A1A%205N8%2C%20Canada!5e0!3m2!1sen!2sin!4v1780888530650!5m2!1sen!2sin'
};

const Support = () => {
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const { data: rawData } = useMtscnlSupportPageLive();
  const data = rawData ? { ...defaultData, ...rawData } : defaultData;
  const formContainerRef = useRef<HTMLDivElement>(null);

  const handleCloseForm = () => setActiveForm(null);

  const renderActiveForm = () => {
    switch (activeForm) {
      case 'visit': return <ShipVisitForm onClose={handleCloseForm} />;
      case 'centre': return <SeafarersCentreForm onClose={handleCloseForm} />;
      case 'transport': return <TransportationForm onClose={handleCloseForm} />;
      case 'religion': return <ReligiousServicesForm onClose={handleCloseForm} />;
      case 'mental': return <MentalHealthForm onClose={handleCloseForm} />;
      default: return null;
    }
  };

  // Resolve Images: CMS -> Local Fallback
  const resolvedHeroBg = data?.hero_background_image?.url || heroBg;
  const resolvedCentreImg = data?.centre_image?.url || lounge;
  const resolvedTransportImg = data?.transport_image?.url || transportImg;
  const resolvedReligionImg = data?.religion_image?.url || religiousImg;

  return (
    <>
      {/* 1. Hero Section */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-navy min-h-[45vh] flex items-center justify-center border-b border-navy-dark">
        <div className="absolute inset-0 z-0">
          <img 
            src={resolvedHeroBg} 
            alt="Seafarer Support Background" 
            className="w-full h-full object-cover object-center opacity-40 mix-blend-overlay" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy/60 to-transparent" />
        </div>
        
        <div className="container-page relative z-10 text-center max-w-4xl mx-auto">
          <div className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral/20 text-coral-light text-xs font-extrabold uppercase tracking-widest border border-coral/30">
              <Ship className="w-4 h-4 text-coral-light" /> {data.hero_badge}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            {data.hero_title}
          </h1>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed font-medium">
           {data.hero_subtitle}
          </p>
        </div>
      </section>

      {/* 2. Quick Access */}
      <section id="quick-access" className="py-20 bg-white scroll-mt-10">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy">{data.quick_access_title}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {data.quick_access_cards.map((card: any) => {
              const IconComponent = iconMap[card.icon] || Ship;
              
              if (card.isLink && card.isExternal) {
                return (
                  <a
                    key={card.id}
                    href={card.link}
                    target="_blank"
                    rel="noreferrer"
                    className="p-6 rounded-2xl border text-left transition-all hover:shadow-card hover:-translate-y-1 flex flex-col items-start border-border bg-white cursor-pointer group"
                  >
                    <div className="flex w-full items-start justify-between">
                      <IconComponent className="h-10 w-10 mb-4 text-navy" />
                      <ExternalLink className="h-5 w-5 text-text-mid opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="font-bold text-navy text-lg mb-2">{card.title}</h3>
                    <p className="text-sm text-text-mid font-medium">{card.desc}</p>
                  </a>
                );
              }

              if (card.isLink && !card.isExternal) {
                return (
                  <Link
                    key={card.id}
                    to={card.link || "#"}
                    className="p-6 rounded-2xl border text-left transition-all hover:shadow-card hover:-translate-y-1 flex flex-col items-start border-border bg-white cursor-pointer group"
                  >
                    <div className="flex w-full items-start justify-between">
                      <IconComponent className="h-10 w-10 mb-4 text-navy" />
                    </div>
                    <h3 className="font-bold text-navy text-lg mb-2">{card.title}</h3>
                    <p className="text-sm text-text-mid font-medium">{card.desc}</p>
                  </Link>
                );
              }
              
              return (
                <button
                  key={card.id}
                  onClick={() => {
                    setActiveForm(card.id);
                    setTimeout(() => {
                      formContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 100);
                  }}
                  className={`p-6 rounded-2xl border text-left transition-all hover:shadow-card hover:-translate-y-1 flex flex-col items-start ${activeForm === card.id ? "border-coral bg-coral-pale ring-1 ring-coral" : "border-border bg-white"
                    }`}
                >
                  <IconComponent className={`h-10 w-10 mb-4 ${activeForm === card.id ? "text-coral" : "text-navy"}`} />
                  <h3 className="font-bold text-navy text-lg mb-2">{card.title}</h3>
                  <p className="text-sm text-text-mid font-medium">{card.desc}</p>
                </button>
              );
            })}
          </div>

          <div ref={formContainerRef} className="max-w-3xl mx-auto scroll-mt-20">
            {renderActiveForm()}
          </div>
        </div>
      </section>

      {/* 3. Seafarers' Centre */}
      <section className="py-20 bg-warm-gray">
        <div className="container-page grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="rounded-3xl overflow-hidden shadow-soft aspect-[5/4]">
            <img src={resolvedCentreImg} alt="Seafarers lounge" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy leading-tight">
              {data.centre_title}
            </h2>
            <p className="mt-2 text-xl font-bold text-coral">{data.centre_subtitle}</p>
            <p className="mt-5 text-lg text-text-mid font-medium leading-relaxed">
              {data.centre_description}
            </p>
            <ul className="mt-6 space-y-4">
              {data.centre_bullets.map((bullet: any, idx: number) => (
                <li key={idx} className="flex gap-4 items-center">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-coral/10 text-coral">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <span className="text-navy font-bold text-lg">{bullet.text}</span>
                </li>
              ))}
            </ul>
            <Button className="mt-8 bg-coral hover:bg-coral-light text-white font-bold h-12 px-8" onClick={() => { setActiveForm('centre'); document.getElementById('quick-access')?.scrollIntoView({ behavior: 'smooth' }); }}>
              {data.centre_button}
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Transportation Assistance */}
      <section className="py-20 bg-white">
        <div className="container-page grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy leading-tight">
              {data.transport_title}
            </h2>
            <p className="mt-2 text-xl font-bold text-coral">{data.transport_subtitle}</p>
            <p className="mt-5 text-lg text-text-mid font-medium leading-relaxed">
              {data.transport_desc_1}
            </p>
            <ul className="mt-6 space-y-4">
              {data.transport_bullets.map((bullet: any, idx: number) => (
                <li key={idx} className="flex gap-4 items-start">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-coral/10 text-coral mt-1">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <span className="text-navy font-bold text-lg leading-snug">
                    {bullet.text}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-lg text-text-mid font-medium leading-relaxed">
              {data.transport_desc_2}
            </p>
            <Button className="mt-8 bg-coral hover:bg-coral-light text-white font-bold h-12 px-8" onClick={() => { setActiveForm('transport'); document.getElementById('quick-access')?.scrollIntoView({ behavior: 'smooth' }); }}>
              {data.transport_button}
            </Button>
          </div>
          <div className="order-1 lg:order-2 rounded-3xl overflow-hidden shadow-soft aspect-[5/4]">
            <img src={resolvedTransportImg} alt="Transportation Assistance" className="h-full w-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      {/* 5. Ship Visits */}
      <section className="py-20 bg-warm-gray text-center border-y border-border">
        <div className="container-page max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy">{data.ship_title}</h2>
          <p className="text-coral font-bold mt-3 text-xl">{data.ship_subtitle}</p>
          <p className="mt-8 text-lg text-text-mid font-medium leading-relaxed text-left md:text-center">
            {data.ship_description}
          </p>
          <p className="mt-8 text-lg font-bold text-navy flex items-center justify-center gap-2 bg-white shadow-sm py-4 px-6 rounded-full inline-flex border border-border">
            {data.ship_callout}
          </p>
          <div className="mt-8">
            <Button className="bg-coral hover:bg-coral-light text-white font-bold h-12 px-10" onClick={() => { setActiveForm('visit'); document.getElementById('quick-access')?.scrollIntoView({ behavior: 'smooth' }); }}>
              {data.ship_button}
            </Button>
          </div>
        </div>
      </section>

      {/* 6. Religious Services */}
      <section className="py-20 bg-white">
        <div className="container-page grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="rounded-3xl overflow-hidden shadow-soft aspect-[5/4]">
            <img src={resolvedReligionImg} alt="Religious Services" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy leading-tight">
              {data.religion_title}
            </h2>
            <p className="mt-2 text-xl font-bold text-coral">{data.religion_subtitle}</p>
            <p className="mt-5 text-lg text-text-mid font-medium leading-relaxed">
              {data.religion_description}
            </p>
            <ul className="mt-6 space-y-4">
              {data.religion_bullets.map((bullet: any, idx: number) => (
                <li key={idx} className="flex gap-4 items-center">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-coral/10 text-coral">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <span className="text-navy font-bold text-lg">{bullet.text}</span>
                </li>
              ))}
            </ul>
            <Button className="mt-8 bg-coral hover:bg-coral-light text-white font-bold h-12 px-8" onClick={() => { setActiveForm('religion'); document.getElementById('quick-access')?.scrollIntoView({ behavior: 'smooth' }); }}>
              {data.religion_button}
            </Button>
          </div>
        </div>
      </section>

      {/* 7. Mental Health & Crisis Resources */}
      <section className="py-20 bg-navy text-white">
        <div className="container-page text-center">
          <h2 className="text-3xl text-white md:text-4xl font-extrabold mb-4">{data.mental_title}</h2>
          <p className="text-coral-light font-bold text-xl mb-12">{data.mental_subtitle}</p>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 text-left max-w-4xl mx-auto shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <HeartHandshake className="w-48 h-48" />
            </div>
            
            <p className="text-lg font-medium text-white/90 relative z-10 mb-8 leading-relaxed">
              {data.mental_description}
            </p>

            <ul className="space-y-6 text-lg font-medium text-white/90 relative z-10 mb-10">
              {data.mental_bullets.map((bullet: any, idx: number) => {
                const IconComponent = idx === 0 ? Heart : idx === 1 ? MapPin : Phone;
                return (
                  <li key={idx} className="flex items-start gap-4">
                    <IconComponent className="h-7 w-7 text-coral shrink-0" />
                    <span>{bullet.text}</span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 bg-white rounded-2xl p-6 md:p-8 flex flex-col items-center text-center relative z-10 shadow-lg">
              <h4 className="text-2xl font-bold text-navy mb-4">
                {data.mental_callout}
              </h4>
              <button 
                onClick={() => { setActiveForm('mental'); document.getElementById('quick-access')?.scrollIntoView({ behavior: 'smooth' }); }} 
                className="inline-flex items-center justify-center gap-2 bg-coral hover:bg-coral-light text-white px-8 py-4 rounded-full transition-colors font-bold text-lg w-full sm:w-auto mt-4"
              >
                {data.mental_button}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Explore NL */}
      <section className="py-20 bg-white">
        <div className="container-page grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy">{data.explore_title}</h2>
            <p className="text-coral font-bold mt-3 text-xl mb-6">{data.explore_subtitle}</p>
            <p className="text-lg text-text-mid font-medium leading-relaxed mb-8">
              {data.explore_description}
            </p>
            <a href={data.explore_link} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy-light text-white px-8 py-4 rounded-full transition-colors font-bold text-lg">
              {data.explore_button}
            </a>
          </div>
          <div className="aspect-square md:aspect-video lg:aspect-square bg-warm-gray rounded-3xl shadow-soft flex items-center justify-center overflow-hidden border-4 border-white">
            <iframe
              src={data.explore_map_url}
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
};

export default Support;