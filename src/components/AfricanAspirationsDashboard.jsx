"use client"
import { useState, useMemo } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

// ─── Iconsax outline SVG icons ───────────────
const Icon = ({ d, size = 20, className = "", strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}
    xmlns="http://www.w3.org/2000/svg">
    {Array.isArray(d)
      ? d.map((path, i) => <path key={i} d={path} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />)
      : <path d={d} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />}
  </svg>
);

// (icons object omitted for brevity—kept inline in original file)
const icons = {
  briefcase: ["M16 2H8C4 2 2 4 2 8v13c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V8c0-4-2-6-6-6z","M8 2v3","M16 2v3","M2 9h20"],
  chart: ["M6.87 18.62v-2.13","M12 18.62V14.5","M17.13 18.62v-4.27","M17.13 5.38 11.87 11c-.44.45-1.17.45-1.61 0L7.5 8.2","M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10z"],
  money: ["M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z","M8.67 10.37c0-1.31 1.07-2.37 2.37-2.37h1.93c1.17 0 2.03.87 2.03 2v.03c0 1.26-.93 2-2 2l-2.04.01","M8.67 10.37h6.33","M11.99 14H13c1.1 0 2 .9 2 2s-.9 2-2 2H10.67c-1.3 0-2.37-1.06-2.37-2.37","M12 7V8","M12 16v1"],
  document: ["M22 10v5c0 5-2 7-7 7H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h5","M22 10h-4c-3 0-4-1-4-4V2l8 8z","M7 13h6","M7 17h4"],
  search: ["M11 20a9 9 0 1 0 0-18 9 9 0 0 0 0 18z","M18.93 20.69c.39 1.17 1.28 1.27 1.97.22l1.98-3.07c.63-.97.2-1.77-.95-1.77h-3.82c-1.15 0-1.58.8-.95 1.77z"],
  filter: ["M10.93 2.31H5.93c-1.06 0-2.12.78-2.12 2.12v1c0 .96.62 2.15 1.25 2.78l5 4.41c.71.62 1.25 1.81 1.25 2.78v5c0 .84.56 1.41 1.25 1.03l3.12-1.87c.34-.19.56-.62.56-1.03v-4.19c0-1.03.56-2.15 1.25-2.78l4.37-4.47c.62-.62 1.25-1.78 1.25-2.78v-1c0-1.25-1-2.12-2.12-2.12H10.93z"],
  close: ["M18 6 6 18","M6 6l12 12"],
  edit: ["M13.26 3.6l-8.21 8.69c-.31.33-.61.98-.67 1.43l-.37 3.24c-.13 1.17.71 1.97 1.87 1.76l3.22-.55c.45-.08 1.08-.41 1.39-.75l8.21-8.69c1.42-1.5 2.06-3.21-.15-5.3-2.2-2.07-3.87-1.33-5.29.17z","M11.89 5.05c.38 2.91 2.86 5.23 5.79 5.45","M3 22h18"],
  upload: ["M9 17V11l-2 2","M9 11l2 2","M22 10v5c0 5-2 7-7 7H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h5","M22 10h-4c-3 0-4-1-4-4V2l8 8z"],
  logout: ["M8.9 7.56c.31-3.6 2.16-5.07 6.21-5.07h.13c4.47 0 6.26 1.79 6.26 6.26v6.52c0 4.47-1.79 6.26-6.26 6.26h-.13c-4.02 0-5.87-1.45-6.2-4.99","M15 12H3.62","M5.85 8.65 2.5 12l3.35 3.35"],
  lock: ["M6 10V8c0-3.31 1-6 6-6s6 2.69 6 6v2","M12 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z","M17 22H7c-4 0-5-1-5-5v-2c0-4 1-5 5-5h10c4 0 5 1 5 5v2c0 4-1 5-5 5z"],
  eye: ["M15.58 12c0 1.98-1.6 3.58-3.58 3.58S8.42 13.98 8.42 12s1.6-3.58 3.58-3.58S15.58 10.02 15.58 12z","M12 20.27c3.53 0 6.82-2.08 9.11-5.68.9-1.41.9-3.78 0-5.19C18.82 5.81 15.53 3.73 12 3.73c-3.53 0-6.82 2.08-9.11 5.68-.9 1.41-.9 3.78 0 5.19C5.18 18.19 8.47 20.27 12 20.27z"],
  plus: ["M6 12h12","M12 18V6"],
  trash: ["M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98","M8.5 4.97l.22-1.31C8.88 2.71 9 2 10.69 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3","M18.85 9.14l-.65 10.07C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14","M10.33 16.5h3.33","M9.5 12.5h5"],
  settings: ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z","M2 12.88v-1.76c0-1.04.85-1.9 1.9-1.9 1.81 0 2.55-1.28 1.64-2.85-.52-.9-.21-2.07.7-2.59l1.73-.99c.79-.47 1.81-.19 2.28.6l.11.19c.9 1.57 2.38 1.57 3.29 0l.11-.19c.47-.79 1.49-1.07 2.28-.6l1.73.99c.91.52 1.22 1.69.7 2.59-.91 1.57-.17 2.85 1.64 2.85 1.04 0 1.9.85 1.9 1.9v1.76c0 1.04-.85 1.9-1.9 1.9-1.81 0-2.55 1.28-1.64 2.85.52.91.21 2.07-.7 2.59l-1.73.99c-.79.47-1.81.19-2.28-.6l-.11-.19c-.9-1.57-2.38-1.57-3.29 0l-.11.19c-.47-.79-1.49 1.07-2.28.6l-1.73-.99a1.9 1.9 0 0 1-.7-2.59c.91-1.57.17-2.85-1.64-2.85A1.91 1.91 0 0 1 2 12.88z"],
  tag: ["M2.24 15.46 8.54 21.76c1.27 1.27 3.33 1.27 4.61 0l8.61-8.61c1.27-1.27 1.27-3.34 0-4.61L15.46 2.24C14.82 1.6 13.93 1.22 13 1.22H4c-1.55 0-2.78 1.23-2.78 2.78v9c0 .94.38 1.83 1.02 2.46z","M7.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"],
  building: ["M17 22V6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v16","M3 22h18","M10 10h1","M10 14h1","M13 10h1","M13 14h1","M17 22h-5v-4h-1v4H7"],
  globe: ["M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z","M8 3H9c-1.75 5.49-1.75 12.51 0 18H8","M15 3c1.75 5.49 1.75 12.51 0 18","M3 16v-1c5.49 1.75 12.51 1.75 18 0v1","M3 9c5.49-1.75 12.51-1.75 18 0"],
  arrowDown: ["M19.92 8.95l-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"],
  arrowUp: ["M4.08 15.05l6.52-6.52c.77-.77 2.03-.77 2.8 0l6.52 6.52"],
  sortAsc: ["M3 7h18","M3 12h12","M3 17h6"],
  pdf: ["M22 10v5c0 5-2 7-7 7H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h5","M22 10h-4c-3 0-4-1-4-4V2l8 8z","M10 17v-3","M14 17v-1","M10 14c0-.55.45-1 1-1h2c.55 0 1 .45 1 1"],
  warning: ["M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z","M12 9v4","M12 17h.01"],
  user: ["M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z","M20.59 22c0-3.31-3.84-6-8.59-6s-8.59 2.69-8.59 6"],
  mail: ["M17 3.5H7c-3 0-5 1.5-5 5v7c0 3.5 2 5 5 5h10c3 0 5-1.5 5-5v-7c0-3.5-2-5-5-5z","M12 12.87 4.5 7h15l-7.5 5.87z"],
};

