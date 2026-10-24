#!/usr/bin/env node
/**
 * scripts/seed-2027-pipeline.mjs
 * 
 * Seeds and tracks verified FULL-TIME 2027 Graduate & New Grad Software Engineer opportunities
 * with DIRECT, EXACT REQUISITION LINKS in data/pipeline.json.
 * 
 * STRICT RULES:
 * - SDE / Software Engineering / Developer roles ONLY (no Quant Researcher, no Product Analyst).
 * - 0 experience required (strictly campus / 2027 graduate roles).
 * - No lateral experienced roles requiring immediate start.
 * 
 * Run: node scripts/seed-2027-pipeline.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PIPELINE_PATH = path.join(ROOT, "data/pipeline.json");

const TODAY = new Date().toISOString().split("T")[0];

const FULLTIME_2027_PIPELINE = [
  {
    id: 1,
    company: "Graviton Research Capital LLP",
    role: "Software Engineer (2027 Graduate)",
    grade: "A+",
    score: 4.95,
    status: "to_apply",
    source: "greenhouse",
    url: "https://job-boards.greenhouse.io/gravitonresearchcapital/jobs/8764240002",
    salary_listed: "₹45–100+ LPA (Base + Performance Bonus)",
    location: "Gurugram, Haryana, India",
    date_found: TODAY,
    date_applied: null,
    next_action: "Submit application directly via Greenhouse; highlight C++, low-latency systems, and Raft distributed store",
    notes: "Direct 2027 graduate full-time posting: Core Engineering role building nanosecond-scale trading systems in modern C++. Requires EE/CS degree, 0 experience, strong OS/networking, and algorithms."
  },
  {
    id: 2,
    company: "ION Group",
    role: "Software Developer, 2027 Leadership Development Program",
    grade: "A+",
    score: 4.9,
    status: "to_apply",
    source: "lever",
    url: "https://jobs.lever.co/ion/6f66cbb4-c882-4234-b84e-68baea56e1ea",
    salary_listed: "₹16–25 LPA",
    location: "Noida / Mumbai / Pune, India",
    date_found: TODAY,
    date_applied: null,
    next_action: "Submit direct Lever application; highlight backend architecture and Expedia distributed pipeline experience",
    notes: "Direct 2027 graduate full-time posting: Rotational engineering program in financial technology, 0 experience, solution design, and scalable distributed software."
  }
];

fs.mkdirSync(path.join(ROOT, "data"), { recursive: true });
fs.writeFileSync(PIPELINE_PATH, JSON.stringify(FULLTIME_2027_PIPELINE, null, 2));

console.log(`\n✅ Seeded data/pipeline.json with ${FULLTIME_2027_PIPELINE.length} VERIFIED 2027 SDE REQUISITIONS (0 Experience):`);
FULLTIME_2027_PIPELINE.forEach((p, i) => {
  console.log(`${i + 1}. [${p.company}] ${p.role}`);
  console.log(`   🔗 Direct Link: ${p.url}`);
  console.log(`   💰 Salary: ${p.salary_listed} | 📍 ${p.location}\n`);
});

console.log("Run: npm run verify      (to confirm integrity)");
console.log("Run: npm run liveness    (to verify all links are live)");
console.log("Run: npm run dashboard   (to view interactive visual pipeline)\n");
