import React from 'react';
import { Something } from 'somewhere';
import { AnotherThing } from 'lucide-react';
import { FinalThing } from '../components/Whatever';

// ---> CLICK ON THIS EMPTY LINE AND PASTE IT HERE <---

export interface Metro2Violation {
  // ... the code you cut from the bottom ...
}

// ... the rest of your app's code will be down here ...
export default function ScanTestPage() {

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

// ─── Constants ────────────────────────────────────────────────────────────────

type Bureau = 'equifax' | 'experian' | 'transunion';

const BUREAU_META: Record<Bureau, { label: string; color: string; bg: string; border: string; dot: string }> = {
  equifax:    { label: 'Equifax',    color: 'text-red-400',    bg: 'bg-red-900/20',   border: 'border-red-700/40',   dot: 'bg-red-500' },
  experian:   { label: 'Experian',   color: 'text-blue-400',   bg: 'bg-blue-900/20',  border: 'border-blue-700/40',  dot: 'bg-blue-500' },
  transunion: { label: 'TransUnion', color: 'text-teal-400',   bg: 'bg-teal-900/20',  border: 'border-teal-700/40',  dot: 'bg-teal-500' },
};

// Metro 2 field schema — shown in comparison table
const M2_FIELDS = [
  { key: 'accountName',                label: 'Account / Furnisher Name',         section: 'Identification' },
  { key: 'accountNumber',              label: 'Account Number (masked)',           section: 'Identification' },
  { key: 'accountType',                label: 'Account Type / Portfolio Type',     section: 'Identification' },
  { key: 'responsibility',             label: 'Responsibility / Ownership',        section: 'Identification' },
  { key: 'originalCreditor',           label: 'Original Creditor',                section: 'Identification' },
  { key: 'creditorClassification',     label: 'Creditor Classification',           section: 'Identification' },
  { key: 'accountStatus',              label: 'Account Status / Pay Status',       section: 'Status' },
  { key: 'paymentStatus',              label: 'Payment Rating (K5 Code)',          section: 'Status' },
  { key: 'derogatoryFlag',             label: 'Derogatory Flag',                  section: 'Status' },
  { key: 'balance',                    label: 'Current Balance',                   section: 'Financials' },
  { key: 'creditLimit',                label: 'Credit Limit / High Credit',        section: 'Financials' },
  { key: 'pastDueAmount',              label: 'Amount Past Due',                   section: 'Financials' },
  { key: 'scheduledPayment',           label: 'Scheduled Monthly Payment',         section: 'Financials' },
  { key: 'highBalance',                label: 'High Balance / Original Amount',    section: 'Financials' },
  { key: 'chargeOffAmount',            label: 'Charge-Off Amount',                section: 'Financials' },
  { key: 'dateOpened',                 label: 'Date Opened / Assigned',            section: 'Dates' },
  { key: 'dateOfFirstDelinquency',     label: 'Date of First Delinquency (DOFD)', section: 'Dates' },
  { key: 'dateMajorDelinquency',       label: 'Date Major Delinquency First Rptd', section: 'Dates' },
  { key: 'dateClosed',                 label: 'Date Closed',                       section: 'Dates' },
  { key: 'lastPaymentDate',            label: 'Date of Last Payment',              section: 'Dates' },
  { key: 'lastReported',               label: 'Date Last Reported / Updated',      section: 'Dates' },
  { key: 'statusUpdatedDate',          label: 'Status Updated',                    section: 'Dates' },
  { key: 'sevenYearExpiry',            label: '7-Year Removal Date (est.)',        section: 'Dates' },
  { key: 'paymentHistory',             label: 'Payment History Profile',           section: 'History' },
  { key: 'lateCount30',                label: '30-Day Late Count',                 section: 'History' },
  { key: 'lateCount60',                label: '60-Day Late Count',                 section: 'History' },
  { key: 'lateCount90',                label: '90+ Day Late Count',                section: 'History' },
  { key: 'remarks',                    label: 'Remarks / Narrative Codes',         section: 'Compliance' },
  { key: 'consumerDispute',            label: 'Consumer Dispute Flag',             section: 'Compliance' },
  { key: 'specialComment',             label: 'Special Comment / Creditor Note',  section: 'Compliance' },
] as const;

type FieldKey = typeof M2_FIELDS[number]['key'];

// Metro 2 K4 Account Status map
const K4_CODES: Record<string, string> = {
  '11': 'Open/Current', '13': 'Paid/Closed', '62': 'Paid/Closed-Derog',
  '64': 'CO Paid/Closed', '71': '30–59 DPD', '78': '60–89 DPD',
  '80': '90–119 DPD', '82': '120–149 DPD', '83': '150–179 DPD',
  '84': '180+ DPD', '89': 'Derogatory', '93': 'Internal Collections',
  '94': 'Foreclosure', '95': 'Voluntary Surrender', '96': 'Repossession',
  '97': 'Charge-Off',
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface ForensicNote {
  level: 'critical' | 'high' | 'medium' | 'info';
  tag: string;
  detail: string;
}

interface Violation {
  field: FieldKey | 'cross';
  rule: string;
  fcra: string;
  severity: 'critical' | 'high' | 'medium';
  description: string;
}

interface Tradeline {
  id: string;
  accountName: string;
  accountNumber: string;
  accountType: string;
  responsibility: string;
  originalCreditor: string;
  creditorClassification: string;
  accountStatus: string;
  paymentStatus: string;
  derogatoryFlag: string;
  balance: string;
  creditLimit: string;
  pastDueAmount: string;
  scheduledPayment: string;
  highBalance: string;
  chargeOffAmount: string;
  dateOpened: string;
  dateOfFirstDelinquency: string;
  dateMajorDelinquency: string;
  dateClosed: string;
  lastPaymentDate: string;
  lastReported: string;
  statusUpdatedDate: string;
  sevenYearExpiry: string;
  paymentHistory: string;
  lateCount30: string;
  lateCount60: string;
  lateCount90: string;
  remarks: string;
  consumerDispute: string;
  specialComment: string;
  isDerogatory: boolean;
  violations: Violation[];
  forensicNotes: ForensicNote[];
  rawBlock: string;
}

interface BureauReport {
  bureau: Bureau;
  rawText: string;
  pageCount: number;
  detectedBureau: Bureau | null;
  tradelines: Tradeline[];
  publicRecords: string[];
  hardInquiries: { creditor: string; date: string; purpose: string }[];
  softInquiries: number;
  forensicSummary: ForensicNote[];
}

interface ComparisonRow {
  accountKey: string;
  equifax:    Tradeline | null;
  experian:   Tradeline | null;
  transunion: Tradeline | null;
  crossViolations: Violation[];
}

// ─── PDF Extraction ───────────────────────────────────────────────────────────

interface ExtractResult {
  text: string;
  pageCount: number;
  pageTexts: string[];
}

async function extractPdf(file: File): Promise<ExtractResult> {
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  const pageTexts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const raw = content.items as Array<{
      str: string;
      transform: number[];   // [scaleX, skewX, skewY, scaleY, x, y]
      width: number;
      height: number;
      fontName?: string;
    }>;

    if (raw.length === 0) { pageTexts.push(''); continue; }

    // --- 1. Merge fragments that are sub-word pieces on the same y position ---
    // pdfjs sometimes splits "Account" into "Ac" + "count" at the same (x+w, y)
    const merged: typeof raw = [];
    for (const item of raw) {
      if (!item.str) continue;
      const last = merged[merged.length - 1];
      const sameY = last && Math.abs(last.transform[5] - item.transform[5]) < 2;
      // "continuation" = item starts exactly where last item ended (within 1pt)
      const continuation = last && sameY &&
        Math.abs((last.transform[4] + (last.width || 0)) - item.transform[4]) < 2;
      if (continuation) {
        // Merge into previous item
        last.str += item.str;
        last.width = (last.width || 0) + (item.width || 0);
      } else {
        merged.push({ ...item });
      }
    }

    // --- 2. Sort top-to-bottom, left-to-right (PDF y-axis is bottom-up) ---
    merged.sort((a, b) => {
      const dy = b.transform[5] - a.transform[5]; // higher y = top of page
      if (Math.abs(dy) > 4) return dy;
      return a.transform[4] - b.transform[4];
    });

    // --- 3. Group into logical lines by y-proximity ---
    type Line = { y: number; items: typeof merged };
    const lineGroups: Line[] = [];
    for (const item of merged) {
      const y = item.transform[5];
      const existing = lineGroups.find(l => Math.abs(l.y - y) <= 4);
      if (existing) {
        existing.items.push(item);
        existing.items.sort((a, b) => a.transform[4] - b.transform[4]);
      } else {
        lineGroups.push({ y, items: [item] });
      }
    }
    lineGroups.sort((a, b) => b.y - a.y);

    // --- 4. Convert each line to a string, preserving column spacing ---
    const textLines: string[] = [];
    for (const lg of lineGroups) {
      let text = '';
      let prevX = -1;
      let prevW = 0;
      for (const item of lg.items) {
        const x = item.transform[4];
        const gap = prevX >= 0 ? x - (prevX + prevW) : 0;
        if (gap > 50) {
          text += '\t';         // large gap = column separator (tab)
        } else if (gap > 8) {
          text += ' ';          // small gap = word space
        }
        text += item.str;
        prevX = x;
        prevW = item.width || item.str.length * 5;
      }
      const trimmed = text.trim();
      if (trimmed) textLines.push(trimmed);
    }

    // --- 5. Post-process: expand "Label:Value" tab-separated into Label:\nValue pairs ---
    // This handles 2-column layouts where "Date Opened: \t 03/2021" appears on one line
    const expandedLines: string[] = [];
    for (const ln of textLines) {
      if (ln.includes('\t')) {
        // Split on tabs and re-join as label: value lines
        const parts = ln.split('\t').map(p => p.trim()).filter(Boolean);
        // If looks like interleaved label/value pairs (even count), expand them
        if (parts.length >= 2 && parts.length <= 6) {
          // Pair them up: even-indexed = labels, odd-indexed = values
          // But only if every other item looks like a field label (contains colon or is title-cased)
          const looksLikePairs = parts.some(p => p.includes(':'));
          if (looksLikePairs) {
            expandedLines.push(...parts.map(p => p.replace(/:$/, ':').trim()));
          } else {
            expandedLines.push(ln.replace(/\t/g, '  '));
          }
        } else {
          expandedLines.push(ln.replace(/\t/g, '  '));
        }
      } else {
        expandedLines.push(ln);
      }
    }

    pageTexts.push(expandedLines.join('\n'));
  }

  return {
    text: pageTexts.join('\n\n--- PAGE BREAK ---\n\n'),
    pageCount: pdf.numPages,
    pageTexts,
  };
}

// ─── Bureau Auto-Detection ────────────────────────────────────────────────────

function detectBureau(text: string): Bureau | null {
  const t = text.toLowerCase();
  // Check first 2000 chars first (header section is most reliable)
  const header = t.slice(0, 2000);
  if (/equifax/.test(header)) return 'equifax';
  if (/experian/.test(header)) return 'experian';
  if (/transunion|trans union/.test(header)) return 'transunion';
  // Fall back to full text
  const eqCount = (t.match(/equifax/g) || []).length;
  const exCount = (t.match(/experian/g) || []).length;
  const tuCount = (t.match(/transunion|trans union/g) || []).length;
  if (eqCount === 0 && exCount === 0 && tuCount === 0) return null;
  if (eqCount >= exCount && eqCount >= tuCount) return 'equifax';
  if (exCount >= eqCount && exCount >= tuCount) return 'experian';
  return 'transunion';
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rnd(id = '') { return id || Math.random().toString(36).slice(2, 10); }

function grab(text: string, ...patterns: RegExp[]): string {
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return (m[1] ?? m[0]).trim().replace(/\s+/g, ' ');
  }
  return '';
}

function grabMoney(text: string, ...patterns: RegExp[]): string {
  const raw = grab(text, ...patterns);
  if (!raw) return '';
  const n = parseInt(raw.replace(/[^0-9]/g, ''), 10);
  return isNaN(n) ? '' : `$${n.toLocaleString()}`;
}

function parseDateStr(s: string): Date | null {
  if (!s) return null;
  // Try MM/YYYY
  const m1 = s.match(/^(\d{1,2})\/(\d{4})$/);
  if (m1) return new Date(parseInt(m1[2]), parseInt(m1[1]) - 1, 1);
  // Try Month YYYY
  const months: Record<string, number> = { jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11 };
  const m2 = s.match(/^([a-z]{3})\w*\s+(\d{4})$/i);
  if (m2) {
    const mo = months[m2[1].toLowerCase()];
    if (mo !== undefined) return new Date(parseInt(m2[2]), mo, 1);
  }
  // Try MM/DD/YYYY
  const m3 = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m3) return new Date(parseInt(m3[3]), parseInt(m3[1]) - 1, parseInt(m3[2]));
  return null;
}

