"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Agentation } from "agentation";
import {
  Add, ArrowDown2, ArrowUp2, Briefcase, Building, Chart, Chart2,
  CloseCircle, Document, DocumentText, DocumentUpload, Edit2, Eye, Filter,
  Global, Lock, Logout, Money, SearchNormal, Setting2, Sms, Sort,
  Tag, Trash, User, Warning2,
} from "iconsax-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  isEmailApproved,
  getApprovedEmails,
  addApprovedEmail,
  removeApprovedEmail,
} from "@/lib/supabaseAuth";
import {
  getAllDeals,
  createDeal,
  updateDeal,
  deleteDeal,
} from "@/lib/supabaseDeals";

// ─── Iconsax outline SVG icons ───────────────
const IC_MAP = {
  arrowDown: ArrowDown2,
  arrowUp:   ArrowUp2,
  briefcase: Briefcase,
  chart:     Chart2,
  close:     CloseCircle,
  document:  Document,
  edit:      Edit2,
  eye:       Eye,
  filter:    Filter,
  lock:      Lock,
  logout:    Logout,
  mail:      Sms,
  money:     Money,
  pdf:       DocumentText,
  plus:      Add,
  search:    SearchNormal,
  settings:  Setting2,
  sortAsc:   Sort,
  tag:       Tag,
  trash:     Trash,
  upload:    DocumentUpload,
  warning:   Warning2,
  user:      User,
  building:  Building,
  globe:     Global,
};

const Ic = ({ name, size = 18, className = "", variant = "Outline" }) => {
  const IconComp = IC_MAP[name];
  if (!IconComp) return null;
  return <IconComp size={size} variant={variant} className={className} />;
};