const Ic = ({ name, size = 18, className = "" }) => {
  const d = icons[name];
  if (!d) return null;
  return <Icon d={d} size={size} className={className} />;
};

// ─── Data ────────────────────────────────────
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

// ─── Helpers ─────────────────────────────────
function fmtMoney(n) {
  if (!n) return "TBD";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

const catBadge = { Funding: "bg-emerald-50 text-emerald-700 border-emerald-200", Brokerage: "bg-blue-50 text-blue-700 border-blue-200", Consulting: "bg-amber-50 text-amber-700 border-amber-200" };
const statBadge = { Active: "bg-green-50 text-green-700 border-green-200", Closed: "bg-red-50 text-red-700 border-red-200", "On Hold": "bg-orange-50 text-orange-700 border-orange-200" };

function ls(key, fallback) { try { const v = sessionStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } }
function ss(key, val) { try { sessionStorage.setItem(key, JSON.stringify(val)); } catch {} }

// ─── Auth ─────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function submit() {
    setLoading(true);
    setTimeout(() => {
      const approved = ls("aa_approved", APPROVED_EMAILS);
      if (approved.includes(email.trim().toLowerCase())) {
        onLogin(email.trim().toLowerCase());
      } else {
        setErr("This email is not approved. Contact your administrator for access.");
      }
      setLoading(false);
    }, 500);
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
      <div className="w-full max-w-sm">
        {/* Wordmark */}
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
                type="email" value={email}
                onChange={e => { setEmail(e.target.value); setErr(""); }}
                onKeyDown={e => e.key === "Enter" && email && submit()}
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

// The rest of the component has been simplified to render the dashboard UI directly.

function DashboardScreen({ user, onLogout }) {
  const isAdmin = ADMIN_EMAILS.includes(user);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [deals, setDeals] = useState(() => ls("aa_deals", SEED_DEALS));
  const [approvedEmails, setApprovedEmails] = useState(() => ls("aa_approved", APPROVED_EMAILS));
  const [newDeal, setNewDeal] = useState({ entity: "", codeName: "", category: "Funding", description: "", size: "", deliverables: "", status: "Active" });
  const [newUserEmail, setNewUserEmail] = useState("");
  const [editingDeal, setEditingDeal] = useState(null);
  const categories = ["All", "Funding", "Brokerage", "Consulting"];
  const statuses = ["Active", "Closed", "On Hold"];

  function persistDeals(nextDeals) {
    setDeals(nextDeals);
    ss("aa_deals", nextDeals);
  }

  function persistApprovedEmails(nextEmails) {
    setApprovedEmails(nextEmails);
    ss("aa_approved", nextEmails);
  }

  function addDeal() {
    if (!newDeal.entity.trim() || !newDeal.codeName.trim()) return;
    const deal = {
      ...newDeal,
      id: Date.now(),
      size: newDeal.size ? Number(newDeal.size) : null,
    };
    persistDeals([...deals, deal]);
    setNewDeal({ entity: "", codeName: "", category: "Funding", description: "", size: "", deliverables: "", status: "Active" });
  }

  function saveEditedDeal() {
    if (!editingDeal) return;
    const updatedDeal = {
      ...editingDeal,
      size: editingDeal.size ? Number(editingDeal.size) : null,
    };
    persistDeals(deals.map((deal) => (deal.id === updatedDeal.id ? updatedDeal : deal)));
    setEditingDeal(null);
  }

  function removeDeal(id) {
    persistDeals(deals.filter((deal) => deal.id !== id));
  }

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesQuery = query
        ? `${deal.entity} ${deal.codeName} ${deal.description}`.toLowerCase().includes(query.toLowerCase())
        : true;
      const matchesCategory = category === "All" || deal.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [deals, query, category]);

  const totalValue = useMemo(
    () => filteredDeals.reduce((sum, deal) => sum + (deal.size || 0), 0),
    [filteredDeals]
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="flex flex-col gap-4 border-b border-zinc-200 bg-white p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-zinc-500">Welcome back,</p>
          <h1 className="text-3xl font-semibold">African Aspirations Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500">Signed in as {user}</p>
          <Badge className="mt-3 inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
            {isAdmin ? "Admin access" : "Read-only access"}
          </Badge>
        </div>
        <Button onClick={onLogout} className="rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800">
          Sign out
        </Button>
      </header>

      <main className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-zinc-200">
            <p className="text-sm text-zinc-500">Active pipeline</p>
            <p className="mt-3 text-3xl font-semibold">{filteredDeals.length}</p>
            <Badge className="mt-3 inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
              Category: {category}
            </Badge>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-zinc-200">
            <p className="text-sm text-zinc-500">Total deal value</p>
            <p className="mt-3 text-3xl font-semibold">{totalValue ? fmtMoney(totalValue) : "TBD"}</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-zinc-200">
            <p className="text-sm text-zinc-500">Unique entities</p>
            <p className="mt-3 text-3xl font-semibold">{new Set(filteredDeals.map((deal) => deal.entity)).size}</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.5fr_0.9fr]">
          <section className="rounded-3xl bg-white p-5 shadow-sm border border-zinc-200">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Deal pipeline</h2>
                <p className="text-sm text-zinc-500">Search and filter live deal pipeline items.</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                    Search
                  </Label>
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search deals"
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                    Category
                  </Label>
                  <Select value={category} onValueChange={(value) => setCategory(value)}>
                    <SelectTrigger className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-700">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="mt-2 rounded-2xl border border-zinc-200 bg-white shadow-sm">
                      {categories.map((item) => (
                        <SelectItem
                          key={item}
                          value={item}
                          className="cursor-pointer px-3 py-2 text-sm hover:bg-zinc-100"
                        >
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredDeals.length ? (
                filteredDeals.slice(0, 12).map((deal) => (
                  <div
                    key={deal.id}
                    className="rounded-3xl border border-zinc-200 p-4 hover:border-zinc-300"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-zinc-900">{deal.entity}</h3>
                        <p className="text-sm text-zinc-500">{deal.codeName} · {deal.description}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={`${catBadge[deal.category] || "bg-zinc-100 text-zinc-700"} rounded-full px-3 py-1 text-xs font-medium`}>
                          {deal.category}
                        </Badge>
                        <Badge className={`${statBadge[deal.status] || "bg-zinc-100 text-zinc-700"} rounded-full px-3 py-1 text-xs font-medium`}>
                          {deal.status}
                        </Badge>
                        {isAdmin && (
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => setEditingDeal({ ...deal, size: deal.size ?? "" })}
                              variant="outline"
                              size="sm"
                              className="h-8 rounded-xl border-zinc-200 px-3 text-xs font-light"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => removeDeal(deal.id)}
                              variant="ghost"
                              size="sm"
                              className="h-8 rounded-xl text-red-600 hover:bg-red-50 text-xs font-light"
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                      <span>{fmtMoney(deal.size)}</span>
                      <span>{deal.deliverables}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-sm text-zinc-500">
                  No deals match your search and filter criteria.
                </div>
              )}
            </div>
          </section>

          <aside className="rounded-3xl bg-white p-5 shadow-sm border border-zinc-200">
            {isAdmin ? (
              <>
                <h2 className="text-lg font-semibold">Admin controls</h2>
                <p className="mt-2 text-sm text-zinc-500">Create, edit, or remove deals from the pipeline.</p>

                <div className="mt-5 space-y-4 rounded-3xl bg-zinc-50 p-4">
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-zinc-900">Add a new deal</h3>
                    <Input
                      value={newDeal.entity}
                      onChange={(event) => setNewDeal((prev) => ({ ...prev, entity: event.target.value }))}
                      placeholder="Entity name"
                      className="h-10 text-sm border-zinc-200 rounded-xl"
                    />
                    <Input
                      value={newDeal.codeName}
                      onChange={(event) => setNewDeal((prev) => ({ ...prev, codeName: event.target.value }))}
                      placeholder="Code name"
                      className="h-10 text-sm border-zinc-200 rounded-xl"
                    />
                    <Input
                      value={newDeal.description}
                      onChange={(event) => setNewDeal((prev) => ({ ...prev, description: event.target.value }))}
                      placeholder="Description"
                      className="h-10 text-sm border-zinc-200 rounded-xl"
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Select value={newDeal.category} onValueChange={(value) => setNewDeal((prev) => ({ ...prev, category: value }))}>
                        <SelectTrigger className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-700">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="mt-2 rounded-2xl border border-zinc-200 bg-white shadow-sm">
                          {categories.slice(1).map((item) => (
                            <SelectItem key={item} value={item} className="cursor-pointer px-3 py-2 text-sm hover:bg-zinc-100">
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={newDeal.status} onValueChange={(value) => setNewDeal((prev) => ({ ...prev, status: value }))}>
                        <SelectTrigger className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-700">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="mt-2 rounded-2xl border border-zinc-200 bg-white shadow-sm">
                          {statuses.map((item) => (
                            <SelectItem key={item} value={item} className="cursor-pointer px-3 py-2 text-sm hover:bg-zinc-100">
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        value={newDeal.size}
                        onChange={(event) => setNewDeal((prev) => ({ ...prev, size: event.target.value }))}
                        placeholder="Deal size"
                        type="number"
                        className="h-10 text-sm border-zinc-200 rounded-xl"
                      />
                      <Input
                        value={newDeal.deliverables}
                        onChange={(event) => setNewDeal((prev) => ({ ...prev, deliverables: event.target.value }))}
                        placeholder="Deliverables"
                        className="h-10 text-sm border-zinc-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <Button onClick={addDeal} className="w-full rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800">
                    Add deal
                  </Button>
                </div>

                <div className="mt-6 space-y-3">
                  <h3 className="text-sm font-semibold text-zinc-900">Admin email</h3>
                  {ADMIN_EMAILS.map((email) => (
                    <div key={email} className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3">
                      <span className="text-sm text-zinc-700">{email}</span>
                      <Badge className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">Admin</Badge>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-3xl bg-zinc-50 p-4">
                  <h3 className="text-sm font-semibold text-zinc-900">Create regular user</h3>
                  <p className="text-xs text-zinc-500">Add an approved email to give view-only access.</p>
                  <div className="mt-3 flex gap-2">
                    <Input
                      value={newUserEmail}
                      onChange={(event) => setNewUserEmail(event.target.value)}
                      placeholder="user@example.com"
                      type="email"
                      className="h-10 flex-1 text-sm border-zinc-200 rounded-xl"
                    />
                    <Button
                      onClick={() => {
                        const email = newUserEmail.trim().toLowerCase();
                        if (!email || approvedEmails.includes(email)) return;
                        persistApprovedEmails([...approvedEmails, email]);
                        setNewUserEmail("");
                      }}
                      className="rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
                    >
                      Add
                    </Button>
                  </div>
                  {approvedEmails.filter((email) => !ADMIN_EMAILS.includes(email)).length > 0 && (
                    <div className="mt-4 space-y-2 text-sm text-zinc-700">
                      <p className="font-medium">Approved regular users</p>
                      {approvedEmails
                        .filter((email) => !ADMIN_EMAILS.includes(email))
                        .map((email) => (
                          <div key={email} className="rounded-2xl bg-white px-3 py-2 text-zinc-700">
                            {email}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold">Regular user view</h2>
                <p className="mt-2 text-sm text-zinc-500">You can view the pipeline but cannot make changes.</p>
                <div className="mt-6 rounded-3xl bg-violet-50 p-4 text-sm text-violet-700">
                  Administrators can add, edit, and delete deals from this panel.
                </div>
              </>
            )}
          </aside>
        </div>
      </main>

      {editingDeal && (
        <Dialog open={true} onOpenChange={(open) => !open && setEditingDeal(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Edit deal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                value={editingDeal.entity}
                onChange={(event) => setEditingDeal((prev) => ({ ...prev, entity: event.target.value }))}
                placeholder="Entity"
                className="h-10 text-sm border-zinc-200 rounded-xl"
              />
              <Input
                value={editingDeal.codeName}
                onChange={(event) => setEditingDeal((prev) => ({ ...prev, codeName: event.target.value }))}
                placeholder="Code name"
                className="h-10 text-sm border-zinc-200 rounded-xl"
              />
              <Input
                value={editingDeal.description}
                onChange={(event) => setEditingDeal((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Description"
                className="h-10 text-sm border-zinc-200 rounded-xl"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Select value={editingDeal.category} onValueChange={(value) => setEditingDeal((prev) => ({ ...prev, category: value }))}>
                  <SelectTrigger className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-700">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="mt-2 rounded-2xl border border-zinc-200 bg-white shadow-sm">
                    {categories.slice(1).map((item) => (
                      <SelectItem key={item} value={item} className="cursor-pointer px-3 py-2 text-sm hover:bg-zinc-100">
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={editingDeal.status} onValueChange={(value) => setEditingDeal((prev) => ({ ...prev, status: value }))}>
                  <SelectTrigger className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-700">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="mt-2 rounded-2xl border border-zinc-200 bg-white shadow-sm">
                    {statuses.map((item) => (
                      <SelectItem key={item} value={item} className="cursor-pointer px-3 py-2 text-sm hover:bg-zinc-100">
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  value={editingDeal.size}
                  onChange={(event) => setEditingDeal((prev) => ({ ...prev, size: event.target.value }))}
                  placeholder="Deal size"
                  type="number"
                  className="h-10 text-sm border-zinc-200 rounded-xl"
                />
                <Input
                  value={editingDeal.deliverables}
                  onChange={(event) => setEditingDeal((prev) => ({ ...prev, deliverables: event.target.value }))}
                  placeholder="Deliverables"
                  className="h-10 text-sm border-zinc-200 rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setEditingDeal(null)} className="rounded-xl px-4 py-2 text-sm font-light">
                  Cancel
                </Button>
                <Button onClick={saveEditedDeal} className="rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800">
                  Save changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default function AfricanAspirationsApp() {
  const [user, setUser] = useState(() => {
    try {
      return sessionStorage.getItem("aa_user") || null;
    } catch {
      return null;
    }
  });

  function login(email) {
    sessionStorage.setItem("aa_user", email);
    setUser(email);
  }

  function logout() {
    sessionStorage.removeItem("aa_user");
    setUser(null);
  }

  if (!user) return <AuthScreen onLogin={login} />;
  return <DashboardScreen user={user} onLogout={logout} />;
}
