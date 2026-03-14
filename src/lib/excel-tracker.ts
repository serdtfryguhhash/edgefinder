import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data");
const SIGNUPS_FILE = path.join(DATA_DIR, "signups.xlsx");

export interface SignupData {
  email: string;
  name: string;
  referralCode?: string;
  timestamp?: string;
  tier?: string;
  status?: string;
}

export function logSignup(data: SignupData): void {
  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const row = {
    Email: data.email,
    "Full Name": data.name,
    "Referral Code": data.referralCode || "",
    "Signup Date": data.timestamp || new Date().toISOString(),
    "Subscription Tier": data.tier || "Free",
    Status: data.status || "Active",
  };

  let workbook: XLSX.WorkBook;
  
  if (fs.existsSync(SIGNUPS_FILE)) {
    workbook = XLSX.readFile(SIGNUPS_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const existing = XLSX.utils.sheet_to_json(sheet);
    existing.push(row);
    const newSheet = XLSX.utils.json_to_sheet(existing);
    workbook.Sheets[workbook.SheetNames[0]] = newSheet;
  } else {
    workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet([row]);
    XLSX.utils.book_append_sheet(workbook, sheet, "Signups");
  }

  XLSX.writeFile(workbook, SIGNUPS_FILE);
}

export function getSignupStats(): { total: number; thisMonth: number; thisWeek: number } {
  if (!fs.existsSync(SIGNUPS_FILE)) {
    return { total: 0, thisMonth: 0, thisWeek: 0 };
  }

  const workbook = XLSX.readFile(SIGNUPS_FILE);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);
  
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  let thisMonth = 0;
  let thisWeek = 0;

  data.forEach((row) => {
    const date = new Date(row["Signup Date"]);
    if (date >= monthStart) thisMonth++;
    if (date >= weekStart) thisWeek++;
  });

  return { total: data.length, thisMonth, thisWeek };
}
