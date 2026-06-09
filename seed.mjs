import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://gmcaxxgppmdfltopxrbf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtY2F4eGdwcG1kZmx0b3B4cmJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMTU3NjgsImV4cCI6MjA5NjU5MTc2OH0.nGlj85vObctAPCHiUaT2WDKigKZcwa8DsF2RRn-rV5Y'
)

const deals = [
  { entity: "Mava Consulting", code_name: "Project Map", category: "Funding", description: "Master Phase for Ocean Community", size: 21000000, deliverables: "Investor Readiness, Funding", status: "Active" },
  { entity: "Best Life Clinic", code_name: "Project Bold", category: "Consulting", description: "Diagnostic and Herbal Clinic", size: 30000, deliverables: "Financial Structuring, Investor Readiness", status: "Active" },
  { entity: "Project Theresa", code_name: "Project Atlas", category: "Funding", description: "Fuel Station", size: 200000, deliverables: "Investor Readiness, Funding", status: "Active" },
  { entity: "Danpong Hospital", code_name: "Project Dan", category: "Consulting", description: "Healthcare facility", size: null, deliverables: "Valuation, Funding", status: "Active" },
  { entity: "Innovare", code_name: "Project Inn", category: "Funding", description: "IT Systems Company", size: null, deliverables: "Valuation", status: "Active" },
  { entity: "Oya Ghana", code_name: "Project Oak", category: "Funding", description: "Intercity Bus Digitilisation project", size: 70000, deliverables: "Investor Readiness, Funding", status: "Active" },
  { entity: "Asa Global Energy Solutions", code_name: "Project Globe", category: "Funding", description: "Petroleum Importation and distribution", size: 500000000, deliverables: "Valuation, Funding", status: "Active" },
  { entity: "Ahafo Pride LTD", code_name: "Project Ahab", category: "Funding", description: "Agribusiness", size: 5000000, deliverables: "Investor Readiness, Funding", status: "Active" },
  { entity: "AgriOne Africa", code_name: "Project Agric", category: "Funding", description: "AgriTech", size: 350000, deliverables: "Investor Readiness, Funding", status: "Active" },
  { entity: "Equity Savings and Loans", code_name: "Project Equestrian", category: "Consulting", description: "Microfinance", size: 20000000, deliverables: "Valuation, Funding", status: "Active" },
  { entity: "Tilly's Farm", code_name: "Project Tiles", category: "Funding", description: "Agribusiness", size: 1000000, deliverables: "Valuation, Funding", status: "Active" },
  { entity: "Central Oil Mills Ltd", code_name: "Project Center", category: "Brokerage", description: "Oil Production", size: null, deliverables: "Valuation", status: "Active" },
  { entity: "Harriben Granite Ltd", code_name: "Project Happy", category: "Consulting", description: "Granite Extraction", size: 10000000, deliverables: "Investor Readiness, Funding", status: "Active" },
  { entity: "Merbarproperties", code_name: "Project Marble", category: "Funding", description: "Property Development", size: 4500000, deliverables: "Funding", status: "Active" },
  { entity: "Cups and Cones", code_name: "Project Cane", category: "Brokerage", description: "Food Business", size: null, deliverables: "Valuation and Funding", status: "Active" },
  { entity: "Indulge", code_name: "Project Instagram", category: "Brokerage", description: "Hospitality & Food Services", size: 1700000, deliverables: "Funding", status: "Active" },
  { entity: "Kazkazini", code_name: "Project KANDA", category: "Brokerage", description: "Agriculture & Agro-Processing", size: 3720000, deliverables: "Funding", status: "Active" },
  { entity: "Manet", code_name: "Project Merchant", category: "Brokerage", description: "Real Estate", size: 30000000, deliverables: "Funding", status: "Active" },
  { entity: "Kings Palace School", code_name: "Project KINGS", category: "Brokerage", description: "Education", size: 1200000, deliverables: "Funding", status: "Active" },
  { entity: "D'Avenue", code_name: "Project Dominion", category: "Brokerage", description: "Hospitality & Food Services", size: 6200000, deliverables: "Funding", status: "Active" },
  { entity: "GreenGold", code_name: "Project Green", category: "Brokerage", description: "Agriculture & Agro-Processing", size: 40000, deliverables: "Funding", status: "Active" },
  { entity: "Land Sale - Yaw Owusu Ansah", code_name: "Project Answer", category: "Brokerage", description: "Real Estate", size: null, deliverables: "Funding", status: "Active" },
  { entity: "Tans Hostel", code_name: "Project Tulip", category: "Brokerage", description: "Hospitality & Food Services", size: 5000000, deliverables: "Funding", status: "Active" },
  { entity: "Modern Properties - Land Sale", code_name: "Project Modern", category: "Brokerage", description: "Real Estate", size: 3000000, deliverables: "Funding", status: "Active" },
  { entity: "Ederick - Emerge", code_name: "Project Emerge", category: "Brokerage", description: "Trade, Manufacturing & Retail", size: 5000000, deliverables: "Funding", status: "Active" },
  { entity: "World-beater Security Services", code_name: "Project Wife", category: "Brokerage", description: "Security & Services", size: null, deliverables: "Funding", status: "Active" },
  { entity: "Land - Grace Asare", code_name: "Project Good", category: "Brokerage", description: "Real Estate", size: null, deliverables: "Funding", status: "Active" },
  { entity: "Land - Kuorkor Dzani", code_name: "Project Kooks", category: "Brokerage", description: "Real Estate", size: 160000, deliverables: "Funding", status: "Active" },
  { entity: "Apartment (Solaris) - Kuorkor Dzani", code_name: "Project Sol", category: "Brokerage", description: "Real Estate", size: 160000, deliverables: "Funding", status: "Active" },
  { entity: "Lot30 Bistro & Bar", code_name: "Project Barn", category: "Brokerage", description: "Hospitality & Food Services", size: 374000, deliverables: "Funding", status: "Active" },
  { entity: "Dan's Paradise Hotel", code_name: "Project Pond", category: "Brokerage", description: "Hospitality & Food Services", size: 2000000, deliverables: "Funding", status: "Active" },
  { entity: "AH Nissi Company Ltd", code_name: "Project Nice", category: "Brokerage", description: "Real Estate", size: 192000, deliverables: "Funding", status: "Active" },
  { entity: "ESBEE", code_name: "Project Bee", category: "Brokerage", description: "Trade, Manufacturing & Retail", size: 3000000, deliverables: "Funding", status: "Active" },
  { entity: "Magdavis Catering Services", code_name: "Project Carter", category: "Brokerage", description: "Hospitality & Food Services", size: 500000, deliverables: "Funding", status: "Active" },
  { entity: "Agnes Bakery", code_name: "Project Sweet", category: "Brokerage", description: "Hospitality & Food Services", size: 250000, deliverables: "Funding", status: "Active" },
  { entity: "Royal Palm City", code_name: "Project Palm", category: "Brokerage", description: "Real Estate", size: 5000000, deliverables: "Funding", status: "Active" },
  { entity: "ULTIMATE HOTEL", code_name: "Project United", category: "Brokerage", description: "Hospitality & Food Services", size: 2500000, deliverables: "Funding", status: "Active" },
  { entity: "Colonel Takye", code_name: "Project MULTI", category: "Brokerage", description: "Real Estate", size: 2200000, deliverables: "Funding", status: "Active" },
  { entity: "Scenic Restaurant", code_name: "Project Starz", category: "Brokerage", description: "Hospitality & Food Services", size: 876000, deliverables: "Funding", status: "Active" },
  { entity: "UFO BURGER", code_name: "Project Space", category: "Brokerage", description: "Hospitality & Food Services", size: 100000, deliverables: "Funding", status: "Active" },
  { entity: "Marvello Gastro Lounge", code_name: "Project Marvel", category: "Brokerage", description: "Hospitality & Food Services", size: 1000000, deliverables: "Funding", status: "Active" },
  { entity: "Le Pavillon", code_name: "Project French", category: "Brokerage", description: "Hospitality & Food Services", size: 4000000, deliverables: "Funding", status: "Active" },
  { entity: "Office Complex", code_name: "Project Happy II", category: "Brokerage", description: "Real Estate", size: 1800000, deliverables: "Funding", status: "Active" },
  { entity: "Land", code_name: "Project Earth", category: "Brokerage", description: "Real Estate", size: 76000, deliverables: "Funding", status: "Active" },
  { entity: "Eldora Royal Farms", code_name: "Project Crown", category: "Brokerage", description: "Agriculture & Agro-Processing", size: 233000, deliverables: "Funding", status: "Active" },
  { entity: "DF Poultry", code_name: "Project Pot", category: "Brokerage", description: "Agriculture & Agro-Processing", size: 700000, deliverables: "Funding", status: "Active" },
  { entity: "Enart Farms and Consult", code_name: "Project Moon", category: "Brokerage", description: "Agriculture & Agro-Processing", size: 860000, deliverables: "Funding", status: "Active" },
  { entity: "CHARLESTON Hotel", code_name: "Project Yellow", category: "Brokerage", description: "Hospitality & Food Services", size: 4000000, deliverables: "Funding", status: "Active" },
  { entity: "Poultry Tech", code_name: "Projet PT", category: "Brokerage", description: "Agriculture & Agro-Processing", size: 70000, deliverables: "Funding", status: "Active" },
  { entity: "Onlime Africa Limited", code_name: "Project SL", category: "Brokerage", description: "Financial Services", size: 2250000, deliverables: "Funding", status: "Active" },
  { entity: "Project Velvet", code_name: "Project Velvet", category: "Brokerage", description: "Hospitality & Food Services", size: null, deliverables: "Valuation and Funding", status: "Active" },
]

const approvedEmails = [
  { email: "admin@africanaspirations.com", is_admin: true },
  { email: "demo@africanaspirations.com", is_admin: false },
  { email: "investor@africanaspirations.com", is_admin: false },
]

async function seed() {
  console.log("Seeding deals...")
  const { data: dealsData, error: dealsError } = await supabase
    .from("deals")
    .upsert(deals, { onConflict: "entity,code_name" })
    .select()

  if (dealsError) {
    console.error("Deals error:", dealsError.message)
  } else {
    console.log(`✓ ${dealsData.length} deals inserted`)
  }

  console.log("Seeding approved emails...")
  const { data: emailsData, error: emailsError } = await supabase
    .from("approved_emails")
    .upsert(approvedEmails, { onConflict: "email" })
    .select()

  if (emailsError) {
    console.error("Emails error:", emailsError.message)
  } else {
    console.log(`✓ ${emailsData.length} approved emails inserted`)
  }
}

seed()
