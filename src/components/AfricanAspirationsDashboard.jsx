"use client"
import { useState, useMemo } from "react";
import { Agentation } from "agentation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// ─── Inline SVG icon system (Iconsax outline) ─────────────────────────────────
const Icon = ({ d, size = 20, className = "", strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {Array.isArray(d)
      ? d.map((path, i) => <path key={i} d={path} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />)
      : <path d={d} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />}
  </svg>
);

const icons = {
  globe: ["M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z","M8 3H9c-1.75 5.49-1.75 12.51 0 18H8","M15 3c1.75 5.49 1.75 12.51 0 18","M3 16v-1c5.49 1.75 12.51 1.75 18 0v1","M3 9c5.49-1.75 12.51-1.75 18 0"],
  search: ["M11 20a9 9 0 1 0 0-18 9 9 0 0 0 0 18z","M18.93 20.69c.39 1.17 1.28 1.27 1.97.22l1.98-3.07c.63-.97.2-1.77-.95-1.77h-3.82c-1.15 0-1.58.8-.95 1.77z"],
  logout: ["M8.9 7.56c.31-3.6 2.16-5.07 6.21-5.07h.13c4.47 0 6.26 1.79 6.26 6.26v6.52c0 4.47-1.79 6.26-6.26 6.26h-.13c-4.02 0-5.87-1.45-6.2-4.99","M15 12H3.62","M5.85 8.65 2.5 12l3.35 3.35"],
  plus: ["M6 12h12","M12 18V6"],
  edit: ["M13.26 3.6l-8.21 8.69c-.31.33-.61.98-.67 1.43l-.37 3.24c-.13 1.17.71 1.97 1.87 1.76l3.22-.55c.45-.08 1.08-.41 1.39-.75l8.21-8.69c1.42-1.5 2.06-3.21-.15-5.3-2.2-2.07-3.87-1.33-5.29.17z","M11.89 5.05c.38 2.91 2.86 5.23 5.79 5.45","M3 22h18"],
  trash: ["M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98","M8.5 4.97l.22-1.31C8.88 2.71 9 2 10.69 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3","M18.85 9.14l-.65 10.07C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14","M10.33 16.5h3.33","M9.5 12.5h5"],
  user: ["M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z","M20.59 22c0-3.31-3.84-6-8.59-6s-8.59 2.69-8.59 6"],
  warning: ["M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z","M12 9v4","M12 17h.01"],
  close: ["M18 6 6 18","M6 6l12 12"],
};

const Ic = ({ name, size = 18, className = "" }) => {
  const d = icons[name];
  if (!d) return null;
  return <Icon d={d} size={size} className={className} />;
};

// ─── Seed data ────────────────────────────────────────────────────────────────
const SEED_DEALS = [
  { id: 1, entity: "Mava Consulting", codeName: "Project Map", category: "Funding", description: "Master Phase for Ocean Community", size: 21000000, deliverables: "Investor Readiness, Funding", status: "Active" },
  { id: 2, entity: "Best Life Clinic", codeName: "Project Bold", category: "Consulting", description: "Diagnostic and Herbal Clinic", size: 30000, deliverables: "Financial Structuring, Investor Readiness", status: "Active" },
  { id: 3, entity: "Project Theresa", codeName: "Project Atlas", category: "Funding", description: "Fuel Station", size: 200000, deliverables: "Investor Readiness, Funding", status: "Active" },
  { id: 4, entity: "Danpong Hospital", codeName: "Project Dan", category: "Consulting", description: "Healthcare facility", size: null, deliverables: "Valuation, Funding", status: "Active" },
  { id: 5, entity: "Innovare", codeName: "Project Inn", category: "Funding", description: "IT Systems Company", size: null, deliverables: "Valuation", status: "Active" },
  { id: 6, entity: "Oya Ghana", codeName: "Project Oak", category: "Funding", description: "Intercity Bus Digitilisation project", size: 70000, deliverables: "Investor Readiness, Funding", status: "Active" },
  { id: 7, entity: "Asa Global Energy Solutions", codeName: "Project Globe", category: "Funding", description: "Petroleum Importation and distribution", size: 500000000, deliverables: "Valuation, Funding", status: "Active" },
  { id: 8, entity: "Ahafo Pride LTD", codeName: "Project Ahab", category: "Funding", description: "Agribusiness", size: 5000000, deliverables: "Investor Readiness, Funding", status: "Active" },
  { id: 9, entity: "AgriOne Africa", codeName: "Project Agric", category: "Funding", description: "AgriTech", size: 350000, deliverables: "Investor Readiness, Funding", status: "Active" },
  { id: 10, entity: "Equity Savings and Loans", codeName: "Project Equestrian", category: "Consulting", description: "Microfinance", size: 20000000, deliverables: "Valuation, Funding", status: "Active" },
  { id: 11, entity: "Tilly's Farm", codeName: "Project Tiles", category: "Funding", description: "Agribusiness", size: 1000000, deliverables: "Valuation, Funding", status: "Active" },
  { id: 12, entity: "Central Oil Mills Ltd", codeName: "Project Center", category: "Brokerage", description: "Oil Production", size: null, deliverables: "Valuation", status: "Active" },
  { id: 13, entity: "Harriben Granite Ltd", codeName: "Project Happy", category: "Consulting", description: "Granite Extraction", size: 10000000, deliverables: "Investor Readiness, Funding", status: "Active" },
  { id: 14, entity: "Merbarproperties", codeName: "Project Marble", category: "Funding", description: "Property Development", size: 4500000, deliverables: "Funding", status: "Active" },
  { id: 15, entity: "Cups and Cones", codeName: "Project Cane", category: "Brokerage", description: "Food Business", size: null, deliverables: "Valuation and Funding", status: "Active" },
  { id: 16, entity: "Indulge", codeName: "Project Instagram", category: "Brokerage", description: "Hospitality & Food Services", size: 1700000, deliverables: "Funding", status: "Active" },
  { id: 17, entity: "Kazkazini", codeName: "Project KANDA", category: "Brokerage", description: "Agriculture & Agro-Processing", size: 3720000, deliverables: "Funding", status: "Active" },
  { id: 18, entity: "Manet", codeName: "Project Merchant", category: "Brokerage", description: "Real Estate", size: 30000000, deliverables: "Funding", status: "Active" },
  { id: 19, entity: "Kings Palace School", codeName: "Project KINGS", category: "Brokerage", description: "Education", size: 1200000, deliverables: "Funding", status: "Active" },
  { id: 20, entity: "D'Avenue", codeName: "Project Dominion", category: "Brokerage", description: "Hospitality & Food Services", size: 6200000, deliverables: "Funding", status: "Active" },
  { id: 21, entity: "GreenGold", codeName: "Project Green", category: "Brokerage", description: "Agriculture & Agro-Processing", size: 40000, deliverables: "Funding", status: "Active" },
  { id: 22, entity: "Land Sale - Yaw Owusu Ansah", codeName: "Project Answer", category: "Brokerage", description: "Real Estate", size: null, deliverables: "Funding", status: "Active" },
  { id: 23, entity: "Tans Hostel", codeName: "Project Tulip", category: "Brokerage", description: "Hospitality & Food Services", size: 5000000, deliverables: "Funding", status: "Active" },
  { id: 24, entity: "Modern Properties - Land Sale", codeName: "Project Modern", category: "Brokerage", description: "Real Estate", size: 3000000, deliverables: "Funding", status: "Active" },
  { id: 25, entity: "Ederick - Emerge", codeName: "Project Emerge", category: "Brokerage", description: "Trade, Manufacturing & Retail", size: 5000000, deliverables: "Funding", status: "Active" },
  { id: 26, entity: "World-beater Security Services", codeName: "Project Wife", category: "Brokerage", description: "Security & Services", size: null, deliverables: "Funding", status: "Active" },
  { id: 27, entity: "Land - Grace Asare", codeName: "Project Good", category: "Brokerage", description: "Real Estate", size: null, deliverables: "Funding", status: "Active" },
  { id: 28, entity: "Land - Kuorkor Dzani", codeName: "Project Kooks", category: "Brokerage", description: "Real Estate", size: 160000, deliverables: "Funding", status: "Active" },
  { id: 29, entity: "Apartment (Solaris) - Kuorkor Dzani", codeName: "Project Sol", category: "Brokerage", description: "Real Estate", size: 160000, deliverables: "Funding", status: "Active" },
  { id: 30, entity: "Lot30 Bistro & Bar", codeName: "Project Barn", category: "Brokerage", description: "Hospitality & Food Services", size: 374000, deliverables: "Funding", status: "Active" },
  { id: 31, entity: "Dan's Paradise Hotel", codeName: "Project Pond", category: "Brokerage", description: "Hospitality & Food Services", size: 2000000, deliverables: "Funding", status: "Active" },
  { id: 32, entity: "AH Nissi Company Ltd", codeName: "Project Nice", category: "Brokerage", description: "Real Estate", size: 192000, deliverables: "Funding", status: "Active" },
  { id: 33, entity: "ESBEE", codeName: "Project Bee", category: "Brokerage", description: "Trade, Manufacturing & Retail", size: 3000000, deliverables: "Funding", status: "Active" },
  { id: 34, entity: "Magdavis Catering Services", codeName: "Project Carter", category: "Brokerage", description: "Hospitality & Food Services", size: 500000, deliverables: "Funding", status: "Active" },
  { id: 35, entity: "Agnes Bakery", codeName: "Project Sweet", category: "Brokerage", description: "Hospitality & Food Services", size: 250000, deliverables: "Funding", status: "Active" },
  { id: 36, entity: "Royal Palm City", codeName: "Project Palm", category: "Brokerage", description: "Real Estate", size: 5000000, deliverables: "Funding", status: "Active" },
  { id: 37, entity: "ULTIMATE HOTEL", codeName: "Project United", category: "Brokerage", description: "Hospitality & Food Services", size: 2500000, deliverables: "Funding", status: "Active" },
  { id: 38, entity: "Colonel Takye", codeName: "Project MULTI", category: "Brokerage", description: "Real Estate", size: 2200000, deliverables: "Funding", status: "Active" },
  { id: 39, entity: "Scenic Restaurant", codeName: "Project Starz", category: "Brokerage", description: "Hospitality & Food Services", size: 876000, deliverables: "Funding", status: "Active" },
  { id: 40, entity: "UFO BURGER", codeName: "Project Space", category: "Brokerage", description: "Hospitality & Food Services", size: 100000, deliverables: "Funding", status: "Active" },
  { id: 41, entity: "Marvello Gastro Lounge", codeName: "Project Marvel", category: "Brokerage", description: "Hospitality & Food Services", size: 1000000, deliverables: "Funding", status: "Active" },
  { id: 42, entity: "Le Pavillon", codeName: "Project French", category: "Brokerage", description: "Hospitality & Food Services", size: 4000000, deliverables: "Funding", status: "Active" },
  { id: 43, entity: "Office Complex", codeName: "Project Happy II", category: "Brokerage", description: "Real Estate", size: 1800000, deliverables: "Funding", status: "Active" },
  { id: 44, entity: "Land", codeName: "Project Earth", category: "Brokerage", description: "Real Estate", size: 76000, deliverables: "Funding", status: "Active" },
  { id: 45, entity: "Eldora Royal Farms", codeName: "Project Crown", category: "Brokerage", description: "Agriculture & Agro-Processing", size: 233000, deliverables: "Funding", status: "Active" },
  { id: 46, entity: "DF Poultry", codeName: "Project Pot", category: "Brokerage", description: "Agriculture & Agro-Processing", size: 700000, deliverables: "Funding", status: "Active" },
  { id: 47, entity: "Enart Farms and Consult", codeName: "Project Moon", category: "Brokerage", description: "Agriculture & Agro-Processing", size: 860000, deliverables: "Funding", status: "Active" },
  { id: 48, entity: "CHARLESTON Hotel", codeName: "Project Yellow", category: "Brokerage", description: "Hospitality & Food Services", size: 4000000, deliverables: "Funding", status: "Active" },
  { id: 49, entity: "Poultry Tech", codeName: "Projet PT", category: "Brokerage", description: "Agriculture & Agro-Processing", size: 70000, deliverables: "Funding", status: "Active" },
  { id: 50, entity: "Onlime Africa Limited", codeName: "Project SL", category: "Brokerage", description: "Financial Services", size: 2250000, deliverables: "Funding", status: "Active" },
  { id: 51, entity: "Project Velvet", codeName: "Project Velvet", category: "Brokerage", description: "Hospitality & Food Services", size: null, deliverables: "Valuation and Funding", status: "Active" },
];

const APPROVED_EMAILS = ["admin@africanaspirations.com", "demo@africanaspirations.com", "investor@africanaspirations.com"];
const ADMIN_EMAILS = ["admin@africanaspirations.com"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtMoney(n) {
  if (!n) return "TBD";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function ls(key, fallback) {
  try { const v = sessionStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function ss(key, val) {
  try { sessionStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// Light theme badges (regular user view)
const catBadge = {
  Funding: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Brokerage: "bg-blue-50 text-blue-700 border border-blue-200",
  Consulting: "bg-amber-50 text-amber-700 border border-amber-200",
};
const statBadge = {
  Active: "bg-green-50 text-green-700 border border-green-200",
  Closed: "bg-red-50 text-red-700 border border-red-200",
  "On Hold": "bg-orange-50 text-orange-700 border border-orange-200",
};

// Dark theme badges (admin view)
const catBadgeDark = {
  Funding: "bg-emerald-900/40 text-emerald-300 border border-emerald-700/40",
  Brokerage: "bg-blue-900/40 text-blue-300 border border-blue-700/40",
  Consulting: "bg-amber-900/40 text-amber-300 border border-amber-700/40",
};
const statBadgeDark = {
  Active: "bg-green-900/40 text-green-300 border border-green-700/40",
  Closed: "bg-red-900/40 text-red-300 border border-red-700/40",
  "On Hold": "bg-orange-900/40 text-orange-300 border border-orange-700/40",
};

const CATEGORIES = ["All", "Funding", "Brokerage", "Consulting"];
const STATUSES = ["All", "Active", "Closed", "On Hold"];
const BLANK_DEAL = { entity: "", codeName: "", category: "Funding", description: "", size: "", deliverables: "", status: "Active" };

// ─── Auth screen ──────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function submit() {
    setErr("");
    setLoading(true);
    setTimeout(() => {
      const approved = ls("aa_approved", APPROVED_EMAILS);
      const normalized = email.trim().toLowerCase();
      if (!normalized) {
        setErr("Enter a valid email.");
      } else if (approved.includes(normalized)) {
        onLogin(normalized);
      } else {
        setErr("This email is not approved. Contact your administrator for access.");
      }
      setLoading(false);
    }, 500);
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-900 mb-5">
            <Ic name="globe" size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-light text-zinc-900 tracking-tight">African Aspirations</h1>
          <p className="text-sm text-zinc-400 mt-1 font-light">Pipeline Intelligence Portal</p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-7 shadow-sm">
          <p className="text-xs text-zinc-500 font-light mb-5 text-center">Sign in with your approved email to continue</p>

          <div className="space-y-4">
            <div>
              <Label className="text-xs text-zinc-500 font-light mb-1.5 block">Email address</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErr(""); }}
                onKeyDown={(e) => e.key === "Enter" && email && submit()}
                placeholder="you@example.com"
                className="h-10 text-sm font-light border-zinc-200 focus:border-zinc-400 rounded-xl"
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

// ─── Shared deal form ─────────────────────────────────────────────────────────
function DealForm({ deal, onChange, onSubmit, onCancel, submitLabel }) {
  return (
    <div className="space-y-4 pt-1">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs text-zinc-500">Entity</Label>
          <Input value={deal.entity} onChange={(e) => onChange("entity", e.target.value)} placeholder="Entity name" className="h-9 text-sm rounded-lg border-zinc-200" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-zinc-500">Code name</Label>
          <Input value={deal.codeName} onChange={(e) => onChange("codeName", e.target.value)} placeholder="Project X" className="h-9 text-sm rounded-lg border-zinc-200" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-zinc-500">Description</Label>
        <Input value={deal.description} onChange={(e) => onChange("description", e.target.value)} placeholder="Brief description" className="h-9 text-sm rounded-lg border-zinc-200" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs text-zinc-500">Category</Label>
          <Select value={deal.category} onValueChange={(v) => onChange("category", v)}>
            <SelectTrigger className="h-9 rounded-lg border-zinc-200 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.slice(1).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-zinc-500">Status</Label>
          <Select value={deal.status} onValueChange={(v) => onChange("status", v)}>
            <SelectTrigger className="h-9 rounded-lg border-zinc-200 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.slice(1).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs text-zinc-500">Deal size (USD)</Label>
          <Input value={deal.size} onChange={(e) => onChange("size", e.target.value)} placeholder="e.g. 5000000" type="number" className="h-9 text-sm rounded-lg border-zinc-200" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-zinc-500">Deliverables</Label>
          <Input value={deal.deliverables} onChange={(e) => onChange("deliverables", e.target.value)} placeholder="e.g. Valuation, Funding" className="h-9 text-sm rounded-lg border-zinc-200" />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel} className="rounded-lg px-4 text-sm">Cancel</Button>
        <Button onClick={onSubmit} className="rounded-lg bg-zinc-900 px-4 text-sm text-white hover:bg-zinc-800">{submitLabel}</Button>
      </div>
    </div>
  );
}

// ─── Side panel (slide-in from right) ────────────────────────────────────────
function SidePanel({ open, onClose, title, children }) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        className={`fixed right-0 top-0 h-full w-[460px] max-w-[95vw] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 shrink-0">
          <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-7 w-7 p-0 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
          >
            <Ic name="close" size={15} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </>
  );
}

// ─── Admin dashboard ──────────────────────────────────────────────────────────
function AdminDashboard({ user, onLogout }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [deals, setDeals] = useState(() => ls("aa_deals", SEED_DEALS));
  const [approvedEmails, setApprovedEmails] = useState(() => ls("aa_approved", APPROVED_EMAILS));
  const [addOpen, setAddOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [newDeal, setNewDeal] = useState(BLANK_DEAL);
  const [newUserEmail, setNewUserEmail] = useState("");

  function persistDeals(next) { setDeals(next); ss("aa_deals", next); }
  function persistEmails(next) { setApprovedEmails(next); ss("aa_approved", next); }

  function handleAddDeal() {
    if (!newDeal.entity.trim() || !newDeal.codeName.trim()) return;
    persistDeals([...deals, { ...newDeal, id: Date.now(), size: newDeal.size ? Number(newDeal.size) : null }]);
    setNewDeal(BLANK_DEAL);
    setAddOpen(false);
  }

  function handleSaveEdit() {
    if (!editingDeal) return;
    persistDeals(deals.map((d) => d.id === editingDeal.id ? { ...editingDeal, size: editingDeal.size ? Number(editingDeal.size) : null } : d));
    setEditingDeal(null);
  }

  function handleRemoveDeal(id) { persistDeals(deals.filter((d) => d.id !== id)); }

  function handleAddUser() {
    const email = newUserEmail.trim().toLowerCase();
    if (!email || approvedEmails.includes(email)) return;
    persistEmails([...approvedEmails, email]);
    setNewUserEmail("");
  }

  function handleRemoveUser(email) { persistEmails(approvedEmails.filter((e) => e !== email)); }

  const filteredDeals = useMemo(() => deals.filter((d) => {
    const matchQ = query ? `${d.entity} ${d.codeName} ${d.description}`.toLowerCase().includes(query.toLowerCase()) : true;
    return matchQ && (category === "All" || d.category === category) && (status === "All" || d.status === status);
  }), [deals, query, category, status]);

  const totalValue = useMemo(() => filteredDeals.reduce((s, d) => s + (d.size || 0), 0), [filteredDeals]);
  const regularUsers = approvedEmails.filter((e) => !ADMIN_EMAILS.includes(e));

  return (
    <div className="h-screen flex flex-col bg-white text-zinc-900 overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-zinc-100 bg-white px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center">
            <Ic name="globe" size={14} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-zinc-900">African Aspirations</span>
          <span className="text-xs text-zinc-400 hidden sm:block">· {user}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-zinc-100 text-zinc-600 border-zinc-200 text-[11px] px-2 py-0.5 rounded-md">Admin</Badge>
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="h-7 px-2.5 text-xs border-zinc-200 text-zinc-500 hover:text-zinc-800 gap-1.5 rounded-lg"
          >
            <Ic name="logout" size={13} />
            Sign out
          </Button>
        </div>
      </header>

      {/* Page content */}
      <div className="flex-1 flex flex-col overflow-hidden p-5 gap-3 bg-zinc-50/50">
        {/* Toolbar */}
        <div className="shrink-0 flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[180px]">
            <Ic name="search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search deals…"
              className="h-9 pl-8 text-sm bg-white border-zinc-200 rounded-lg focus-visible:ring-0 focus-visible:border-zinc-400"
            />
          </div>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-9 w-36 rounded-lg border-zinc-200 bg-white text-sm text-zinc-700 focus:ring-0">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-36 rounded-lg border-zinc-200 bg-white text-sm text-zinc-700 focus:ring-0">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="text-sm text-zinc-500 px-1 shrink-0">
            <span className="font-semibold text-zinc-800">{filteredDeals.length}</span> deals
            {totalValue > 0 && <> · <span className="font-semibold text-zinc-800">{fmtMoney(totalValue)}</span></>}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              onClick={() => setManageOpen(true)}
              variant="outline"
              size="sm"
              className="h-9 rounded-lg border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 text-xs gap-1.5"
            >
              <Ic name="user" size={13} />
              Manage users
            </Button>
            <Button
              onClick={() => setAddOpen(true)}
              size="sm"
              className="h-9 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 text-xs gap-1.5 font-medium"
            >
              <Ic name="plus" size={13} />
              Add deal
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="text-left text-[11px] font-medium uppercase tracking-widest text-zinc-400 px-5 py-3 whitespace-nowrap">Deal</th>
                <th className="text-left text-[11px] font-medium uppercase tracking-widest text-zinc-400 px-5 py-3 whitespace-nowrap">Category</th>
                <th className="text-left text-[11px] font-medium uppercase tracking-widest text-zinc-400 px-5 py-3 whitespace-nowrap">Status</th>
                <th className="text-left text-[11px] font-medium uppercase tracking-widest text-zinc-400 px-5 py-3 whitespace-nowrap">Size</th>
                <th className="text-left text-[11px] font-medium uppercase tracking-widest text-zinc-400 px-5 py-3 whitespace-nowrap">Deliverables</th>
                <th className="text-left text-[11px] font-medium uppercase tracking-widest text-zinc-400 px-5 py-3 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-zinc-400 text-sm">No deals match your filters.</td>
                </tr>
              ) : filteredDeals.map((deal) => (
                <tr key={deal.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/80 transition-colors">
                  <td className="px-5 py-3.5 align-top">
                    <div className="font-semibold text-zinc-900">{deal.entity}</div>
                    <div className="mt-0.5 text-xs text-zinc-400">{deal.codeName} · {deal.description}</div>
                  </td>
                  <td className="px-5 py-3.5 align-top">
                    <Badge className={`${catBadge[deal.category] || "bg-zinc-100 text-zinc-600 border border-zinc-200"} rounded-full px-2.5 py-0.5 text-[11px] font-medium`}>
                      {deal.category}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 align-top">
                    <Badge className={`${statBadge[deal.status] || "bg-zinc-100 text-zinc-600 border border-zinc-200"} rounded-full px-2.5 py-0.5 text-[11px] font-medium`}>
                      {deal.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 align-top text-zinc-700 tabular-nums whitespace-nowrap">{fmtMoney(deal.size)}</td>
                  <td className="px-5 py-3.5 align-top text-zinc-500 max-w-[200px]">{deal.deliverables}</td>
                  <td className="px-5 py-3.5 align-top">
                    <div className="flex gap-1">
                      <Button
                        onClick={() => setEditingDeal({ ...deal, size: deal.size ?? "" })}
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2.5 text-xs text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg gap-1"
                      >
                        <Ic name="edit" size={12} />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleRemoveDeal(deal.id)}
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2.5 text-xs text-red-500/70 hover:text-red-600 hover:bg-red-50 rounded-lg gap-1"
                      >
                        <Ic name="trash" size={12} />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Deal Panel */}
      <SidePanel open={addOpen} onClose={() => { setAddOpen(false); setNewDeal(BLANK_DEAL); }} title="Add new deal">
        <DealForm
          deal={newDeal}
          onChange={(field, val) => setNewDeal((p) => ({ ...p, [field]: val }))}
          onSubmit={handleAddDeal}
          onCancel={() => { setAddOpen(false); setNewDeal(BLANK_DEAL); }}
          submitLabel="Add deal"
        />
      </SidePanel>

      {/* Edit Deal Panel */}
      <SidePanel open={!!editingDeal} onClose={() => setEditingDeal(null)} title="Edit deal">
        {editingDeal && (
          <DealForm
            deal={editingDeal}
            onChange={(field, val) => setEditingDeal((p) => ({ ...p, [field]: val }))}
            onSubmit={handleSaveEdit}
            onCancel={() => setEditingDeal(null)}
            submitLabel="Save changes"
          />
        )}
      </SidePanel>

      {/* Manage Users Panel */}
      <SidePanel open={manageOpen} onClose={() => setManageOpen(false)} title="Manage users">
        <div className="space-y-5">
          <div>
            <Label className="text-xs text-zinc-500 mb-2 block">Add approved user</Label>
            <div className="flex gap-2">
              <Input
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddUser()}
                placeholder="user@example.com"
                type="email"
                className="h-9 flex-1 text-sm rounded-lg border-zinc-200"
              />
              <Button onClick={handleAddUser} className="h-9 rounded-lg bg-zinc-900 text-sm text-white hover:bg-zinc-800 px-4">Add</Button>
            </div>
          </div>

          <div>
            <p className="text-xs text-zinc-500 mb-2">Regular users ({regularUsers.length})</p>
            {regularUsers.length > 0 ? (
              <div className="space-y-1.5">
                {regularUsers.map((email) => (
                  <div key={email} className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2.5">
                    <span className="text-sm text-zinc-700">{email}</span>
                    <Button
                      onClick={() => handleRemoveUser(email)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-zinc-400 hover:text-red-500 rounded"
                    >
                      <Ic name="close" size={13} />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-400 py-4">No regular users yet.</p>
            )}
          </div>
        </div>
      </SidePanel>
    </div>
  );
}

// ─── Regular user dashboard ───────────────────────────────────────────────────
function UserDashboard({ user, onLogout }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const deals = useMemo(() => ls("aa_deals", SEED_DEALS), []);

  const filteredDeals = useMemo(() => deals.filter((d) => {
    const matchQ = query ? `${d.entity} ${d.codeName} ${d.description}`.toLowerCase().includes(query.toLowerCase()) : true;
    return matchQ && (category === "All" || d.category === category) && (status === "All" || d.status === status);
  }), [deals, query, category, status]);

  const totalValue = useMemo(() => filteredDeals.reduce((s, d) => s + (d.size || 0), 0), [filteredDeals]);

  return (
    <div className="h-screen flex flex-col bg-white text-zinc-900 overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-zinc-100 bg-white px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center">
            <Ic name="globe" size={14} className="text-white" />
          </div>
          <div>
            <span className="text-sm font-semibold text-zinc-900">African Aspirations</span>
            <span className="ml-2 text-xs text-zinc-400">Pipeline Intelligence</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 hidden sm:block">{user}</span>
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="h-7 px-3 text-xs rounded-lg border-zinc-200 text-zinc-500 hover:text-zinc-800 gap-1.5"
          >
            <Ic name="logout" size={13} />
            Sign out
          </Button>
        </div>
      </header>

      {/* Page content */}
      <div className="flex-1 flex flex-col overflow-hidden p-5 gap-3 bg-zinc-50/50">
        {/* Filter bar */}
        <div className="shrink-0 flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[180px]">
            <Ic name="search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search deals…"
              className="h-9 pl-8 text-sm bg-white border-zinc-200 rounded-lg focus-visible:ring-0 focus-visible:border-zinc-400"
            />
          </div>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-9 w-36 rounded-lg border-zinc-200 bg-white text-sm text-zinc-700 focus:ring-0">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-36 rounded-lg border-zinc-200 bg-white text-sm text-zinc-700 focus:ring-0">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>

          <div className="text-sm text-zinc-500 px-1">
            <span className="font-semibold text-zinc-800">{filteredDeals.length}</span> deals
            {totalValue > 0 && <> · <span className="font-semibold text-zinc-800">{fmtMoney(totalValue)}</span></>}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="text-left text-[11px] font-medium uppercase tracking-widest text-zinc-400 px-5 py-3 whitespace-nowrap">Deal</th>
                <th className="text-left text-[11px] font-medium uppercase tracking-widest text-zinc-400 px-5 py-3 whitespace-nowrap">Category</th>
                <th className="text-left text-[11px] font-medium uppercase tracking-widest text-zinc-400 px-5 py-3 whitespace-nowrap">Status</th>
                <th className="text-left text-[11px] font-medium uppercase tracking-widest text-zinc-400 px-5 py-3 whitespace-nowrap">Size</th>
                <th className="text-left text-[11px] font-medium uppercase tracking-widest text-zinc-400 px-5 py-3 whitespace-nowrap">Deliverables</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-zinc-400 text-sm">No deals match your filters.</td>
                </tr>
              ) : filteredDeals.map((deal) => (
                <tr key={deal.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/80 transition-colors">
                  <td className="px-5 py-4 align-top">
                    <div className="font-semibold text-zinc-900">{deal.entity}</div>
                    <div className="mt-0.5 text-xs text-zinc-400">{deal.codeName} · {deal.description}</div>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <Badge className={`${catBadge[deal.category] || "bg-zinc-100 text-zinc-600 border border-zinc-200"} rounded-full px-2.5 py-0.5 text-[11px] font-medium`}>
                      {deal.category}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <Badge className={`${statBadge[deal.status] || "bg-zinc-100 text-zinc-600 border border-zinc-200"} rounded-full px-2.5 py-0.5 text-[11px] font-medium`}>
                      {deal.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 align-top text-zinc-700 tabular-nums whitespace-nowrap">{fmtMoney(deal.size)}</td>
                  <td className="px-5 py-4 align-top text-zinc-500">{deal.deliverables}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AfricanAspirationsApp() {
  const [user, setUser] = useState(() => {
    try { return sessionStorage.getItem("aa_user") || null; } catch { return null; }
  });

  function login(email) { sessionStorage.setItem("aa_user", email); setUser(email); }
  function logout() { sessionStorage.removeItem("aa_user"); setUser(null); }

  return (
    <>
      {!user && <AuthScreen onLogin={login} />}
      {user && ADMIN_EMAILS.includes(user) && <AdminDashboard user={user} onLogout={logout} />}
      {user && !ADMIN_EMAILS.includes(user) && <UserDashboard user={user} onLogout={logout} />}
      <Agentation />
    </>
  );
}
