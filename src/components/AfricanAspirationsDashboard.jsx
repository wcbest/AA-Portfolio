"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
  uploadTeaser,
  getTeaserPublicUrl,
  removeTeaser,
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

const ROLE_META = {
  admin:  { label: "Admin",  badge: "bg-[#f5eef8] border-[#CFB6D7] text-[#7a4d8a]" },
  editor: { label: "Editor", badge: "bg-[#eef1fb] border-[#B2BEE1] text-[#3d5899]" },
  viewer: { label: "Viewer", badge: "bg-zinc-100 border-zinc-200 text-zinc-500" },
};

function getPerms(role) {
  return {
    canCreate: role === "admin" || role === "editor",
    canUpdate: role === "admin" || role === "editor",
    canDelete: role === "admin",
    canManageUsers: role === "admin",
    isAdmin: role === "admin",
  };
}

const serviceBadge = { Funding: "bg-[#f5faeb] text-[#42793A] border-[#C3DB75]", Brokerage: "bg-[#f5eef8] text-[#7a4d8a] border-[#CFB6D7]", Consulting: "bg-[#fef6e8] text-[#a0620e] border-[#F4B858]" };

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
    codeName:   d.codeName   ?? d.code_name   ?? "",
    service:    d.service    ?? "",
    about:      d.about      ?? "",
    industry:   d.industry   ?? "",
    ebitda:     d.ebitda     ?? null,
    revenues:   d.revenues   ?? null,
    teaserPath: d.teaserPath ?? d.teaser_path ?? null,
  };
}