// ─── Data ────────────────────────────────────
const SEED_DEALS = [
  { id: 1,  entity: "Manet",                                   codeName: "Merchant",    service: "Brokerage",  about: "Commercial and residential real estate brokerage and development firm",           industry: "Real Estate & Property Development",          size: 30000000, ebitda: 4107271,  revenues: 27909992 },
  { id: 2,  entity: "Mava Consulting",                         codeName: "Map",         service: "Funding",    about: "Business consulting firm specializing in healthcare sector advisory",            industry: "Healthcare & Life Sciences",                  size: 21000000, ebitda: 7714437,  revenues: 47877150 },
  { id: 3,  entity: "Equity Savings and Loans",                codeName: "Equestrian",  service: "Consulting", about: "Microfinance institution providing savings and loan services",                   industry: "Financial Services",                          size: 20000000, ebitda: 9546227,  revenues: 40920819 },
  { id: 4,  entity: "Harriben Granite Ltd",                    codeName: "Happy",       service: "Consulting", about: "Granite quarrying and stone extraction company",                                industry: "Mining & Natural Resources",                  size: 10000000, ebitda: 8094359,  revenues: 5386930  },
  { id: 5,  entity: "Velvet",                                  codeName: "Velvet",      service: "Brokerage",  about: "Hospitality company operating restaurants and food service venues",              industry: "Hospitality, Food & Beverage",                size: 7920000,  ebitda: 9592917,  revenues: 7360734  },
  { id: 6,  entity: "D'Avenue",                                codeName: "Dominion",    service: "Brokerage",  about: "Commercial enterprise operating in the hospitality, food & beverage sector",    industry: "Hospitality, Food & Beverage",                size: 6200000,  ebitda: 3176388,  revenues: 28502106 },
  { id: 7,  entity: "Ahafo Pride LTD",                         codeName: "Ahab",        service: "Funding",    about: "Business enterprise providing specialized services",                            industry: "Agriculture, AgriTech & Agro-Processing",     size: 5000000,  ebitda: 7975253,  revenues: 26929529 },
  { id: 8,  entity: "Tans Hostel",                             codeName: "Tulip",       service: "Brokerage",  about: "Commercial enterprise operating in the hospitality, food & beverage sector",    industry: "Hospitality, Food & Beverage",                size: 5000000,  ebitda: 651175,   revenues: 43306410 },
  { id: 9,  entity: "Royal Palm City",                         codeName: "Palm",        service: "Brokerage",  about: "Technology company providing digital solutions and services",                    industry: "Real Estate & Property Development",          size: 5000000,  ebitda: 1359688,  revenues: 7278516  },
  { id: 10, entity: "Ederick - Emerge",                        codeName: "Emerge",      service: "Brokerage",  about: "Commercial enterprise in the trade, manufacturing & consumer goods sector",     industry: "Trade, Manufacturing & Consumer Goods",       size: 5000000,  ebitda: 5667461,  revenues: 10591081 },
  { id: 11, entity: "Merbarproperties",                        codeName: "Marble",      service: "Funding",    about: "Commercial enterprise in the real estate & property development sector",        industry: "Real Estate & Property Development",          size: 4500000,  ebitda: 9765265,  revenues: 28007062 },
  { id: 12, entity: "Le Pavillon",                             codeName: "French",      service: "Brokerage",  about: "Commercial enterprise operating in the hospitality, food & beverage sector",    industry: "Hospitality, Food & Beverage",                size: 4000000,  ebitda: 9570612,  revenues: 18680199 },
  { id: 13, entity: "CHARLESTON Hotel",                        codeName: "Yellow",      service: "Brokerage",  about: "Hospitality business in lodging and food services",                             industry: "Hospitality, Food & Beverage",                size: 4000000,  ebitda: 4152251,  revenues: 24201376 },
  { id: 14, entity: "Kazkazini",                               codeName: "KANDA",       service: "Brokerage",  about: "Commercial enterprise in the agriculture, agritech & agro-processing sector",   industry: "Agriculture, AgriTech & Agro-Processing",     size: 3720000,  ebitda: 8446037,  revenues: 6323864  },
  { id: 15, entity: "Modern Properties - Land Sale",           codeName: "Modern",      service: "Brokerage",  about: "Commercial enterprise in the real estate & property development sector",        industry: "Real Estate & Property Development",          size: 3000000,  ebitda: 705863,   revenues: 23487196 },
  { id: 16, entity: "ESBEE",                                   codeName: "Bee",         service: "Brokerage",  about: "Commercial enterprise in the trade, manufacturing & consumer goods sector",     industry: "Trade, Manufacturing & Consumer Goods",       size: 3000000,  ebitda: 2174933,  revenues: 46145971 },
  { id: 17, entity: "ULTIMATE HOTEL",                          codeName: "United",      service: "Brokerage",  about: "Hospitality business in lodging and food services",                             industry: "Hospitality, Food & Beverage",                size: 2500000,  ebitda: 9482275,  revenues: 49221043 },
  { id: 18, entity: "Onlime Africa Limited",                   codeName: "SL",          service: "Brokerage",  about: "Technology company providing digital solutions and services",                    industry: "Financial Services",                          size: 2250000,  ebitda: 5285850,  revenues: 39129632 },
  { id: 19, entity: "Colonel Takye",                           codeName: "MULTI",       service: "Brokerage",  about: "Commercial enterprise in the real estate & property development sector",        industry: "Real Estate & Property Development",          size: 2200000,  ebitda: 3156455,  revenues: 48307156 },
  { id: 20, entity: "Dan's Paradise Hotel",                    codeName: "Pond",        service: "Brokerage",  about: "Hospitality business in lodging and food services",                             industry: "Hospitality, Food & Beverage",                size: 2000000,  ebitda: 9652860,  revenues: 28225945 },
  { id: 21, entity: "Office Complex",                          codeName: "Happy II",    service: "Brokerage",  about: "Commercial enterprise in the real estate & property development sector",        industry: "Real Estate & Property Development",          size: 1800000,  ebitda: 5624926,  revenues: 29134918 },
  { id: 22, entity: "Indulge",                                 codeName: "Instagram",   service: "Brokerage",  about: "Commercial enterprise operating in the hospitality, food & beverage sector",    industry: "Hospitality, Food & Beverage",                size: 1700000,  ebitda: 1111035,  revenues: 4545727  },
  { id: 23, entity: "Kings Palace School",                     codeName: "KINGS",       service: "Brokerage",  about: "Educational institution providing learning services",                           industry: "Education & Human Capital",                   size: 1200000,  ebitda: 5364225,  revenues: 4095861  },
  { id: 24, entity: "Tilly's Farm",                            codeName: "Tiles",       service: "Funding",    about: "Agricultural and food production enterprise",                                   industry: "Agriculture, AgriTech & Agro-Processing",     size: 1000000,  ebitda: 8567650,  revenues: 28112885 },
  { id: 25, entity: "Marvello Gastro Lounge",                  codeName: "Marvel",      service: "Brokerage",  about: "Energy sector company in fuel distribution and services",                       industry: "Hospitality, Food & Beverage",                size: 1000000,  ebitda: 5209940,  revenues: 6982671  },
  { id: 26, entity: "Scenic Restaurant",                       codeName: "Starz",       service: "Brokerage",  about: "Hospitality business in lodging and food services",                             industry: "Hospitality, Food & Beverage",                size: 876000,   ebitda: 1877507,  revenues: 22578381 },
  { id: 27, entity: "Enart Farms and Consult",                 codeName: "Moon",        service: "Brokerage",  about: "Agricultural and food production enterprise",                                   industry: "Agriculture, AgriTech & Agro-Processing",     size: 860000,   ebitda: 666312,   revenues: 36111719 },
  { id: 28, entity: "DF Poultry",                              codeName: "Pot",         service: "Brokerage",  about: "Commercial enterprise in the agriculture, agritech & agro-processing sector",   industry: "Agriculture, AgriTech & Agro-Processing",     size: 700000,   ebitda: 2885916,  revenues: 29640618 },
  { id: 29, entity: "Magdavis Catering Services",              codeName: "Carter",      service: "Brokerage",  about: "Commercial enterprise operating in the hospitality, food & beverage sector",    industry: "Hospitality, Food & Beverage",                size: 500000,   ebitda: 3642128,  revenues: 16552068 },
  { id: 30, entity: "Lot30 Bistro & Bar",                      codeName: "Barn",        service: "Brokerage",  about: "Commercial enterprise operating in the hospitality, food & beverage sector",    industry: "Hospitality, Food & Beverage",                size: 374000,   ebitda: 9042679,  revenues: 16632491 },
  { id: 31, entity: "AgriOne Africa",                          codeName: "Agric",       service: "Funding",    about: "Agricultural and food production enterprise",                                   industry: "Agriculture, AgriTech & Agro-Processing",     size: 350000,   ebitda: 1742474,  revenues: 6196942  },
  { id: 32, entity: "Agnes Bakery",                            codeName: "Sweet",       service: "Brokerage",  about: "Technology company providing digital solutions and services",                    industry: "Hospitality, Food & Beverage",                size: 250000,   ebitda: 4530482,  revenues: 11934763 },
  { id: 33, entity: "Eldora Royal Farms",                      codeName: "Crown",       service: "Brokerage",  about: "Agricultural and food production enterprise",                                   industry: "Agriculture, AgriTech & Agro-Processing",     size: 233000,   ebitda: 4257717,  revenues: 6961787  },
  { id: 34, entity: "Theresa",                                 codeName: "Atlas",       service: "Funding",    about: "Commercial enterprise in the energy, oil & gas sector",                        industry: "Energy, Oil & Gas",                           size: 200000,   ebitda: 9843200,  revenues: 22197419 },
  { id: 35, entity: "AH Nissi Company Ltd",                    codeName: "Nice",        service: "Brokerage",  about: "Business enterprise providing specialized services",                            industry: "Real Estate & Property Development",          size: 192000,   ebitda: 4426732,  revenues: 40476873 },
  { id: 36, entity: "Land - Kuorkor Dzani",                    codeName: "Kooks",       service: "Brokerage",  about: "Commercial enterprise in the real estate & property development sector",        industry: "Real Estate & Property Development",          size: 160000,   ebitda: 7508072,  revenues: 13752487 },
  { id: 37, entity: "Apartment (Solaris) - Kuorkor Dzani",     codeName: "Sol",         service: "Brokerage",  about: "Commercial enterprise in the real estate & property development sector",        industry: "Real Estate & Property Development",          size: 160000,   ebitda: 6450924,  revenues: 31497761 },
  { id: 38, entity: "UFO BURGER",                              codeName: "Space",       service: "Brokerage",  about: "Commercial enterprise operating in the hospitality, food & beverage sector",    industry: "Hospitality, Food & Beverage",                size: 100000,   ebitda: 5253840,  revenues: 5722339  },
  { id: 39, entity: "Land",                                    codeName: "Earth",       service: "Brokerage",  about: "Commercial enterprise in the real estate & property development sector",        industry: "Real Estate & Property Development",          size: 76000,    ebitda: 3667953,  revenues: 46754711 },
  { id: 40, entity: "Poultry Tech",                            codeName: "Projet PT",   service: "Brokerage",  about: "Technology company providing digital solutions and services",                    industry: "Agriculture, AgriTech & Agro-Processing",     size: 70000,    ebitda: 6913544,  revenues: 15792247 },
  { id: 41, entity: "Oya Ghana",                               codeName: "Oak",         service: "Funding",    about: "Commercial enterprise in the technology & mobility sector",                     industry: "Technology & Mobility",                       size: 70000,    ebitda: 5365161,  revenues: 32920424 },
  { id: 42, entity: "GreenGold",                               codeName: "Green",       service: "Brokerage",  about: "Commercial enterprise in the agriculture, agritech & agro-processing sector",   industry: "Agriculture, AgriTech & Agro-Processing",     size: 40000,    ebitda: 5399347,  revenues: 27210723 },
  { id: 43, entity: "Best Life Clinic",                        codeName: "Bold",        service: "Consulting", about: "Healthcare facility providing medical and diagnostic services",                  industry: "Healthcare & Life Sciences",                  size: 30000,    ebitda: 9916886,  revenues: 17010143 },
  { id: 44, entity: "World-beater Security Services",          codeName: "Wife",        service: "Brokerage",  about: "Technology company providing digital solutions and services",                    industry: "Business Services & Investment",              size: 0,        ebitda: 745153,   revenues: 21443214 },
  { id: 45, entity: "Land Sale - Yaw Owusu Ansah",             codeName: "Answer",      service: "Brokerage",  about: "Commercial enterprise in the real estate & property development sector",        industry: "Real Estate & Property Development",          size: 0,        ebitda: 4304637,  revenues: 19349458 },
  { id: 46, entity: "Land with Uncompleted Building - Grace Asare", codeName: "Good",  service: "Brokerage",  about: "Technology company providing digital solutions and services",                    industry: "Real Estate & Property Development",          size: 0,        ebitda: 7248927,  revenues: 40884186 },
  { id: 47, entity: "Central Oil Mills Ltd",                   codeName: "Center",      service: "Brokerage",  about: "Oil processing and production company",                                         industry: "Energy, Oil & Gas",                           size: 0,        ebitda: 3538097,  revenues: 20734538 },
  { id: 48, entity: "Cups and Cones",                          codeName: "Cane",        service: "Brokerage",  about: "Food and beverage retail business",                                             industry: "Hospitality, Food & Beverage",                size: 0,        ebitda: 6427456,  revenues: 38751777 },
  { id: 49, entity: "Innovare",                                codeName: "Inn",         service: "Funding",    about: "Information technology systems and software solutions provider",                 industry: "Technology & Digital Services",               size: 0,        ebitda: 4630761,  revenues: 9729308  },
  { id: 50, entity: "Danpong Hospital",                        codeName: "Dan",         service: "Consulting", about: "Medical facility providing healthcare services",                                 industry: "Healthcare & Life Sciences",                  size: 0,        ebitda: 317882,   revenues: 42229385 },
];