function sevenYearDate(dofdStr: string): string {
  const d = parseDateStr(dofdStr);
  if (!d) return '';
  const expiry = new Date(d);
  expiry.setFullYear(expiry.getFullYear() + 7);
  const now = new Date();
  const expired = expiry < now;
  const mo = expiry.toLocaleString('default', { month: 'short' });
  return `${mo} ${expiry.getFullYear()}${expired ? ' [OVERDUE]' : ''}`;
}

function isSevenYearViolation(dofdStr: string): boolean {
  if (!dofdStr) return false;
  const d = parseDateStr(dofdStr);
  if (!d) return false;
  const expiry = new Date(d);
  expiry.setFullYear(expiry.getFullYear() + 7);
  return expiry < new Date();
}

function parseAccountNumber(block: string): string {
  const m = block.match(/account\s*(?:number|#|no\.?)[:\s]+([*X#\d-]{4,20})/i)
    || block.match(/#\s*([*X\d-]{6,20})/);
  if (!m) return '';
  // Always mask: show last 4 digits only
  const raw = m[1].replace(/[-\s]/g, '');
  if (raw.length <= 4) return `****${raw}`;
  return `****${raw.slice(-4)}`;
}

function parsePaymentHistory(block: string): string {
  // Metro 2 payment profile looks like "CCCCC0000000" or a string of 1-9/X/C codes
  const m = block.match(/payment\s*history[:\s]+([0-9XCBDEGH\s]{6,48})/i)
    || block.match(/pay\s*pattern[:\s]+([0-9XCBDEGH\s]{6,48})/i)
    || block.match(/\b([0-9XCBDEGH]{12,48})\b/);
  if (!m) return '';
  const clean = m[1].replace(/\s/g, '');
  if (clean.length < 6) return '';
  return clean.slice(0, 48);
}

function parseHistoryCounts(block: string): { c30: string; c60: string; c90: string } {
  const h = parsePaymentHistory(block);
  const text = block.toLowerCase();
  const c30 = (text.match(/30[- ]?day[s]?\s*(?:late|past\s*due)/g) || []).length || (h.split('').filter(c => c === '1').length) || 0;
  const c60 = (text.match(/60[- ]?day[s]?\s*(?:late|past\s*due)/g) || []).length || (h.split('').filter(c => c === '2').length) || 0;
  const c90 = (text.match(/90[- ]?day[s]?\s*(?:late|past\s*due)/g) || []).length || (h.split('').filter(c => c === '3').length) || 0;
  return {
    c30: c30 > 0 ? String(c30) : '',
    c60: c60 > 0 ? String(c60) : '',
    c90: c90 > 0 ? String(c90) : '',
  };
}

// ─── Bureau-Specific Field Extraction ────────────────────────────────────────

// Comprehensive date pattern matching real bureau report formats
const DP = '([A-Za-z]{3,9}\\.?\\s*\\d{1,2},?\\s*\\d{4}|[A-Za-z]{3,9}\\.?\\s*\\d{4}|\\d{1,2}\\/\\d{1,2}\\/\\d{4}|\\d{1,2}\\/\\d{4}|\\d{8})';

function normalizeDate(s: string): string {
  if (!s) return s;
  const m8 = s.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (m8) return `${m8[2]}/${m8[1]}`;
  const mfull = s.match(/^(\d{1,2})\/\d{1,2}\/(\d{4})$/);
  if (mfull) return `${mfull[1]}/${mfull[2]}`;
  return s;
}

function grabDate(block: string, ...patterns: RegExp[]): string {
  return normalizeDate(grab(block, ...patterns));
}

// Pre-process a block to join "Label:\n<value>" into "Label: <value>" on one line.
// This handles the common PDF extraction artifact where tab-expansion splits label/value.
function normalizeBlock(block: string): string {
  const lines = block.split('\n');
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    // If this line ends with ":" (a bare label line), try to merge with next
    if (/[A-Za-z)]\s*:$/.test(trimmed) && i + 1 < lines.length) {
      const next = lines[i + 1].trim();
      // Only merge if next line looks like a value (not another label)
      if (next && !/[A-Za-z)]\s*:$/.test(next) && next.length < 120) {
        out.push(`${trimmed} ${next}`);
        i++; // skip next
        continue;
      }
    }
    out.push(line);
  }
  return out.join('\n');
}