function ls(key, fallback) { try { const v = sessionStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } }

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
    let role = "viewer";

    const result = await isEmailApproved(address);
    if (result.approved) {
      approved = true;
      role = result.role;
    } else {
      const localList = ls("aa_approved", APPROVED_EMAILS);
      approved = localList.includes(address);
      role = ADMIN_EMAILS.includes(address) ? "admin" : "viewer";
    }

    if (approved) {
      onLogin({ email: address, role });
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
              className="w-full h-10 rounded-xl bg-[#215132] hover:bg-[#1a3f28] text-white text-sm font-light"
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
function DealModal({ deal, perms = {}, teasers, onUpload, onRemoveTeaser, onClose, onUpdate, onDelete, industries = [] }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ ...deal });
  const fileRef = useRef();
  const teaser = teasers[deal.id];

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    onUpload(deal.id, f);
  }

  function saveEdit() { onUpdate(form); setEditing(false); }

  async function handleDelete() {
    setDeleting(true);
    await onDelete(deal.id);
    setDeleting(false);
  }

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
            {confirmDelete ? (
              <>
                <span className="text-xs text-zinc-500 font-light mr-1">Delete this deal?</span>
                <Button onClick={handleDelete} disabled={deleting} className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-light h-9 px-5 text-sm whitespace-nowrap disabled:opacity-50">
                  {deleting ? "Deleting…" : "Yes, delete"}
                </Button>
                <Button onClick={() => setConfirmDelete(false)} variant="outline" className="rounded-xl border-zinc-200 font-light h-9 px-5 text-sm">Cancel</Button>
              </>
            ) : (
              <>
                {perms.canUpdate && !editing && (
                  <Button onClick={() => setEditing(true)} size="sm" className="inline-flex items-center gap-2 rounded-xl bg-[#215132] hover:bg-[#1a3f28] text-white font-light h-9 px-5 text-sm whitespace-nowrap">
                    <Ic name="edit" size={14} />
                    Edit deal
                  </Button>
                )}
                {perms.canUpdate && editing && (
                  <>
                    <Button onClick={saveEdit} className="inline-flex items-center gap-2 rounded-xl bg-[#215132] hover:bg-[#1a3f28] text-white font-light h-9 px-5 text-sm whitespace-nowrap">Save changes</Button>
                    <Button onClick={() => setEditing(false)} variant="outline" className="rounded-xl border-zinc-200 font-light h-9 px-5 text-sm">Cancel</Button>
                  </>
                )}
                {perms.canDelete && !editing && (
                  <Button onClick={() => setConfirmDelete(true)} variant="outline" size="sm" className="inline-flex items-center justify-center h-9 w-9 rounded-xl border-zinc-200 text-zinc-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50">
                    <Ic name="trash" size={15} />
                  </Button>
                )}
              </>
            )}
            <Button onClick={onClose} variant="outline" size="sm" className="inline-flex items-center justify-center h-9 w-9 rounded-xl border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50">
              <Ic name="close" size={16} />
            </Button>
          </div>
        </DialogHeader>

        {/* Deal overview — always visible */}
        <div className="px-7 pt-4 pb-5">
          {editing && perms.canUpdate ? (
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
                  {perms.canUpdate && (
                    <Button onClick={() => fileRef.current.click()} variant="outline" size="sm" className="inline-flex items-center gap-1.5 rounded-xl border-zinc-200 font-light h-8 text-xs">
                      <Ic name="upload" size={13} />
                      Replace
                    </Button>
                  )}
                  {perms.canDelete && (
                    <Button onClick={() => onRemoveTeaser(deal.id)} variant="outline" size="sm" className="inline-flex items-center gap-1.5 rounded-xl border-red-200 text-red-500 hover:bg-red-50 font-light h-8 text-xs">
                      <Ic name="trash" size={13} />
                      Remove teaser
                    </Button>
                  )}
                </div>
              </div>
              <iframe src={teaser.url} className="w-full rounded-xl border border-zinc-200" style={{ height: 440 }} title="Deal Teaser" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center">
                <Ic name="pdf" size={22} className="text-zinc-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-700 font-light">{perms.canUpdate ? "No teaser uploaded yet" : "No teaser available for this deal"}</p>
                <p className="text-xs text-zinc-400 font-light mt-1">{perms.canUpdate ? "Upload a PDF to make it available to all users." : "Check back later or contact your administrator."}</p>
              </div>
              {perms.canUpdate && (
                <Button onClick={() => fileRef.current.click()} className="inline-flex items-center gap-2 rounded-xl bg-[#215132] hover:bg-[#1a3f28] text-white font-light h-9 px-6 text-sm whitespace-nowrap">
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
function AdminPanel({ deals, approvedEmails, setApprovedEmails }) {
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("viewer");
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const [removingEmail, setRemovingEmail] = useState(null);

  function flashEmail(err, ok) {
    if (err) { setEmailError(err); setEmailSuccess(""); }
    else { setEmailSuccess(ok); setEmailError(""); setTimeout(() => setEmailSuccess(""), 3000); }
  }

  async function addEmail() {
    const email = newEmail.trim().toLowerCase();
    if (!email) return;
    if (approvedEmails.some(item => item.email === email)) { flashEmail("This email is already approved."); return; }
    setSavingEmail(true);
    const result = await addApprovedEmail(email, newRole);
    setSavingEmail(false);
    if (result.success) {
      setApprovedEmails([...approvedEmails, { email, role: newRole, is_admin: newRole === "admin" }]);
      setNewEmail("");
      setNewRole("viewer");
      flashEmail("", `${email} added as ${newRole}.`);
    } else {
      flashEmail(result.error || "Failed to add email.");
    }
  }

  async function removeEmail(email) {
    const existing = approvedEmails.find(item => item.email === email);
    if (!existing || existing.role === "admin") return;
    setRemovingEmail(email);
    const result = await removeApprovedEmail(email);
    setRemovingEmail(null);
    if (result.success) {
      setApprovedEmails(approvedEmails.filter(item => item.email !== email));
    } else {
      flashEmail(result.error || "Failed to remove email.");
    }
  }

  const [editingRole, setEditingRole] = useState(null);
  const [pendingRole, setPendingRole] = useState("viewer");
  const [savingRole, setSavingRole] = useState(false);

  function startEditRole(email, currentRole) {
    setEditingRole(email);
    setPendingRole(currentRole);
  }

  async function saveRole(email) {
    setSavingRole(true);
    const result = await addApprovedEmail(email, pendingRole);
    setSavingRole(false);
    if (result.success) {
      setApprovedEmails(approvedEmails.map(item =>
        item.email === email
          ? { ...item, role: pendingRole, is_admin: pendingRole === "admin" }
          : item
      ));
      setEditingRole(null);
      flashEmail("", `${email} updated to ${pendingRole}.`);
    } else {
      flashEmail(result.error || "Failed to update role.");
    }
  }

  const selectClass = "h-10 px-3 text-sm font-light border border-zinc-200 rounded-xl bg-zinc-50 text-zinc-800 appearance-none focus:outline-none focus:ring-2 focus:ring-zinc-900";
  const selectSmClass = "h-8 px-3 text-xs font-light border border-zinc-200 rounded-xl bg-white text-zinc-800 appearance-none focus:outline-none focus:ring-2 focus:ring-zinc-900";

  return (
    <div>
      {/* Page header */}
      <div className="mb-7 rounded-[28px] border border-zinc-100 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-400 font-semibold">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-900 tracking-tight">Settings</h1>
          <p className="mt-3 text-sm text-zinc-500 leading-relaxed">Manage user access. Admins have full control, editors can create and update, viewers can only read.</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3 text-xs font-medium text-zinc-500">
          <span className="rounded-full bg-zinc-50 px-3 py-2">Approved users: {approvedEmails.length}</span>
          <span className="rounded-full bg-zinc-50 px-3 py-2">Total deals: {deals.length}</span>
        </div>
      </div>

      {/* Access control — full width */}
      <div className="rounded-[28px] border border-zinc-100 bg-white p-6 shadow-sm mb-5">
        <p className="text-xs uppercase tracking-[0.28em] text-zinc-400 font-semibold mb-5">Access control</p>

        {emailError && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-light text-red-700">{emailError}</div>}
        {emailSuccess && <div className="mb-4 rounded-2xl border border-[#C3DB75] bg-[#f5faeb] px-4 py-3 text-sm font-light text-[#42793A]">{emailSuccess}</div>}

        <div className="flex gap-2 mb-5">
          <Input
            value={newEmail}
            onChange={e => { setNewEmail(e.target.value); setEmailError(""); }}
            onKeyDown={e => e.key === "Enter" && addEmail()}
            placeholder="new@email.com"
            className="h-10 text-sm font-light border-zinc-200 rounded-xl bg-zinc-50 px-4 flex-1"
          />
          <select value={newRole} onChange={e => setNewRole(e.target.value)} className={selectClass}>
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
          <Button onClick={addEmail} disabled={savingEmail} className="inline-flex items-center gap-2 rounded-xl bg-[#215132] hover:bg-[#1a3f28] text-white font-light h-10 px-5 text-sm whitespace-nowrap disabled:opacity-50">
            <Ic name="plus" size={14} />
            {savingEmail ? "Adding…" : "Add user"}
          </Button>
        </div>

        {/* Role legend */}
        <div className="flex gap-3 mb-5 flex-wrap">
          {Object.entries(ROLE_META).map(([role, { label, badge }]) => (
            <div key={role} className="flex items-center gap-2 text-xs text-zinc-500 font-light">
              <span className={`px-2 py-0.5 rounded-full border text-xs font-light ${badge}`}>{label}</span>
              <span>{role === "admin" ? "Full access" : role === "editor" ? "Create & edit" : "Read only"}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {approvedEmails.map(approved => {
            const role = approved.role || (approved.is_admin ? "admin" : "viewer");
            const meta = ROLE_META[role] || ROLE_META.viewer;
            const isEditing = editingRole === approved.email;

            return (
              <div key={approved.email} className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-colors ${isEditing ? "bg-white border border-zinc-200" : "bg-zinc-50"}`}>
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <Ic name="mail" size={14} className="text-zinc-400 shrink-0" />
                  <span className="text-sm font-light text-zinc-700 truncate">{approved.email}</span>
                  {!isEditing && (
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-light shrink-0 ${meta.badge}`}>{meta.label}</span>
                  )}
                </div>

                {isEditing ? (
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <select
                      value={pendingRole}
                      onChange={e => setPendingRole(e.target.value)}
                      className={selectSmClass}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <Button
                      onClick={() => saveRole(approved.email)}
                      disabled={savingRole}
                      className="h-8 px-3 rounded-xl bg-[#215132] hover:bg-[#1a3f28] text-white font-light text-xs whitespace-nowrap disabled:opacity-50"
                    >
                      {savingRole ? "Saving…" : "Save"}
                    </Button>
                    <Button
                      onClick={() => setEditingRole(null)}
                      variant="outline"
                      className="h-8 px-3 rounded-xl border-zinc-200 font-light text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 shrink-0 ml-3">
                    <Button
                      onClick={() => startEditRole(approved.email, role)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700"
                      title="Edit role"
                    >
                      <Ic name="edit" size={13} />
                    </Button>
                    {role !== "admin" && (
                      <Button
                        onClick={() => removeEmail(approved.email)}
                        disabled={removingEmail === approved.email}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-xl hover:bg-red-50 text-zinc-400 hover:text-red-500 disabled:opacity-40"
                        title="Remove user"
                      >
                        <Ic name="trash" size={13} />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Add Deal Modal ───────────────────────────
const EMPTY_NEW_DEAL = { entity: "", codeName: "", service: "Funding", about: "", industry: "", size: "", ebitda: "", revenues: "" };

function AddDealModal({ onClose, onAdd, industries = [] }) {
  const [form, setForm] = useState(EMPTY_NEW_DEAL);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fieldClass = "w-full bg-zinc-50 px-4 h-10 border border-zinc-200 rounded-xl text-sm font-light text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900";
  const labelClass = "text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2 block";

  async function handleSave() {
    if (!form.entity.trim()) { setError("Entity name is required."); return; }
    setSaving(true);
    const result = await createDeal(form);
    setSaving(false);
    if (result.success && result.data) {
      onAdd(normalizeDeal(result.data));
      onClose();
    } else {
      setError(result.error || "Failed to create deal.");
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <div className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm" onClick={onClose} />
      <DialogContent className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
        <DialogHeader className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-zinc-100">
          <DialogTitle className="text-base font-semibold text-zinc-900">New deal</DialogTitle>
          <div className="flex items-center gap-2">
            <Button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#215132] hover:bg-[#1a3f28] text-white font-light h-9 px-5 text-sm disabled:opacity-50">
              {saving ? "Saving…" : "Save deal"}
            </Button>
            <Button onClick={onClose} variant="outline" size="sm" className="inline-flex items-center justify-center h-9 w-9 rounded-xl border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50">
              <Ic name="close" size={16} />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-7 py-6 space-y-1">
          {error && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-light text-red-700">{error}</div>
          )}
          <div className="grid grid-cols-2 gap-x-5 gap-y-5">
            <div className="col-span-2">
              <label className={labelClass}>Entity name *</label>
              <input value={form.entity} onChange={e => { setForm(p => ({ ...p, entity: e.target.value })); setError(""); }} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Code name</label>
              <input value={form.codeName} onChange={e => setForm(p => ({ ...p, codeName: e.target.value }))} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Service</label>
              <select value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value }))} className={fieldClass + " appearance-none"}>
                {["Funding", "Brokerage", "Consulting"].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Industry</label>
              <select value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} className={fieldClass + " appearance-none"}>
                <option value="">Select industry…</option>
                {industries.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Nominal size (USD)</label>
              <input type="number" value={form.size} onChange={e => setForm(p => ({ ...p, size: e.target.value }))} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>EBITDA (USD)</label>
              <input type="number" value={form.ebitda} onChange={e => setForm(p => ({ ...p, ebitda: e.target.value }))} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Revenues (USD)</label>
              <input type="number" value={form.revenues} onChange={e => setForm(p => ({ ...p, revenues: e.target.value }))} className={fieldClass} />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>About</label>
              <textarea value={form.about} onChange={e => setForm(p => ({ ...p, about: e.target.value }))} rows={4} className="w-full bg-zinc-50 px-4 py-3 border border-zinc-200 rounded-xl text-sm font-light text-zinc-800 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900" />
            </div>
          </div>
        </div>
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
    <div className="bg-[#42793A] rounded-[28px] p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-[0.22em] text-[#C3DB75] font-semibold mb-2">{label}</p>
          <p className="text-3xl font-medium text-white tracking-tight tabular-nums truncate">{value}</p>
          <p className="text-xs text-[#a8d880] font-light mt-2 leading-snug">{sub}</p>
        </div>
        <div className="ml-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-[#336030] text-[#C3DB75]">
          {KPI_ICONS[icon] ?? <Briefcase size={20} variant="Outline" />}
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────
function Dashboard({ userEmail, userRole = "viewer", onLogout }) {
  const perms = getPerms(userRole);
  const { isAdmin } = perms;
  const [deals, setDeals] = useState([]);
  const [teasers, setTeasers] = useState({});
  const [approvedEmails, setApprovedEmails] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [view, setView] = useState("dashboard");
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterService, setFilterService] = useState("all");
  const [filterIndustry, setFilterIndustry] = useState("all");
  const [filterSize, setFilterSize] = useState("all");
  const [filterTeaser, setFilterTeaser] = useState(false);
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
        const normalized = (dealsResult.data || []).map(normalizeDeal);
        setDeals(normalized);
        const map = {};
        normalized.forEach(d => {
          if (d.teaserPath) {
            const url = getTeaserPublicUrl(d.teaserPath);
            const name = d.teaserPath.split('/').pop();
            map[d.id] = { url, name };
          }
        });
        setTeasers(map);
      }
      const emails = await getApprovedEmails();
      setApprovedEmails(emails);
      setLoading(false);
    }
    loadDashboard();
  }, []);

  async function handleUpload(dealId, file) {
    const result = await uploadTeaser(dealId, file);
    if (result.success) {
      const url = getTeaserPublicUrl(result.path);
      setTeasers(prev => ({ ...prev, [dealId]: { url, name: file.name } }));
      setDeals(prev => prev.map(d => d.id === dealId ? { ...d, teaserPath: result.path } : d));
      if (selectedDeal?.id === dealId) setSelectedDeal(prev => ({ ...prev, teaserPath: result.path }));
    } else {
      setError(result.error || "Failed to upload teaser.");
    }
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

  async function handleDeleteDeal(id) {
    const result = await deleteDeal(id);
    if (result.success) {
      setDeals(prev => prev.filter(d => d.id !== id));
      setSelectedDeal(null);
    } else {
      setError(result.error || "Unable to delete the deal.");
    }
  }

  async function handleRemoveTeaser(dealId) {
    const deal = deals.find(d => d.id === dealId);
    const result = await removeTeaser(dealId, deal?.teaserPath ?? null);
    if (result.success) {
      setTeasers(prev => { const next = { ...prev }; delete next[dealId]; return next; });
      setDeals(prev => prev.map(d => d.id === dealId ? { ...d, teaserPath: null } : d));
      if (selectedDeal?.id === dealId) setSelectedDeal(prev => ({ ...prev, teaserPath: null }));
    } else {
      setError(result.error || "Unable to remove teaser.");
    }
  }

  function exportExcel() {
    const rows = filtered.map((d, i) => ({
      "#": i + 1,
      "Entity": d.entity,
      "Code Name": d.codeName,
      "Service": d.service,
      "Industry": d.industry || "—",
      "Nominal Size (USD)": d.size || 0,
      "EBITDA (USD)": d.ebitda ?? "",
      "Revenues (USD)": d.revenues ?? "",
      "Has Teaser": teasers[d.id] ? "Yes" : "No",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [4, 28, 18, 14, 22, 20, 16, 16, 12].map(w => ({ wch: w }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Deal Pipeline");
    XLSX.writeFile(wb, `african-aspirations-deals-${new Date().toISOString().slice(0,10)}.xlsx`);
    setExportOpen(false);
  }

  function exportPDF() {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(24, 24, 27);
    doc.text("African Aspirations", 14, 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(113, 113, 122);
    doc.text("Deal Pipeline Report", 14, 25);
    doc.text(`Generated: ${date}`, 14, 31);
    doc.text(`Showing ${filtered.length} of ${deals.length} deals`, 14, 37);

    autoTable(doc, {
      startY: 44,
      head: [["#", "Entity", "Code Name", "Service", "Industry", "Nominal Size", "EBITDA", "Revenues", "Teaser"]],
      body: filtered.map((d, i) => [
        i + 1,
        d.entity,
        d.codeName || "—",
        d.service,
        d.industry || "—",
        d.size ? `$${Number(d.size).toLocaleString()}` : "TBD",
        d.ebitda ? `$${Number(d.ebitda).toLocaleString()}` : "—",
        d.revenues ? `$${Number(d.revenues).toLocaleString()}` : "—",
        teasers[d.id] ? "Yes" : "No",
      ]),
      styles: { font: "helvetica", fontSize: 8, cellPadding: 3, textColor: [24, 24, 27] },
      headStyles: { fillColor: [24, 24, 27], textColor: 255, fontStyle: "bold", fontSize: 8 },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 45 },
        2: { cellWidth: 30 },
        3: { cellWidth: 22 },
        4: { cellWidth: 35 },
        5: { cellWidth: 25 },
        6: { cellWidth: 22 },
        7: { cellWidth: 22 },
        8: { cellWidth: 14 },
      },
      margin: { left: 14, right: 14 },
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(161, 161, 170);
      doc.text(`Page ${i} of ${pageCount} — Confidential`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 8, { align: "center" });
    }

    doc.save(`african-aspirations-deals-${new Date().toISOString().slice(0,10)}.pdf`);
    setExportOpen(false);
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
        if (filterTeaser && !teasers[d.id]) return false;
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
  }, [deals, search, filterService, filterIndustry, filterSize, filterTeaser, teasers, sortField, sortDir]);

  // KPI stats computed from FILTERED set
  const totalSize = filtered.reduce((s, d) => s + (d.size || 0), 0);
  const byService = { Funding: filtered.filter(d => d.service === "Funding").length, Brokerage: filtered.filter(d => d.service === "Brokerage").length, Consulting: filtered.filter(d => d.service === "Consulting").length };
  const teaserCount = filtered.filter(d => teasers[d.id]).length;
  const industryCount = new Set(filtered.map(d => d.industry).filter(Boolean)).size;

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

  const hasFilters = search || filterService !== "all" || filterIndustry !== "all" || filterSize !== "all" || filterTeaser;

  return (
    <div className="min-h-screen bg-zinc-100" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
      {/* Nav */}
      <header className="bg-white border-b border-zinc-100 h-14 flex items-center px-7">
        <div className="flex items-center gap-3 flex-1">
          <img src="/logo.svg" alt="African Aspirations" className="h-9 w-auto" />
          <span className="text-zinc-200 text-xs">|</span>
          <span className="text-xs text-zinc-400 font-light">Pipeline Dashboard</span>
        </div>
        <div className="flex items-center gap-2 border border-zinc-100 rounded-xl px-3 py-1.5 bg-zinc-50">
          <div className="w-6 h-6 rounded-lg bg-[#215132] flex items-center justify-center text-white text-xs font-light">
            {userEmail[0].toUpperCase()}
          </div>
          <span className="text-xs text-zinc-500 font-light max-w-36 truncate">{userEmail}</span>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-24 shrink-0 bg-white border-r border-zinc-100 sticky top-14 h-[calc(100vh-3.5rem)] flex flex-col items-center py-5 gap-2">
          <button
            onClick={() => setView("dashboard")}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${view === "dashboard" ? "bg-[#215132] text-white" : "hover:bg-zinc-50 text-zinc-400 hover:text-zinc-700"}`}
            title="Dashboard"
          >
            <Ic name="chart" size={20} />
          </button>

          {isAdmin && (
            <button
              onClick={() => setView("settings")}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${view === "settings" ? "bg-[#215132] text-white" : "hover:bg-zinc-50 text-zinc-400 hover:text-zinc-700"}`}
              title="Settings"
            >
              <Ic name="settings" size={20} />
            </button>
          )}

          <div className="flex-1" />

          <button onClick={onLogout} className="w-12 h-12 rounded-2xl hover:bg-red-50 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors" title="Sign out">
            <Ic name="logout" size={20} />
          </button>
        </aside>

        <main className="flex-1 min-w-0 px-7 py-8">
          {view === "settings" && isAdmin && (
            <AdminPanel deals={deals} approvedEmails={approvedEmails} setApprovedEmails={setApprovedEmails} />
          )}
          {view === "settings" && !isAdmin && (
            <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center">
                <Ic name="lock" size={20} className="text-zinc-400" />
              </div>
              <p className="text-sm text-zinc-500 font-light">You don't have permission to view this page.</p>
            </div>
          )}
          {view === "dashboard" && (<>
        {/* Page header */}
        <div className="mb-7 grid gap-5">
          <div className="rounded-[28px] border border-zinc-100 bg-white px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-400 font-semibold">Pipeline overview</p>
                <h1 className="mt-1.5 text-2xl font-semibold text-zinc-900 tracking-tight">Deal pipeline dashboard</h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-[#f5faeb] px-3 py-2 text-xs font-semibold text-[#42793A] border border-[#C3DB75] whitespace-nowrap">Live updates</div>
              </div>
            </div>
            {(loading || error) && (
              <div className={`mt-3 rounded-2xl border px-4 py-3 text-sm font-light ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                {loading ? 'Loading dashboard data…' : error}
              </div>
            )}
          </div>

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
                        className={`w-full text-left px-3 py-2.5 text-sm font-light rounded-xl transition-colors ${filterService === v ? "bg-[#215132] text-white" : "text-zinc-700 hover:bg-zinc-50"}`}>
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
                      className={`w-full text-left px-3 py-2.5 text-sm font-light rounded-xl transition-colors ${filterIndustry === "all" ? "bg-[#215132] text-white" : "text-zinc-700 hover:bg-zinc-50"}`}>
                      All industries
                    </button>
                    {industries.map(v => (
                      <button key={v} onClick={() => { setFilterIndustry(v); setOpenDropdown(null); }}
                        className={`w-full text-left px-3 py-2.5 text-sm font-light rounded-xl transition-colors ${filterIndustry === v ? "bg-[#215132] text-white" : "text-zinc-700 hover:bg-zinc-50"}`}>
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
                        className={`w-full text-left px-3 py-2.5 text-sm font-light rounded-xl transition-colors ${filterSize === value ? "bg-[#215132] text-white" : "text-zinc-700 hover:bg-zinc-50"}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setFilterTeaser(v => !v)}
                className={`h-11 px-4 rounded-2xl font-light text-xs flex items-center gap-2 transition-colors border ${filterTeaser ? "bg-[#215132] text-white border-[#215132]" : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-700"}`}>
                <Ic name="document" size={14} />
                Has teaser
              </button>

              {hasFilters && (
                <button onClick={() => { setSearch(""); setFilterService("all"); setFilterIndustry("all"); setFilterSize("all"); setFilterTeaser(false); }} className="h-11 px-4 rounded-2xl font-light text-xs text-zinc-500 hover:text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors">
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
          <KpiCard label="Pipeline size" value={fmtMoney(totalSize)} sub="Nominal value, filtered view" icon="money" />
          <KpiCard label="Industries" value={industryCount} sub="Unique sectors in filtered view" icon="building" />
          <KpiCard label={perms.canUpdate ? "Teasers uploaded" : "Teasers ready"} value={teaserCount} sub={`${filtered.length - teaserCount} pending in view`} icon="document" />
        </div>

        {/* Table */}
        <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Deal Table
            </p>
            <div className="flex items-center gap-2">
              {/* Export dropdown */}
              <div className="relative">
                {exportOpen && <div className="fixed inset-0 z-30" onClick={() => setExportOpen(false)} />}
                <button
                  onClick={() => setExportOpen(o => !o)}
                  className="relative z-40 inline-flex items-center gap-2 h-9 px-4 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-light text-zinc-600 hover:bg-zinc-100 transition-colors"
                >
                  <Ic name="document" size={13} />
                  Export
                  <Ic name="arrowDown" size={13} className="text-zinc-400" />
                </button>
                {exportOpen && (
                  <div className="absolute right-0 top-11 z-50 w-44 rounded-2xl border border-zinc-200 bg-white shadow-lg p-1">
                    <button onClick={exportExcel} className="w-full text-left px-3 py-2.5 text-sm font-light rounded-xl text-zinc-700 hover:bg-zinc-50 flex items-center gap-2.5">
                      <Ic name="document" size={14} className="text-[#42793A]" />
                      Excel (.xlsx)
                    </button>
                    <button onClick={exportPDF} className="w-full text-left px-3 py-2.5 text-sm font-light rounded-xl text-zinc-700 hover:bg-zinc-50 flex items-center gap-2.5">
                      <Ic name="pdf" size={14} className="text-red-500" />
                      PDF (.pdf)
                    </button>
                  </div>
                )}
              </div>

              {perms.canCreate && (
                <Button onClick={() => setShowAddDeal(true)} className="inline-flex items-center gap-2 rounded-xl bg-[#215132] hover:bg-[#1a3f28] text-white font-light h-9 px-4 text-xs whitespace-nowrap">
                  <Ic name="plus" size={13} />
                  New deal
                </Button>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100">
                  {[["#",null,52],["Entity","entity",null],["Code name","codeName",140],["Service","service",110],["Industry","industry",200],["Nominal size","size",130],["EBITDA","ebitda",120],["Revenues","revenues",130],["Teaser",null,72]].map(([lbl, field, w]) => (
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
                {filtered.map((deal, idx) => (
                  <tr key={deal.id} onClick={() => setSelectedDeal(deal)}
                    className="border-b border-zinc-50 hover:bg-zinc-50 cursor-pointer transition-colors">
                    <td className="px-4 py-3.5 text-xs text-zinc-300 font-light tabular-nums">{idx + 1}</td>
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
                        ? <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#f5faeb]"><Ic name="document" size={14} className="text-[#42793A]" /></span>
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
          </>)}
        </main>
      </div>

      {selectedDeal && <DealModal deal={selectedDeal} perms={perms} teasers={teasers} onUpload={handleUpload} onRemoveTeaser={handleRemoveTeaser} onClose={() => setSelectedDeal(null)} onUpdate={handleUpdateDeal} onDelete={handleDeleteDeal} industries={industries} />}
      {showAddDeal && <AddDealModal onClose={() => setShowAddDeal(false)} onAdd={deal => setDeals(prev => [deal, ...prev])} industries={industries} />}
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
      {user && <Dashboard userEmail={user.email} userRole={user.role ?? (user.isAdmin ? "admin" : "viewer")} onLogout={logout} />}
      <Agentation />
    </>
  );
}