const APPROVED_EMAILS = ["admin@africanaspirations.com", "demo@africanaspirations.com", "investor@africanaspirations.com"];
const ADMIN_EMAILS = ["admin@africanaspirations.com"];

// ─── Helpers ─────────────────────────────────
function fmtMoney(n) {
  if (!n) return "TBD";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

const serviceBadge = { Funding: "bg-emerald-50 text-emerald-700 border-emerald-200", Brokerage: "bg-blue-50 text-blue-700 border-blue-200", Consulting: "bg-amber-50 text-amber-700 border-amber-200" };

const SIZE_RANGES = [
  { value: "all",    label: "All sizes" },
  { value: "tbd",    label: "TBD" },
  { value: "lt100k", label: "< $100K" },
  { value: "100k",   label: "$100K – $1M" },
  { value: "1m",     label: "$1M – $5M" },
  { value: "5m",     label: "$5M+" },
];

function normalizeDeal(d) {
  return {
    ...d,
    codeName: d.codeName ?? d.code_name ?? "",
    service:  d.service  ?? "",
    about:    d.about    ?? "",
    industry: d.industry ?? "",
    ebitda:   d.ebitda   ?? null,
    revenues: d.revenues ?? null,
  };
}

function ls(key, fallback) { try { const v = sessionStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } }
function ss(key, val) { try { sessionStorage.setItem(key, JSON.stringify(val)); } catch {} }

// ─── Auth ─────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setErr("");
    const address = email.trim().toLowerCase();

    if (!address) {
      setErr("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    let approved = false;
    let isAdmin = false;

    // Try Supabase first; fall back to local list when not configured
    const result = await isEmailApproved(address);
    if (result.approved) {
      approved = true;
      isAdmin = result.isAdmin;
    } else {
      const localList = ls("aa_approved", APPROVED_EMAILS);
      approved = localList.includes(address);
      isAdmin = ADMIN_EMAILS.includes(address);
    }

    if (approved) {
      onLogin({ email: address, isAdmin });
    } else {
      setErr("This email is not approved. Contact your administrator for access.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
      <div className="w-full max-w-sm">
        {/* Wordmark */}
        <div className="mb-10 text-center">
          <img src="/logo.svg" alt="African Aspirations" className="h-10 w-auto mx-auto mb-5" />
          <p className="text-sm text-zinc-400 mt-1 font-light">Pipeline Intelligence Portal</p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-7 shadow-sm">
          <p className="text-xs text-zinc-500 font-light mb-5 text-center">Sign in with your approved email to continue</p>

          <div className="space-y-4">
            <div>
              <Label className="text-xs text-zinc-500 font-light mb-1.5 block">Email address</Label>
              <Input
                type="email" value={email}
                onChange={e => { setEmail(e.target.value); setErr(""); }}
                onKeyDown={e => e.key === "Enter" && email && submit()}
                placeholder="you@example.com"
                className="h-10 w-full px-4 text-sm font-light border-zinc-200 focus:border-zinc-400 rounded-xl"
              />
            </div>

            {err && (
              <Alert variant="destructive" className="py-2 rounded-xl border-red-200 bg-red-50">
                <AlertDescription className="text-xs text-red-600 font-light flex items-center gap-2">
                  <Ic name="warning" size={14} className="text-red-500 shrink-0" />
                  {err}
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={submit}
              disabled={loading || !email}
              className="w-full h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-light"
            >
              {loading ? "Verifying…" : "Access dashboard"}
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-400 font-light mt-5">
          Access is restricted to pre-approved team members only.
        </p>
      </div>
    </div>
  );
}

// ─── Deal Modal ───────────────────────────────
function DealModal({ deal, isAdmin, teasers, onUpload, onClose, onUpdate, industries = [] }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...deal });
  const fileRef = useRef();
  const teaser = teasers[deal.id];

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => onUpload(deal.id, ev.target.result, f.name);
    r.readAsDataURL(f);
  }

  function saveEdit() { onUpdate(form); setEditing(false); }

  return (
    <Dialog open onOpenChange={onClose}>
      <div className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm" onClick={onClose} />
      <DialogContent className="fixed inset-y-0 right-0 z-50 flex w-full max-w-3xl flex-col overflow-y-auto bg-white shadow-2xl" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
        <DialogHeader className="flex items-center justify-between px-7 pt-6 pb-0 border-b border-zinc-200">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-light ${serviceBadge[deal.service] || ""}`}>{deal.service}</span>
            </div>
            <DialogTitle className="text-lg font-semibold text-zinc-900">{deal.entity}</DialogTitle>
            <p className="text-sm text-zinc-400 font-light">{deal.codeName}</p>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (editing ? (
              <>
                <Button onClick={saveEdit} className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-light h-9 px-5 text-sm whitespace-nowrap">Save changes</Button>
                <Button onClick={() => setEditing(false)} variant="outline" className="rounded-xl border-zinc-200 font-light h-9 px-5 text-sm">Cancel</Button>
              </>
            ) : (
              <Button onClick={() => setEditing(true)} size="sm" className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-light h-9 px-5 text-sm whitespace-nowrap">
                <Ic name="edit" size={14} />
                Edit deal
              </Button>
            ))}
            <Button onClick={onClose} variant="outline" size="sm" className="inline-flex items-center justify-center h-9 w-9 rounded-xl border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50">
              <Ic name="close" size={16} />
            </Button>
          </div>
        </DialogHeader>

        {/* Deal overview — always visible */}
        <div className="px-7 pt-4 pb-5">
          {editing && isAdmin ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-x-5 gap-y-5">
                {/* Entity name — full width */}
                <div className="col-span-2">
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Entity name</p>
                  <Input value={form.entity || ""} onChange={e => setForm(p => ({ ...p, entity: e.target.value }))} className="h-10 px-4 text-sm font-light border-zinc-200 rounded-xl bg-zinc-50" />
                </div>
                {/* Code name */}
                <div>
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Code name</p>
                  <Input value={form.codeName || ""} onChange={e => setForm(p => ({ ...p, codeName: e.target.value }))} className="h-10 px-4 text-sm font-light border-zinc-200 rounded-xl bg-zinc-50" />
                </div>
                {/* Service */}
                <div>
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Service</p>
                  <select
                    value={form.service || "Funding"}
                    onChange={e => setForm(p => ({ ...p, service: e.target.value }))}
                    className="w-full h-10 px-4 text-sm font-light border border-zinc-200 rounded-xl bg-zinc-50 text-zinc-800 appearance-none focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  >
                    {["Funding", "Brokerage", "Consulting"].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                {/* Industry — full width dropdown */}
                <div className="col-span-2">
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Industry</p>
                  <select
                    value={form.industry || ""}
                    onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}
                    className="w-full h-10 px-4 text-sm font-light border border-zinc-200 rounded-xl bg-zinc-50 text-zinc-800 appearance-none focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  >
                    <option value="">Select industry…</option>
                    {industries.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                {/* Numeric fields */}
                <div>
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Nominal size (USD)</p>
                  <Input value={form.size || ""} onChange={e => setForm(p => ({ ...p, size: Number(e.target.value) || null }))} className="h-10 px-4 text-sm font-light border-zinc-200 rounded-xl bg-zinc-50 tabular-nums" type="number" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">EBITDA (USD)</p>
                  <Input value={form.ebitda || ""} onChange={e => setForm(p => ({ ...p, ebitda: Number(e.target.value) || null }))} className="h-10 px-4 text-sm font-light border-zinc-200 rounded-xl bg-zinc-50 tabular-nums" type="number" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Revenues (USD)</p>
                  <Input value={form.revenues || ""} onChange={e => setForm(p => ({ ...p, revenues: Number(e.target.value) || null }))} className="h-10 px-4 text-sm font-light border-zinc-200 rounded-xl bg-zinc-50 tabular-nums" type="number" />
                </div>
                {/* About — full width textarea */}
                <div className="col-span-2">
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">About entity</p>
                  <textarea
                    value={form.about || ""}
                    onChange={e => setForm(p => ({ ...p, about: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 text-sm font-light border border-zinc-200 rounded-xl bg-zinc-50 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-800"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[["Deal ID", `#${deal.id}`],["Nominal size", fmtMoney(deal.size)],["Service", deal.service],["EBITDA", fmtMoney(deal.ebitda)],["Revenues", fmtMoney(deal.revenues)],["Industry", deal.industry || "—"]].map(([lbl, val]) => (
                  <div key={lbl} className="bg-zinc-50 rounded-xl p-4">
                    <p className="text-xs text-zinc-400 font-light mb-1">{lbl}</p>
                    <p className="text-sm text-zinc-800 font-light leading-snug">{val}</p>
                  </div>
                ))}
              </div>
              {deal.about && (
                <div className="bg-zinc-50 rounded-xl p-4">
                  <p className="text-xs text-zinc-400 font-light mb-1">About</p>
                  <p className="text-sm text-zinc-800 font-light leading-relaxed">{deal.about}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Deal Teaser */}
        <div className="px-7 pb-7">
          <div className="flex items-center gap-2 mb-3">
            <Ic name="pdf" size={13} className="text-zinc-400" />
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Deal Teaser</span>
          </div>
          {teaser ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-zinc-500 font-light">
                  <Ic name="document" size={15} className="text-zinc-400" />
                  {teaser.name}
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={() => window.open(teaser.data, "_blank")} variant="outline" size="sm" className="inline-flex items-center gap-1.5 rounded-xl border-zinc-200 font-light h-8 text-xs">
                    <Ic name="eye" size={13} />
                    View full
                  </Button>
                  {isAdmin && (
                    <Button onClick={() => fileRef.current.click()} variant="outline" size="sm" className="inline-flex items-center gap-1.5 rounded-xl border-zinc-200 font-light h-8 text-xs">
                      <Ic name="upload" size={13} />
                      Replace
                    </Button>
                  )}
                </div>
              </div>
              <iframe src={teaser.data} className="w-full rounded-xl border border-zinc-200" style={{ height: 440 }} title="Deal Teaser" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center">
                <Ic name="pdf" size={22} className="text-zinc-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-700 font-light">{isAdmin ? "No teaser uploaded yet" : "No teaser available for this deal"}</p>
                <p className="text-xs text-zinc-400 font-light mt-1">{isAdmin ? "Upload a PDF to make it available to all users." : "Check back later or contact your administrator."}</p>
              </div>
              {isAdmin && (
                <Button onClick={() => fileRef.current.click()} className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-light h-9 px-6 text-sm whitespace-nowrap">
                  <Ic name="upload" size={15} />
                  Upload deal teaser
                </Button>
              )}
            </div>
          )}
          <input type="file" accept=".pdf" ref={fileRef} className="hidden" onChange={handleFile} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Admin Panel ──────────────────────────────
function AdminPanel({ deals, setDeals, approvedEmails, setApprovedEmails, onClose, industries = [] }) {
  const [newEmail, setNewEmail] = useState("");
  const [newDeal, setNewDeal] = useState({ entity: "", codeName: "", service: "Funding", about: "", industry: "", size: "", ebitda: "", revenues: "" });

  async function addEmail() {
    const email = newEmail.trim().toLowerCase();
    if (!email || approvedEmails.some(item => item.email === email)) return;
    const result = await addApprovedEmail(email, false);
    if (result.success) {
      setApprovedEmails([...approvedEmails, { email, is_admin: false }]);
      setNewEmail("");
    }
  }

  async function removeEmail(email) {
    const existing = approvedEmails.find(item => item.email === email);
    if (!existing || existing.is_admin) return;
    const result = await removeApprovedEmail(email);
    if (result.success) {
      setApprovedEmails(approvedEmails.filter(item => item.email !== email));
    }
  }

  async function addDeal() {
    if (!newDeal.entity) return;
    const result = await createDeal(newDeal);
    if (result.success && result.data) {
      setDeals([normalizeDeal(result.data), ...deals]);
      setNewDeal({ entity: "", codeName: "", service: "Funding", about: "", industry: "", size: "", ebitda: "", revenues: "" });
    }
  }

  async function removeDeal(id) {
    const result = await deleteDeal(id);
    if (result.success) {
      setDeals(deals.filter(d => d.id !== id));
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <div className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm" onClick={onClose} />
      <DialogContent className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col overflow-y-auto bg-white shadow-2xl" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
        <DialogHeader className="flex items-center justify-between px-7 pt-6 pb-0 border-b border-zinc-200">
          <DialogTitle className="text-base font-semibold text-zinc-900 flex items-center gap-2">
            <Ic name="settings" size={16} className="text-zinc-500" />
            Admin panel
          </DialogTitle>
          <Button onClick={onClose} variant="outline" size="sm" className="inline-flex items-center justify-center h-9 w-9 rounded-xl border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50">
            <Ic name="close" size={16} />
          </Button>
        </DialogHeader>

        <Tabs defaultValue="emails" className="mt-3">
          <TabsList className="mx-7 bg-zinc-100 rounded-xl p-1 h-9">
            <TabsTrigger value="emails" className="text-xs font-light rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-1.5">
              <Ic name="lock" size={13} />
              Approved emails
            </TabsTrigger>
            <TabsTrigger value="deals" className="text-xs font-light rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-1.5">
              <Ic name="briefcase" size={13} />
              Manage deals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="emails" className="px-7 pb-7 pt-5 mt-0 space-y-4">
            <div className="flex gap-2">
              <Input value={newEmail} onChange={e => setNewEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && addEmail()} placeholder="new@email.com" className="h-9 text-sm font-light border-zinc-200 rounded-xl" />
              <Button onClick={addEmail} size="sm" className="rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-light h-9 gap-1.5">
                <Ic name="plus" size={14} />
                Add
              </Button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {approvedEmails.map(approved => (
                <div key={approved.email} className="flex items-center justify-between px-4 py-2.5 bg-zinc-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Ic name="mail" size={14} className="text-zinc-400" />
                    <span className="text-sm font-light text-zinc-700">{approved.email}</span>
                    {approved.is_admin && <span className="text-xs px-2 py-0.5 rounded-full bg-violet-50 border border-violet-200 text-violet-600 font-light">Admin</span>}
                  </div>
                  {!approved.is_admin && (
                    <Button onClick={() => removeEmail(approved.email)} variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-500">
                      <Ic name="trash" size={14} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="deals" className="px-7 pb-7 pt-5 mt-0 space-y-5">
            <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4 space-y-3">
              <p className="text-xs text-zinc-500 font-light">Add new deal</p>
              <div className="grid grid-cols-2 gap-2.5">
                {[["entity","Entity name *"],["codeName","Code name"],["about","About entity"],["size","Nominal size (USD)"],["ebitda","EBITDA (USD)"],["revenues","Revenues (USD)"]].map(([k, lbl]) => (
                  <Input key={k} value={newDeal[k]} onChange={e => setNewDeal(p => ({ ...p, [k]: e.target.value }))} placeholder={lbl} className={`h-9 text-sm font-light border-zinc-200 rounded-xl bg-zinc-50 ${k === "about" ? "col-span-2" : ""}`} />
                ))}
                <select value={newDeal.service} onChange={e => setNewDeal(p => ({ ...p, service: e.target.value }))}
                  className="h-9 px-3 text-sm font-light border border-zinc-200 rounded-xl bg-zinc-50 text-zinc-800 appearance-none focus:outline-none focus:ring-2 focus:ring-zinc-900">
                  {["Funding", "Brokerage", "Consulting"].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                <select value={newDeal.industry} onChange={e => setNewDeal(p => ({ ...p, industry: e.target.value }))}
                  className="h-9 px-3 text-sm font-light border border-zinc-200 rounded-xl bg-zinc-50 text-zinc-800 appearance-none focus:outline-none focus:ring-2 focus:ring-zinc-900">
                  <option value="">Industry…</option>
                  {industries.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <Button onClick={addDeal} size="sm" className="rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-light h-9 gap-1.5 text-xs">
                <Ic name="plus" size={14} />
                Add deal
              </Button>
            </div>
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {deals.map(d => (
                <div key={d.id} className="flex items-center justify-between px-4 py-2.5 bg-zinc-50 rounded-xl">
                  <div>
                    <span className="text-sm font-light text-zinc-800">{d.entity}</span>
                    <span className="text-xs text-zinc-400 font-light ml-2">{d.codeName}</span>
                  </div>
                  <Button onClick={() => removeDeal(d.id)} variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-500">
                    <Ic name="trash" size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

const KPI_ICONS = {
  briefcase: <Briefcase size={20} variant="Outline" />,
  money:     <Money size={20} variant="Outline" />,
  chart:     <Chart size={20} variant="Outline" />,
  document:  <Document size={20} variant="Outline" />,
};

// ─── KPI Card ─────────────────────────────────
function KpiCard({ label, value, sub, icon }) {
  return (
    <div className="bg-white border border-zinc-100 rounded-[28px] p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-400 font-semibold mb-2">{label}</p>
          <p className="text-2xl font-semibold text-zinc-900 tracking-tight tabular-nums truncate">{value}</p>
          <p className="text-xs text-zinc-500 font-light mt-2 leading-snug">{sub}</p>
        </div>
        <div className="ml-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">
          {KPI_ICONS[icon] ?? <Briefcase size={20} variant="Outline" />}
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────
function Dashboard({ userEmail, isAdmin, onLogout }) {
  const [deals, setDeals] = useState([]);
  const [teasers, setTeasers] = useState(() => ls("aa_teasers", {}));
  const [approvedEmails, setApprovedEmails] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [search, setSearch] = useState("");
  const [filterService, setFilterService] = useState("all");
  const [filterIndustry, setFilterIndustry] = useState("all");
  const [filterSize, setFilterSize] = useState("all");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [sortField, setSortField] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      setError("");
      const dealsResult = await getAllDeals();
      if (!dealsResult.success) {
        setError(dealsResult.error || "Unable to load deals.");
      } else {
        setDeals((dealsResult.data || []).map(normalizeDeal));
      }
      const emails = await getApprovedEmails();
      setApprovedEmails(emails);
      setLoading(false);
    }
    loadDashboard();
  }, []);

  function handleUpload(id, data, name) {
    const u = { ...teasers, [id]: { data, name } };
    setTeasers(u); ss("aa_teasers", u);
  }

  async function handleUpdateDeal(updated) {
    const result = await updateDeal(updated.id, updated);
    if (result.success && result.data) {
      const normalized = normalizeDeal(result.data);
      setDeals(deals.map(d => d.id === updated.id ? normalized : d));
      setSelectedDeal(normalized);
    } else {
      setError(result.error || "Unable to update the deal.");
    }
  }

  const industries = useMemo(() => {
    const set = new Set(deals.map(d => d.industry).filter(Boolean));
    return Array.from(set).sort();
  }, [deals]);

  const filtered = useMemo(() => {
    return deals
      .filter(d => {
        const q = search.toLowerCase();
        if (q && !d.entity.toLowerCase().includes(q) && !d.codeName.toLowerCase().includes(q) && !(d.about || "").toLowerCase().includes(q) && !(d.industry || "").toLowerCase().includes(q)) return false;
        if (filterService !== "all" && d.service !== filterService) return false;
        if (filterIndustry !== "all" && d.industry !== filterIndustry) return false;
        if (filterSize !== "all") {
          const s = d.size || 0;
          if (filterSize === "tbd"    && s !== 0) return false;
          if (filterSize === "lt100k" && !(s > 0 && s < 100000)) return false;
          if (filterSize === "100k"   && !(s >= 100000 && s < 1000000)) return false;
          if (filterSize === "1m"     && !(s >= 1000000 && s < 5000000)) return false;
          if (filterSize === "5m"     && !(s >= 5000000)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let av = a[sortField] ?? (["size","ebitda","revenues"].includes(sortField) ? -1 : "");
        let bv = b[sortField] ?? (["size","ebitda","revenues"].includes(sortField) ? -1 : "");
        if (!["size","ebitda","revenues"].includes(sortField)) { av = String(av).toLowerCase(); bv = String(bv).toLowerCase(); }
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [deals, search, filterService, filterIndustry, filterSize, sortField, sortDir]);

  // KPI stats computed from FILTERED set
  const totalSize = filtered.reduce((s, d) => s + (d.size || 0), 0);
  const byService = { Funding: filtered.filter(d => d.service === "Funding").length, Brokerage: filtered.filter(d => d.service === "Brokerage").length, Consulting: filtered.filter(d => d.service === "Consulting").length };
  const teaserCount = filtered.filter(d => teasers[d.id]).length;

  function toggleSort(field) {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <Ic name="sortAsc" size={13} className="text-zinc-300" />;
    return sortDir === "asc"
      ? <Ic name="arrowUp" size={13} className="text-zinc-600" />
      : <Ic name="arrowDown" size={13} className="text-zinc-600" />;
  };

  const hasFilters = search || filterService !== "all" || filterIndustry !== "all" || filterSize !== "all";

  return (
    <div className="min-h-screen bg-zinc-50" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
      {/* Nav */}
      <header className="bg-white border-b border-zinc-100 h-14 flex items-center px-7">
        <div className="flex items-center gap-3 flex-1">
          <img src="/logo.svg" alt="African Aspirations" className="h-9 w-auto" />
          <span className="text-zinc-200 text-xs">|</span>
          <span className="text-xs text-zinc-400 font-light">Pipeline Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-zinc-100 rounded-xl px-3 py-1.5 bg-zinc-50">
            <div className="w-6 h-6 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-xs font-light">
              {userEmail[0].toUpperCase()}
            </div>
            <span className="text-xs text-zinc-500 font-light max-w-36 truncate">{userEmail}</span>
          </div>
          <Button onClick={onLogout} variant="outline" size="sm" className="inline-flex items-center gap-2 h-8 rounded-xl font-light text-xs text-zinc-500 border border-zinc-200 hover:text-zinc-800 hover:bg-zinc-50 px-3 whitespace-nowrap">
            <Ic name="logout" size={13} />
            Sign out
          </Button>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-7 py-8">
        {/* Page header */}
        <div className={`mb-7 grid gap-5 ${isAdmin ? "lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)]" : ""}`}>
          <div className="rounded-[28px] border border-zinc-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-400 font-semibold">Pipeline overview</p>
                <h1 className="mt-3 text-3xl font-semibold text-zinc-900 tracking-tight">Deal pipeline dashboard</h1>
                <p className="mt-3 text-sm text-zinc-500 leading-relaxed">A clearer view on active opportunities, deal readiness, and portfolio performance. Use filters to narrow focus and click any row to inspect details.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 border border-emerald-100">Live updates</div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3 text-xs font-medium text-zinc-500">
              <span className="rounded-full bg-zinc-50 px-3 py-2">Total deals: {deals.length}</span>
              <span className="rounded-full bg-zinc-50 px-3 py-2">Active: {byService.Funding + byService.Brokerage + byService.Consulting}</span>
              <span className="rounded-full bg-zinc-50 px-3 py-2">Approved users: {approvedEmails.length}</span>
            </div>
            {(loading || error) && (
              <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-light ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                {loading ? 'Loading dashboard data…' : error}
              </div>
            )}
          </div>

          {isAdmin && (
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[28px] border border-zinc-100 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-400 font-semibold">Pipeline size</p>
                <p className="mt-3 text-3xl font-semibold text-zinc-900">{fmtMoney(totalSize)}</p>
                <p className="mt-2 text-sm text-zinc-500">Nominal value for the current view.</p>
              </div>
              <div className="rounded-[28px] border border-zinc-100 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-400 font-semibold">Teasers ready</p>
                <p className="mt-3 text-3xl font-semibold text-zinc-900">{teaserCount}</p>
                <p className="mt-2 text-sm text-zinc-500">PDF teasers available across filtered deals.</p>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white border border-zinc-100 rounded-[28px] px-6 py-5 mb-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-3">
            <div className="relative w-1/2 min-w-[240px]">
              <Ic name="search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search entity, code name or sector" className="h-11 w-full pl-11 text-sm font-light border-zinc-200 rounded-2xl bg-zinc-50 focus:bg-white" />
            </div>

            <div className="flex items-center gap-3">
              {/* Service filter */}
              <div className="relative">
                {openDropdown === "service" && <div className="fixed inset-0 z-30" onClick={() => setOpenDropdown(null)} />}
                <button
                  onClick={() => setOpenDropdown(o => o === "service" ? null : "service")}
                  className="relative z-40 h-11 min-w-[140px] flex items-center justify-between gap-2 px-4 rounded-2xl border border-zinc-200 bg-zinc-50 text-sm font-light text-zinc-700 hover:bg-zinc-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Ic name="tag" size={13} className="text-zinc-400" />
                    {filterService === "all" ? "All services" : filterService}
                  </span>
                  <Ic name="arrowDown" size={13} className="text-zinc-400" />
                </button>
                {openDropdown === "service" && (
                  <div className="absolute left-0 top-12 z-50 w-48 rounded-2xl border border-zinc-200 bg-white shadow-lg p-1">
                    {["all", "Funding", "Brokerage", "Consulting"].map(v => (
                      <button key={v} onClick={() => { setFilterService(v); setOpenDropdown(null); }}
                        className={`w-full text-left px-3 py-2.5 text-sm font-light rounded-xl transition-colors ${filterService === v ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-50"}`}>
                        {v === "all" ? "All services" : v}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Industry filter */}
              <div className="relative">
                {openDropdown === "industry" && <div className="fixed inset-0 z-30" onClick={() => setOpenDropdown(null)} />}
                <button
                  onClick={() => setOpenDropdown(o => o === "industry" ? null : "industry")}
                  className="relative z-40 h-11 min-w-[140px] max-w-[220px] flex items-center justify-between gap-2 px-4 rounded-2xl border border-zinc-200 bg-zinc-50 text-sm font-light text-zinc-700 hover:bg-zinc-100 transition-colors"
                >
                  <span className="flex items-center gap-2 truncate">
                    <Ic name="tag" size={13} className="text-zinc-400 shrink-0" />
                    <span className="truncate">{filterIndustry === "all" ? "All industries" : filterIndustry}</span>
                  </span>
                  <Ic name="arrowDown" size={13} className="text-zinc-400 shrink-0" />
                </button>
                {openDropdown === "industry" && (
                  <div className="absolute left-0 top-12 z-50 w-72 rounded-2xl border border-zinc-200 bg-white shadow-lg p-1 max-h-72 overflow-y-auto">
                    <button onClick={() => { setFilterIndustry("all"); setOpenDropdown(null); }}
                      className={`w-full text-left px-3 py-2.5 text-sm font-light rounded-xl transition-colors ${filterIndustry === "all" ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-50"}`}>
                      All industries
                    </button>
                    {industries.map(v => (
                      <button key={v} onClick={() => { setFilterIndustry(v); setOpenDropdown(null); }}
                        className={`w-full text-left px-3 py-2.5 text-sm font-light rounded-xl transition-colors ${filterIndustry === v ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-50"}`}>
                        {v}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Size filter */}
              <div className="relative">
                {openDropdown === "size" && <div className="fixed inset-0 z-30" onClick={() => setOpenDropdown(null)} />}
                <button
                  onClick={() => setOpenDropdown(o => o === "size" ? null : "size")}
                  className="relative z-40 h-11 min-w-[140px] flex items-center justify-between gap-2 px-4 rounded-2xl border border-zinc-200 bg-zinc-50 text-sm font-light text-zinc-700 hover:bg-zinc-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Ic name="money" size={13} className="text-zinc-400" />
                    {SIZE_RANGES.find(r => r.value === filterSize)?.label ?? "All sizes"}
                  </span>
                  <Ic name="arrowDown" size={13} className="text-zinc-400" />
                </button>
                {openDropdown === "size" && (
                  <div className="absolute left-0 top-12 z-50 w-48 rounded-2xl border border-zinc-200 bg-white shadow-lg p-1">
                    {SIZE_RANGES.map(({ value, label }) => (
                      <button key={value} onClick={() => { setFilterSize(value); setOpenDropdown(null); }}
                        className={`w-full text-left px-3 py-2.5 text-sm font-light rounded-xl transition-colors ${filterSize === value ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-50"}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {hasFilters && (
                <button onClick={() => { setSearch(""); setFilterService("all"); setFilterIndustry("all"); setFilterSize("all"); }} className="h-11 px-4 rounded-2xl font-light text-xs text-zinc-500 hover:text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors">
                  <Ic name="close" size={13} />
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* KPI Cards — driven by filtered set */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
          <KpiCard label="Deals shown" value={filtered.length} sub={`of ${deals.length} total in pipeline`} icon="briefcase" />
          <KpiCard label="Portfolio size" value={fmtMoney(totalSize)} sub="Nominal value, filtered view" icon="money" />
          <KpiCard label="By service" value={`${byService.Funding}F · ${byService.Brokerage}B · ${byService.Consulting}C`} sub="Funding · Brokerage · Consulting" icon="chart" />
          <KpiCard label="Teasers uploaded" value={teaserCount} sub={`${filtered.length - teaserCount} pending in view`} icon="document" />
        </div>

        {/* Table */}
        <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100">
                  {[["#","id",52],["Entity","entity",null],["Code name","codeName",140],["Service","service",110],["Industry","industry",200],["Nominal size","size",130],["EBITDA","ebitda",120],["Revenues","revenues",130],["Teaser",null,72]].map(([lbl, field, w]) => (
                    <th key={lbl} onClick={() => field && toggleSort(field)} style={w ? { width: w } : {}}
                      className={`px-4 py-3 text-left text-xs text-zinc-400 font-light tracking-wide ${field ? "cursor-pointer hover:text-zinc-600 select-none" : ""}`}>
                      <span className="flex items-center gap-1.5">
                        {lbl}
                        {field && <SortIcon field={field} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(deal => (
                  <tr key={deal.id} onClick={() => setSelectedDeal(deal)}
                    className="border-b border-zinc-50 hover:bg-zinc-50 cursor-pointer transition-colors">
                    <td className="px-4 py-3.5 text-xs text-zinc-300 font-light tabular-nums">{deal.id}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-xs text-zinc-500 font-light shrink-0">
                          {deal.entity.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-zinc-800 font-light text-sm leading-tight">{deal.entity}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-zinc-400 font-light">{deal.codeName}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border font-light ${serviceBadge[deal.service] || ""}`}>{deal.service}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-zinc-500 font-light max-w-[200px] truncate">{deal.industry}</td>
                    <td className="px-4 py-3.5 text-sm text-zinc-800 font-light tabular-nums">{fmtMoney(deal.size)}</td>
                    <td className="px-4 py-3.5 text-sm text-zinc-800 font-light tabular-nums">{fmtMoney(deal.ebitda)}</td>
                    <td className="px-4 py-3.5 text-sm text-zinc-800 font-light tabular-nums">{fmtMoney(deal.revenues)}</td>
                    <td className="px-4 py-3.5 text-center">
                      {teasers[deal.id]
                        ? <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-50"><Ic name="document" size={14} className="text-emerald-600" /></span>
                        : isAdmin
                          ? <button onClick={(e) => { e.stopPropagation(); setSelectedDeal(deal); }} className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-dashed border-zinc-300 text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-colors"><Ic name="upload" size={13} /></button>
                          : <span className="text-zinc-200 text-xs font-light">—</span>}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center">
                          <Ic name="search" size={18} className="text-zinc-400" />
                        </div>
                        <p className="text-sm text-zinc-400 font-light">No deals match your filters</p>
                        <Button onClick={() => { setSearch(""); setFilterService("all"); setFilterIndustry("all"); setFilterSize("all"); }} variant="ghost" size="sm" className="rounded-xl font-light text-xs text-zinc-400">Clear filters</Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {selectedDeal && <DealModal deal={selectedDeal} isAdmin={isAdmin} teasers={teasers} onUpload={handleUpload} onClose={() => setSelectedDeal(null)} onUpdate={handleUpdateDeal} industries={industries} />}
      {showAdmin && <AdminPanel deals={deals} setDeals={setDeals} approvedEmails={approvedEmails} setApprovedEmails={setApprovedEmails} onClose={() => setShowAdmin(false)} industries={industries} />}
    </div>
  );
}

// ─── Root ─────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("aa_user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  function login(userObj) {
    sessionStorage.setItem("aa_user", JSON.stringify(userObj));
    setUser(userObj);
  }

  function logout() {
    sessionStorage.removeItem("aa_user");
    setUser(null);
  }

  return (
    <>
      {!user && <AuthScreen onLogin={login} />}
      {user && <Dashboard userEmail={user.email} isAdmin={user.isAdmin} onLogout={logout} />}
      <Agentation />
    </>
  );
}