function extractEquifaxFields(block: string): Partial<Tradeline> {
  block = normalizeBlock(block);
  const d = DP;
  return {
    balance: grabMoney(block,
      /\bcurrent\s*balance[:\s]+\$?([\d,]+)/i,
      /\bbalance[:\s]+\$?([\d,]+)/i,
    ),
    creditLimit: grabMoney(block,
      /credit\s*limit[:\s]+\$?([\d,]+)/i,
      /high\s*credit[:\s]+\$?([\d,]+)/i,
      /credit\s*line[:\s]+\$?([\d,]+)/i,
      /original\s*(?:loan\s*)?amount[:\s]+\$?([\d,]+)/i,
      /loan\s*amount[:\s]+\$?([\d,]+)/i,
    ),
    highBalance: grabMoney(block,
      /high\s*(?:balance|credit)[:\s]+\$?([\d,]+)/i,
      /highest\s*balance[:\s]+\$?([\d,]+)/i,
      /\$([\d,]+)\s*high\s*(?:balance|credit)/i,
    ),
    pastDueAmount: grabMoney(block,
      /amount\s*past\s*due[:\s]+\$?([\d,]+)/i,
      /past\s*due\s*amount[:\s]+\$?([\d,]+)/i,
      /\$([\d,]+)\s*past\s*due/i,
    ),
    scheduledPayment: grabMoney(block,
      /scheduled\s*(?:monthly\s*)?payment[:\s]+\$?([\d,]+)/i,
      /monthly\s*payment\s*(?:amount)?[:\s]+\$?([\d,]+)/i,
    ),
    chargeOffAmount: grabMoney(block,
      /charge[- ]?off\s*amount[:\s]+\$?([\d,]+)/i,
      /\$([\d,]+)\s*written\s*off/i,
      /written\s*off[:\s]+\$?([\d,]+)/i,
    ),
    dateOpened: grabDate(block,
      new RegExp(`date\\s*opened[:\\s]+(${d})`, 'i'),
      new RegExp(`opened[:\\s]+(${d})`, 'i'),
      new RegExp(`assigned[:\\s]+(${d})`, 'i'),
    ),
    lastPaymentDate: grabDate(block,
      new RegExp(`date\\s*of\\s*last\\s*payment[:\\s]+(${d})`, 'i'),
      new RegExp(`last\\s*payment[:\\s]+(${d})`, 'i'),
      new RegExp(`paid[:\\s]+(${d})`, 'i'),
    ),
    lastReported: grabDate(block,
      new RegExp(`date\\s*(?:of\\s*)?(?:status|reported|updated)[:\\s]+(${d})`, 'i'),
      new RegExp(`date\\s*reported[:\\s]+(${d})`, 'i'),
      new RegExp(`last\\s*reported[:\\s]+(${d})`, 'i'),
      new RegExp(`balance\\s*updated[:\\s]+(${d})`, 'i'),
      new RegExp(`collection\\s*reported[:\\s]+(${d})`, 'i'),
      new RegExp(`updated[:\\s]+(${d})`, 'i'),
    ),
    statusUpdatedDate: grabDate(block,
      new RegExp(`status\\s*updated[:\\s]+(${d})`, 'i'),
    ),
    dateClosed: grabDate(block,
      new RegExp(`date\\s*closed[:\\s]+(${d})`, 'i'),
      new RegExp(`closed[:\\s]+(${d})`, 'i'),
    ),
    dateOfFirstDelinquency: grabDate(block,
      new RegExp(`date\\s*of\\s*(?:first\\s*)?delinquency[:\\s]+(${d})`, 'i'),
      new RegExp(`first\\s*delinquency[:\\s]+(${d})`, 'i'),
      new RegExp(`dofd[:\\s]+(${d})`, 'i'),
    ),
    dateMajorDelinquency: grabDate(block,
      new RegExp(`date\\s*major\\s*delinquency(?:\\s*first\\s*reported)?[:\\s]+(${d})`, 'i'),
    ),
    responsibility: grab(block,
      /(?:whose\s*account|responsibility|account\s*owner)[:\s]+([^\n\t,]{2,40})/i,
      /ownership[:\s]+([^\n\t,]{2,40})/i,
    ),
    originalCreditor: grab(block,
      /original\s*creditor[:\s]+([^\n\t]{2,60})/i,
      /original\s*lender[:\s]+([^\n\t]{2,60})/i,
    ),
    creditorClassification: grab(block,
      /creditor\s*classification[:\s]+([^\n\t]{2,60})/i,
      /type\s*of\s*creditor[:\s]+([^\n\t]{2,60})/i,
    ),
    specialComment: grab(block,
      /special\s*comment[:\s]+([^\n]+)/i,
      /remarks?[:\s]+([^\n]+)/i,
      /additional\s*information[:\s]+([^\n]+)/i,
    ),
  };
}

function extractExperianFields(block: string): Partial<Tradeline> {
  block = normalizeBlock(block);
  const d = DP;
  return {
    balance: grabMoney(block,
      /\bbalance[:\s]+\$?([\d,]+)/i,
      /recent\s*balance[:\s]+\$?([\d,]+)/i,
      /\$([\d,]+)\s*past\s*due/i,
    ),
    creditLimit: grabMoney(block,
      /(?:credit\s*)?limit[:\s]+\$?([\d,]+)/i,
      /credit\s*line[:\s]+\$?([\d,]+)/i,
      /original\s*(?:balance|amount)[:\s]+\$?([\d,]+)/i,
    ),
    highBalance: grabMoney(block,
      /high\s*balance[:\s]+\$?([\d,]+)/i,
      /original\s*balance[:\s]+\$?([\d,]+)/i,
      /\$([\d,]+)\s*high\s*balance/i,
    ),
    pastDueAmount: grabMoney(block,
      /past\s*due[:\s]+\$?([\d,]+)/i,
      /amount\s*past\s*due[:\s]+\$?([\d,]+)/i,
      /\$([\d,]+)\s*past\s*due/i,
    ),
    scheduledPayment: grabMoney(block,
      /monthly\s*payment[:\s]+\$?([\d,]+)/i,
      /scheduled\s*payment[:\s]+\$?([\d,]+)/i,
      /minimum\s*payment[:\s]+\$?([\d,]+)/i,
    ),
    chargeOffAmount: grabMoney(block,
      /\$([\d,]+)\s*written\s*off/i,
      /charge[- ]?off[:\s]+\$?([\d,]+)/i,
      /written\s*off[:\s]+\$?([\d,]+)/i,
    ),
    dateOpened: grabDate(block,
      new RegExp(`(?:date\\s*)?opened?[:\\s]+(${d})`, 'i'),
      new RegExp(`assigned[:\\s]+(${d})`, 'i'),
    ),
    lastPaymentDate: grabDate(block,
      new RegExp(`(?:last\\s*)?paid?[:\\s]+(${d})`, 'i'),
      new RegExp(`last\\s*payment[:\\s]+(${d})`, 'i'),
    ),
    lastReported: grabDate(block,
      new RegExp(`last\\s*reported?[:\\s]+(${d})`, 'i'),
      new RegExp(`balance\\s*updated[:\\s]+(${d})`, 'i'),
      new RegExp(`collection\\s*reported[:\\s]+(${d})`, 'i'),
      new RegExp(`balance\\s*as\\s*of[:\\s]+(${d})`, 'i'),
      new RegExp(`reported[:\\s]+(${d})`, 'i'),
    ),
    statusUpdatedDate: grabDate(block,
      new RegExp(`(?:status\\s*)?as\\s*of[:\\s]+(${d})`, 'i'),
      new RegExp(`status\\s*updated[:\\s]+(${d})`, 'i'),
    ),
    dateClosed: grabDate(block,
      new RegExp(`closed?[:\\s]+(${d})`, 'i'),
      new RegExp(`date\\s*closed?[:\\s]+(${d})`, 'i'),
    ),
    dateOfFirstDelinquency: grabDate(block,
      new RegExp(`delinquency\\s*first\\s*reported[:\\s]+(${d})`, 'i'),
      new RegExp(`first\\s*delinquency[:\\s]+(${d})`, 'i'),
      new RegExp(`date\\s*(?:of\\s*)?delinquency[:\\s]+(${d})`, 'i'),
      new RegExp(`dofd[:\\s]+(${d})`, 'i'),
    ),
    dateMajorDelinquency: grabDate(block,
      new RegExp(`major\\s*delinquency[:\\s]+(${d})`, 'i'),
    ),
    responsibility: grab(block,
      /responsibility[:\s]+([^\n\t,]{2,40})/i,
      /whose\s*account[:\s]+([^\n\t,]{2,40})/i,
    ),
    originalCreditor: grab(block,
      /original\s*creditor[:\s]+([^\n\t]{2,60})/i,
      /original\s*lender[:\s]+([^\n\t]{2,60})/i,
    ),
    creditorClassification: grab(block,
      /creditor\s*classification[:\s]+([^\n\t]{2,60})/i,
      /type\s*of\s*creditor[:\s]+([^\n\t]{2,60})/i,
    ),
    specialComment: grab(block,
      /creditor[''']?s?\s*statement[:\s]+([^\n]+)/i,
      /comment[:\s]+([^\n]+)/i,
      /remarks?[:\s]+([^\n]+)/i,
      /additional\s*information[:\s]+([^\n]+)/i,
    ),
  };
}

function extractTransUnionFields(block: string): Partial<Tradeline> {
  block = normalizeBlock(block);
  const d = DP;
  return {
    balance: grabMoney(block,
      /\bcurrent\s*balance[:\s]+\$?([\d,]+)/i,
      /\bbalance[:\s]+\$?([\d,]+)/i,
      /\$([\d,]+)\s*past\s*due/i,
    ),
    creditLimit: grabMoney(block,
      /credit\s*limit[:\s]+\$?([\d,]+)/i,
      /credit\s*line[:\s]+\$?([\d,]+)/i,
      /highest\s*balance[:\s]+\$?([\d,]+)/i,
      /original\s*(?:loan\s*)?amount[:\s]+\$?([\d,]+)/i,
      /\$([\d,]+)\s*high\s*(?:balance|credit)/i,
    ),
    highBalance: grabMoney(block,
      /highest\s*balance[:\s]+\$?([\d,]+)/i,
      /high(?:est)?\s*(?:balance|credit)[:\s]+\$?([\d,]+)/i,
      /\$([\d,]+)\s*high\s*(?:balance|credit)/i,
    ),
    pastDueAmount: grabMoney(block,
      /amount\s*past\s*due[:\s]+\$?([\d,]+)/i,
      /past\s*due\s*amount[:\s]+\$?([\d,]+)/i,
      /\$([\d,]+)\s*past\s*due/i,
    ),
    scheduledPayment: grabMoney(block,
      /(?:minimum\s*)?monthly\s*payment[:\s]+\$?([\d,]+)/i,
      /scheduled\s*payment[:\s]+\$?([\d,]+)/i,
    ),
    chargeOffAmount: grabMoney(block,
      /charge[- ]?off\s*amount[:\s]+\$?([\d,]+)/i,
      /\$([\d,]+)\s*written\s*off/i,
      /written\s*off[:\s]+\$?([\d,]+)/i,
    ),
    dateOpened: grabDate(block,
      new RegExp(`date\\s*opened[:\\s]+(${d})`, 'i'),
      new RegExp(`opened[:\\s]+(${d})`, 'i'),
      new RegExp(`assigned[:\\s]+(${d})`, 'i'),
    ),
    lastPaymentDate: grabDate(block,
      new RegExp(`date\\s*of\\s*last\\s*(?:payment|activity)[:\\s]+(${d})`, 'i'),
      new RegExp(`last\\s*(?:payment|activity)[:\\s]+(${d})`, 'i'),
    ),
    lastReported: grabDate(block,
      new RegExp(`date\\s*(?:last\\s*)?(?:reported|updated)[:\\s]+(${d})`, 'i'),
      new RegExp(`last\\s*reported[:\\s]+(${d})`, 'i'),
      new RegExp(`balance\\s*as\\s*of[:\\s]+(${d})`, 'i'),
      new RegExp(`collection\\s*reported[:\\s]+(${d})`, 'i'),
      new RegExp(`reported[:\\s]+(${d})`, 'i'),
    ),
    statusUpdatedDate: grabDate(block,
      new RegExp(`status\\s*updated[:\\s]+(${d})`, 'i'),
    ),
    dateClosed: grabDate(block,
      new RegExp(`date\\s*closed[:\\s]+(${d})`, 'i'),
      new RegExp(`closed[:\\s]+(${d})`, 'i'),
    ),
    dateOfFirstDelinquency: grabDate(block,
      new RegExp(`date\\s*of\\s*first\\s*delinquency[:\\s]+(${d})`, 'i'),
      new RegExp(`dofd[:\\s]+(${d})`, 'i'),
      new RegExp(`first\\s*(?:reported\\s*)?delinquency[:\\s]+(${d})`, 'i'),
    ),
    dateMajorDelinquency: grabDate(block,
      new RegExp(`date\\s*major\\s*delinquency(?:\\s*first\\s*reported)?[:\\s]+(${d})`, 'i'),
    ),
    responsibility: grab(block,
      /responsibility[:\s]+([^\n\t,]{2,40})/i,
      /whose\s*account[:\s]+([^\n\t,]{2,40})/i,
    ),
    originalCreditor: grab(block,
      /original\s*creditor[:\s]+([^\n\t]{2,60})/i,
      /original\s*lender[:\s]+([^\n\t]{2,60})/i,
    ),
    creditorClassification: grab(block,
      /creditor\s*classification[:\s]+([^\n\t]{2,60})/i,
      /portfolio\s*\/?\s*loan\s*type[:\s]+([^\n\t]{2,60})/i,
      /type\s*of\s*creditor[:\s]+([^\n\t]{2,60})/i,
    ),
    specialComment: grab(block,
      /remarks?[:\s]+([^\n]+)/i,
      /narrative[:\s]+([^\n]+)/i,
      /special\s*comment[:\s]+([^\n]+)/i,
      /additional\s*information[:\s]+([^\n]+)/i,
    ),
  };
}

function detectAccountType(text: string): string {
  const t = text.toLowerCase();
  if (/mortgage|home\s*loan|heloc|home\s*equity|real\s*estate|fha|va\s*loan/i.test(t)) return 'Mortgage';
  if (/auto|vehicle|car\s*(?:loan|finance)|dealer/i.test(t)) return 'Auto Loan';
  if (/student\s*loan|sallie\s*mae|nelnet|fedloan|navient|great\s*lakes|mohela|dept\s*of\s*ed|federal\s*student/i.test(t)) return 'Student Loan';
  if (/credit\s*card|visa|mastercard|amex|american\s*express|discover\b|charge\s*card|revolving/i.test(t)) return 'Credit Card';
  if (/collection|debt\s*buyer|portfolio\s*recovery|midland|lvnv|cavalry|asset\s*acceptance|unifin|cach\s*llc/i.test(t)) return 'Collection';
  if (/medical|hospital|health\s*care|physician|clinic|dental|emergency/i.test(t)) return 'Medical';
  if (/personal\s*loan|installment|signature\s*loan|consumer\s*loan/i.test(t)) return 'Personal Loan';
  if (/line\s*of\s*credit|credit\s*line|heloc/i.test(t)) return 'Credit Line';
  if (/retail|store\s*card|department\s*store|macys|target|walmart|kohls/i.test(t)) return 'Retail Card';
  if (/secured\s*card|secured\s*credit/i.test(t)) return 'Secured Card';
  if (/lease|leasing/i.test(t)) return 'Lease';
  if (/unsecured/i.test(t)) return 'Unsecured Loan';
  return 'Installment/Other';
}

function detectStatus(text: string): string {
  const t = text.toLowerCase();
  if (/charge[- ]?off|charged\s*off/.test(t)) return 'Charged Off (K4: 97)';
  if (/collection/.test(t)) return 'In Collections (K4: 93)';
  if (/discharg/.test(t)) return 'Discharged (Bankruptcy)';
  if (/repossess|repo\b/.test(t)) return 'Repossessed (K4: 96)';
  if (/foreclos/.test(t)) return 'Foreclosure (K4: 94)';
  if (/voluntary\s*surrender/.test(t)) return 'Voluntary Surrender (K4: 95)';
  if (/120|150|180|seriously\s*past/.test(t)) return '120+ Days Past Due (K4: 82-84)';
  if (/90\s*day/.test(t)) return '90 Days Past Due (K4: 80)';
  if (/60\s*day/.test(t)) return '60 Days Past Due (K4: 78)';
  if (/30\s*day/.test(t)) return '30 Days Past Due (K4: 71)';
  if (/closed|paid\s*and\s*closed/.test(t)) return 'Closed (K4: 13)';
  if (/paid|satisfied/.test(t)) return 'Paid/Satisfied';
  if (/current|pays?\s*as\s*agreed|open/.test(t)) return 'Open/Current (K4: 11)';
  return 'Open (K4: 11)';
}

const DEROG_MARKERS = [
  'collection','charge off','charge-off','chargeoff','derogatory','delinquent',
  'past due','bankruptcy','foreclosure','repossession','repossessed',
  'settlement','written off','write-off','unpaid','default','discharged',
  '30 day','60 day','90 day','120 day','seriously past due',
];

// ─── Forensic Rules Engine ────────────────────────────────────────────────────

function runForensics(block: string, tl: Partial<Tradeline>): { violations: Violation[]; notes: ForensicNote[] } {
  const violations: Violation[] = [];
  const notes: ForensicNote[] = [];
  const t = block.toLowerCase();

  // 1. Identity / not mine
  if (/not\s*mine|unknown\s*account|fraudulent|identity\s*theft|unauthorized\s*account/i.test(t)) {
    violations.push({ field: 'accountName', rule: 'Identity — Account Not Mine (§605B)', fcra: 'FCRA §605B', severity: 'critical',
      description: 'Block required within 4 business days of identity theft report. CRA cannot re-add without notice per §605B(b).' });
    notes.push({ level: 'critical', tag: 'IDENTITY', detail: 'Possible identity theft marker detected in block text.' });
  }

  // 2. 7-year DOFD violation (item should have been removed)
  if (tl.dateOfFirstDelinquency && isSevenYearViolation(tl.dateOfFirstDelinquency)) {
    violations.push({ field: 'dateOfFirstDelinquency', rule: '7-Year Rule Violation — DOFD Expired', fcra: 'FCRA §605(a)', severity: 'critical',
      description: `DOFD of ${tl.dateOfFirstDelinquency} puts removal date more than 7 years ago. This tradeline must be deleted immediately under §605(a).` });
    notes.push({ level: 'critical', tag: '7YR-EXPIRED', detail: `Item expired: DOFD ${tl.dateOfFirstDelinquency}, should have been removed by ${sevenYearDate(tl.dateOfFirstDelinquency)}.` });
  }

  // 3. Discharged bankruptcy with non-zero balance
  if (/discharge|discharg|chapter\s*7|chapter\s*13|bankrupt/i.test(t)) {
    const balRaw = (tl.balance ?? '').replace(/[^0-9]/g, '');
    if (balRaw && parseInt(balRaw) > 0) {
      violations.push({ field: 'balance', rule: 'Discharged — Non-Zero Balance (Metro 2)', fcra: 'FCRA §605(a)(1) + Metro 2', severity: 'critical',
        description: 'Post-discharge accounts must report $0 balance. Any non-zero balance is a Metro 2 segment violation and FCRA inaccuracy.' });
      notes.push({ level: 'critical', tag: 'BK-BALANCE', detail: `Bankruptcy account showing ${tl.balance} — should be $0 post-discharge.` });
    }
  }

  // 4. Re-aging detection — DOFD later than expected after charge-off
  if (/charge[- ]?off/i.test(t) && tl.dateOfFirstDelinquency) {
    const dofd = parseDateStr(tl.dateOfFirstDelinquency);
    const status = (tl.accountStatus ?? '').toLowerCase();
    if (dofd) {
      const monthsFromDOFD = (new Date().getTime() - dofd.getTime()) / (1000 * 60 * 60 * 24 * 30);
      if (monthsFromDOFD < 3) {
        violations.push({ field: 'dateOfFirstDelinquency', rule: 'Possible Re-aging — DOFD Too Recent for CO', fcra: 'FCRA §605(c)', severity: 'critical',
          description: 'DOFD appears too recent relative to charge-off status. Re-aging resets the 7-year clock illegally. File dispute with original DOFD documentation.' });
        notes.push({ level: 'critical', tag: 'RE-AGING', detail: 'DOFD date suspicious — may have been reset after charge-off.' });
      }
      if (!status.includes('charge') && !status.includes('derog')) {
        notes.push({ level: 'high', tag: 'STATUS-MISMATCH', detail: 'Block text mentions charge-off but detected status does not reflect this. Possible Metro 2 K4 code error.' });
      }
    }
  }

  // 5. Charge-off
  if (/charge[- ]?off|written\s*off|write[- ]?off/i.test(t)) {
    violations.push({ field: 'accountStatus', rule: 'Charge-Off — Verify DOFD, Balance & K4 Code', fcra: 'FCRA §623 + Metro 2 §7.2', severity: 'high',
      description: 'Charge-off K4 code must be 97. DOFD must be the original first missed payment, not the charge-off date. Balance after CO must reflect actual amount. Re-aging is a §605(c) violation.' });
    if (!tl.dateOfFirstDelinquency) {
      notes.push({ level: 'high', tag: 'NO-DOFD', detail: 'Charge-off detected but no DOFD found in block. DOFD is required by Metro 2 for all derogatory accounts.' });
    }
  }

  // 6. Collection
  if (/collection/i.test(t)) {
    violations.push({ field: 'accountStatus', rule: 'Collection — Validate DOFD & Original Creditor', fcra: 'FCRA §605(a)(4) + FDCPA §809', severity: 'high',
      description: '7-year clock runs from DOFD on original account, not from sale to collector. FDCPA §809 allows 30-day validation period. Original creditor name must appear.' });
    if (!grab(block, /original\s*creditor[:\s]+([^\n]+)/i)) {
      notes.push({ level: 'medium', tag: 'NO-OC', detail: 'Collection account — original creditor name not found in block. Metro 2 requires original creditor identification.' });
    }
  }

  // 7. Balance exceeds credit limit (Metro 2 field 12/13 violation)
  const balRaw = parseInt((tl.balance ?? '').replace(/[^0-9]/g, ''), 10);
  const limRaw = parseInt((tl.creditLimit ?? '').replace(/[^0-9]/g, ''), 10);
  if (!isNaN(balRaw) && !isNaN(limRaw) && limRaw > 0 && balRaw > limRaw) {
    violations.push({ field: 'balance', rule: 'Balance > Credit Limit (Metro 2 Segment Field 12/13)', fcra: 'FCRA §623 + Metro 2 §4.1', severity: 'high',
      description: `Reported balance ($${balRaw.toLocaleString()}) exceeds credit limit ($${limRaw.toLocaleString()}). This is a Metro 2 field 12/13 violation that artificially damages the utilization ratio.` });
    notes.push({ level: 'high', tag: 'BAL>LIMIT', detail: `Balance $${balRaw.toLocaleString()} exceeds limit $${limRaw.toLocaleString()}.` });
  }

  // 8. 120+ late without DOFD
  if (/120|150|180|seriously\s*past\s*due/i.test(t) && !tl.dateOfFirstDelinquency) {
    violations.push({ field: 'dateOfFirstDelinquency', rule: '120+ Days Late — Missing DOFD', fcra: 'FCRA §605(a)(5)', severity: 'high',
      description: 'Accounts 120+ days past due require DOFD for the 7-year removal calculation. Missing DOFD makes the entire tradeline unverifiable and disputable.' });
  }

  // 9. 30/60/90 late payments
  if (/30\s*day|60\s*day|90\s*day/i.test(t) && !/120|150|180/i.test(t)) {
    violations.push({ field: 'paymentHistory', rule: 'Late Payment — Verify Date Accuracy (§611)', fcra: 'FCRA §611', severity: 'medium',
      description: 'Each late payment notation must reflect an accurate date. Dispute with bank statements proving on-time payment. Goodwill adjustment letters available for paid lates.' });
  }

  // 10. Repossession
  if (/repossess|repo\b/i.test(t)) {
    violations.push({ field: 'balance', rule: 'Repossession — Verify Deficiency Balance (§623)', fcra: 'FCRA §623', severity: 'high',
      description: 'Deficiency = loan balance minus auction proceeds. Furnisher must use actual sale proceeds in calculation. Inflated deficiency is an inaccuracy under §623(a)(1).' });
  }

  // 11. Foreclosure
  if (/foreclosure|foreclosed/i.test(t)) {
    violations.push({ field: 'dateOfFirstDelinquency', rule: 'Foreclosure — 7-Year Clock from DOFD', fcra: 'FCRA §623 + §605(a)', severity: 'high',
      description: '7-year period starts from DOFD that led to foreclosure, not the sale/judgment date. Deficiency balance must be accurate.' });
  }

  // 12. Duplicate indicator
  if (/duplicate|appears\s*twice|same\s*account/i.test(t)) {
    violations.push({ field: 'accountName', rule: 'Duplicate Tradeline Detected (Metro 2)', fcra: 'FCRA §611 + Metro 2', severity: 'critical',
      description: 'Each account may only appear once per bureau. Duplicate with worse status must be removed. File dispute citing Metro 2 duplicate reporting rule.' });
  }

  // 13. Payment history contains charge-off codes (C) but status shows current
  const ph = tl.paymentHistory ?? '';
  if (ph.includes('C') && !/charge|97|collection|derog/i.test(tl.accountStatus ?? '')) {
    notes.push({ level: 'high', tag: 'HISTORY-MISMATCH', detail: `Payment history profile shows 'C' (charge-off) codes but account status doesn't reflect this. Metro 2 K4/history inconsistency.` });
  }

  // 14. Medical debt — new CFPB rule (medical debt should be removed from CRAs as of 2025)
  if (/medical|hospital|health\s*care|physician/i.test(t)) {
    notes.push({ level: 'medium', tag: 'MEDICAL-DEBT', detail: 'Medical debt — CFPB rule effective 2025 removes medical debt from credit reports. Challenge under new CFPB guidance.' });
  }

  // 15. Consumer dispute flag not set
  if (/consumer\s*disput|in\s*dispute/i.test(t) && !tl.consumerDispute) {
    notes.push({ level: 'medium', tag: 'DISPUTE-FLAG', detail: 'Dispute language found but Metro 2 consumer dispute flag not set. Furnisher must set XB compliance condition code during active disputes.' });
  }

  return { violations, notes };
}
function extractAccountName(block: string): string {
// A "block trigger" line is one that looks like an account header:
// - Labeled field like "Account Name:", "Creditor:", etc.
// - All-caps OR Title Case creditor name on its own line
const extractPdfText = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageStrings = textContent.items.map((item: any) => item.str);
    fullText += pageStrings.join(' ') + '\n';
  }

  return fullText;
};

const BLOCK_TRIGGER = /^(?:account\s*(?:name|#|number)[:\s]|creditor[:\s]|company[:\s]|furnisher[:\s])/i;
const CAPS_CREDITOR = /^[A-Z][A-Z0-9\s&/,.'()-]{3,60}$/;
const TITLE_CREDITOR = /^[A-Z][a-zA-Z0-9\s&/,.'()-]{3,60}$/;

function splitIntoBlocks(text: string, bureau: Bureau | null): string[] {
  const lines = text.split('\n');
  const blocks: string[] = [];
  let current: string[] = [];

  const flush = () => {
    const b = current.join('\n').trim();
    if (b.length > 30) blocks.push(b);
    current = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const nextLine = (lines[i + 1] || '').trim();

    const nextIsField = /[:\s]/.test(nextLine) && /(?:balance|date|status|type|limit|payment|opened|account|creditor|original|responsibility|high|amount|schedule|charge|collection)/i.test(nextLine);

    const isAccountStart =
      BLOCK_TRIGGER.test(line) ||
      (CAPS_CREDITOR.test(line) && (nextIsField || /[:\s]/.test(nextLine)) && !/^\d+$/.test(line)) ||
      (TITLE_CREDITOR.test(line) && nextIsField && !/^\d+$/.test(line) && line.split(' ').length >= 2) ||
      (bureau === 'equifax' && CAPS_CREDITOR.test(line) && line.length > 6) ||
      (bureau === 'transunion' && /^account\s*#/i.test(line)) ||
      (bureau === 'experian' && /^account\s*name/i.test(line)) ||
      /^[=\-]{5,}$/.test(line) ||
      /^-+\s*page\s*break\s*-+$/i.test(line);

    if (isAccountStart && current.length > 0) {
      flush();
    }
    current.push(line);
  }
  flush();

  return blocks
    .filter(b => {
      const hasField = /(?:balance|opened|status|limit|delinquency|payment|reported|creditor|account|date)/i.test(b);
      const hasNumber = /\$[\d,]|\d{1,2}\/\d{4}|[A-Za-z]{3,9}\s+\d{4}/.test(b);
      return hasField || hasNumber;
    })
    .slice(0, 100);
}

function extractAccountName(block: string): string {
  const INVALID_NAMES = ['potentially negative', 'tim k do', 'unknown', 'collection', 'charge-off'];

  const labeled = grab(block, /(?:account\s*name|creditor\s*name|creditor|furnisher|company)\s*[:\-]?\s*([^\n\t]{2,80})/i);
  if (labeled && labeled.length > 2 && labeled.length < 85) {
    const clean = labeled.replace(/^[\s:]+|[^a-zA-Z0-9\s&,.'()/-]+$/g, '').trim();
    if (clean.length > 2 && !INVALID_NAMES.includes(clean.toLowerCase())) return clean;
  }

  const nlMatch = block.match(/^(?:account\s*name|creditor)[:\s]*$/im);
  if (nlMatch) {
    const after = block.slice(block.indexOf(nlMatch[0]) + nlMatch[0].length);
    const nextLine = after.split('\n').map(l => l.trim()).find(l => l.length > 2 && !/^(?:balance|date|status|type|limit|payment|opened|responsibility|amount|schedule|special|remark|creditor|original|high|account|number|#)/i.test(l));
    if (nextLine && !INVALID_NAMES.includes(nextLine.toLowerCase())) return nextLine;
  }

  const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
  for (const line of lines) {
    if ((CAPS_CREDITOR.test(line) || TITLE_CREDITOR.test(line)) && !/^(?:date|status|balance|payment|account|terms|past due|history|potentially)/i.test(line)) {
      if (!INVALID_NAMES.includes(line.toLowerCase())) return line;
    }
  }

  return "Unknown Account";
}

export function detectMetro2Errors(account: Tradeline, bureau: string): Metro2Violation[] {
  const violations: Metro2Violation[] = [];
  const status = account.status?.toLowerCase() || '';
  const remarks = account.remarks?.toLowerCase() || '';

  // 1. The Sold/Transferred Balance Rule
  if ((remarks.includes('sold') || remarks.includes('transferred')) && account.balance > 0) {
    violations.push({
      code: 'M2-BAL-01',
      description: `Account reported as sold/transferred but shows a balance of $${account.balance}. Must be $0.`,
      fcraBasis: 'FCRA §623(a)(1) - Inaccurate Balance',
      strength: 95
    });
  }

  // 2. Missing DOFD on Derogatory Accounts
  if ((status.includes('charge-off') || status.includes('collection')) && !account.dofd) {
    violations.push({
      code: 'M2-DATE-02',
      description: 'Derogatory account is missing the mandatory Date of First Delinquency (DOFD).',
      fcraBasis: 'FCRA §623(a)(5) - Failure to Provide DOFD',
      strength: 90
    });
  }

  // 3. Past Due on Charge-Off
  if (status.includes('charge-off') && account.pastDue > 0) {
       violations.push({
        code: 'M2-AMT-03',
        description: 'Past Due amount continues to report on a Charged-Off account status.',
        fcraBasis: 'FCRA §623(a)(1) - Inaccurate Past Due Field',
        strength: 85
      });
  }

  return violations;
}
function parseReport(bureau: Bureau, rawText: string, pageCount: number): BureauReport {
  const detectedBureau = detectBureau(rawText);

  // Extract hard inquiries
  const inqPattern = /hard\s*inquiry[:\s]+([^\n]+)|inquir(?:y|ies)[:\s]+([^\n]+)/gi;
  const hardInquiries: BureauReport['hardInquiries'] = [];
  let inqMatch: RegExpExecArray | null;
  while ((inqMatch = inqPattern.exec(rawText)) !== null) {
    const line = (inqMatch[1] || inqMatch[2] || '').trim();
    const dateM = line.match(/(\w+\s+\d{4}|\d{1,2}\/\d{4})/);
    hardInquiries.push({
      creditor: line.replace(/[—–-]\s*\w+\s+\d{4}/, '').replace(/\d{1,2}\/\d{4}/, '').trim() || line,
      date: dateM?.[1] ?? '',
      purpose: /mortgage|home|auto|vehicle|student|personal/i.test(line) ? grab(line, /(mortgage|home|auto|student|personal)/i) : 'Unknown',
    });
  }

  // Extract public records
  const pubRecords: string[] = [];
  const prMatch = rawText.match(/(?:public\s*records?|bankruptcy|judgment|lien)[^\n]*/gi);
  if (prMatch) pubRecords.push(...prMatch.slice(0, 10));

  // Forensic PDF-level notes
  const forensicSummary: ForensicNote[] = [];
  if (pageCount > 0) forensicSummary.push({ level: 'info', tag: 'PDF', detail: `${pageCount}-page PDF extracted. Text positions preserved for forensic field mapping.` });
  if (detectedBureau && detectedBureau !== bureau) {
    forensicSummary.push({ level: 'high', tag: 'BUREAU-MISMATCH', detail: `File was assigned to ${BUREAU_META[bureau].label} but content detected as ${BUREAU_META[detectedBureau].label}. Auto-correcting slot.` });
  }
  const softCount = (rawText.match(/soft\s*inquiry|promotional|account\s*review|employment/gi) || []).length;

  const blocks = splitIntoBlocks(rawText, detectedBureau ?? bureau);

  const tradelines: Tradeline[] = blocks.map(rawBlock => {
    const block = normalizeBlock(rawBlock);
    // Skip header/footer blocks
    const blockLower = block.toLowerCase();
    if (/(credit\s*report|consumer\s*statement|personal\s*information|public\s*record|inquiry|inquiries|score|fico)/i.test(block.slice(0, 80))) {
      if (!/balance|account\s*type|account\s*status|date\s*opened/i.test(block)) return null;
    }

    const accountName = extractAccountName(block);
    if (accountName === 'Unknown Account' && !/balance|status|opened/i.test(block)) return null;

    // Bureau-specific field extraction
    const bFields = (detectedBureau ?? bureau) === 'equifax' ? extractEquifaxFields(block)
      : (detectedBureau ?? bureau) === 'experian' ? extractExperianFields(block)
      : extractTransUnionFields(block);

    const accountStatus = detectStatus(block);
    const accountType = detectAccountType(block);
    const accountNumber = parseAccountNumber(block);
    const responsibility = bFields.responsibility || grab(block, /responsibility[:\s]+([^\n]+)/i) || '';
    const { c30, c60, c90 } = parseHistoryCounts(block);
    const paymentHistory = parsePaymentHistory(block);

    const remarks: string[] = [];
    if (/late/i.test(block)) remarks.push('Late Payment');
    if (/collection/i.test(block)) remarks.push('Collections');
    if (/charge[- ]?off/i.test(block)) remarks.push('Charge-Off');
    if (/bankrupt/i.test(block)) remarks.push('Included in Bankruptcy');
    if (/consumer\s*disput/i.test(block)) remarks.push('Consumer Disputes This Account');
    if (/settled/i.test(block)) remarks.push('Settled for Less');
    if (/pays?\s*as\s*agreed/i.test(block)) remarks.push('Pays as Agreed');

    const isDerogatory = DEROG_MARKERS.some(k => blockLower.includes(k));

    const dofd = bFields.dateOfFirstDelinquency ?? '';
    const partial: Partial<Tradeline> = {
      accountStatus, accountType, accountNumber, responsibility, paymentHistory,
      balance: bFields.balance ?? '', creditLimit: bFields.creditLimit ?? '',
      dateOfFirstDelinquency: dofd, ...bFields,
    };const { violations, notes } = runForensics(block, partial);

   const tl: Tradeline = {
      id: rnd(),
      accountName,
      accountNumber,
      accountType,
      responsibility: bFields.responsibility ?? responsibility,
      originalCreditor: bFields.originalCreditor ?? grab(block, /original\s*creditor[:\s]+([^\n\t]{2,60})/i),
      creditorClassification: bFields.creditorClassification ?? '',
      accountStatus,
      paymentStatus: accountStatus,
      derogatoryFlag: isDerogatory ? 'YES' : 'No',
      balance: bFields.balance ?? '',
      creditLimit: bFields.creditLimit ?? '',
      pastDueAmount: bFields.pastDueAmount ?? '',
      scheduledPayment: bFields.scheduledPayment ?? '',
      highBalance: bFields.highBalance ?? '',
      chargeOffAmount: bFields.chargeOffAmount ?? '',
      dateOpened: bFields.dateOpened ?? '',
      dateOfFirstDelinquency: dofd,
      dateMajorDelinquency: bFields.dateMajorDelinquency ?? '',
      dateClosed: bFields.dateClosed ?? '',
      lastPaymentDate: bFields.lastPaymentDate ?? '',
      lastReported: bFields.lastReported ?? '',
      statusUpdatedDate: bFields.statusUpdatedDate ?? '',
      sevenYearExpiry: dofd ? sevenYearDate(dofd) : '',
      paymentHistory,
      lateCount30: c30,
      lateCount60: c60,
      lateCount90: c90,
      remarks: remarks.join('; '),
      consumerDispute: /consumer\s*disput/i.test(block) ? 'Yes (XB)' : '',
      specialComment: bFields.specialComment ?? '',
      isDerogatory,
      violations, 
      forensicNotes: notes,
      rawBlock: rawBlock,
    }; // <--- This properly closes the object!
    
    accounts.push(tl);
  } // <--- This closes your 'for (const block of blocks)' loop

  return { 
    bureau: detectedBureau ?? bureau, 
    accounts, 
    hardInquiries 
  };
} // <--- This closes your 'parseReport' function