#!/usr/bin/env node
/**
 * scripts/referral-outreach-2027.mjs — 2027 Full-Time Offer Outreach & Referral Generator
 * 
 * Generates high-conversion referral requests and recruiter outreach messages
 * specifically positioned for Class of 2027 Full-Time Software Engineer / SDE-1 roles.
 * 
 * Usage:
 *   node scripts/referral-outreach-2027.mjs
 *   node scripts/referral-outreach-2027.mjs --company google
 *   npm run outreach:2027
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const args = process.argv.slice(2);
const companyFilter = args.find(a => a.startsWith("--company="))?.split("=")[1] ||
                      (args.indexOf("--company") !== -1 ? args[args.indexOf("--company") + 1] : null);

const pipelinePath = path.join(ROOT, "data/pipeline.json");
const profilePath  = path.join(ROOT, "config/profile.yml");

if (!fs.existsSync(pipelinePath)) {
  console.error("❌ data/pipeline.json not found. Run: npm run seed:2027 first.");
  process.exit(1);
}

const pipeline = JSON.parse(fs.readFileSync(pipelinePath, "utf8"));

// Candidate profile details
let candidate = {
  name: "Vivek C.K.",
  college: "IIT Ropar",
  degree: "B.Tech Electrical Engineering, Minor in Computer Science",
  batch: "Class of 2027",
  prior_exp: "Ex-SDE Intern at Expedia Group (Go, distributed queues, Trino)",
  cp_rating: "Codeforces Expert (1619) & CodeChef 4-star (1805)",
  flagship_project: "Distributed Key-Value Store in Go (Raft consensus, WAL, gRPC, 30k ops/sec)",
  email: "vivekck7404@gmail.com",
  linkedin: "https://linkedin.com/in/vivekck7404",
  github: "https://github.com/Kaltroniz"
};

console.log("\n🚀 career-ops-india — 2027 Full-Time Referral & Outreach Engine");
console.log(`   Candidate: ${candidate.name} (${candidate.college}, ${candidate.batch})`);
console.log("   Target: Full-Time SDE-1 / Graduate Engineer Opportunities\n");

const targets = companyFilter 
  ? pipeline.filter(p => p.company.toLowerCase().includes(companyFilter.toLowerCase()))
  : pipeline;

if (targets.length === 0) {
  console.log(`No company found matching "${companyFilter}". Available: ${pipeline.map(p => p.company).join(", ")}`);
  process.exit(0);
}

const drafts = [];

targets.forEach((entry, i) => {
  const comp = entry.company;
  const role = entry.role;
  const url  = entry.url;

  const linkedinAlumniMessage = 
`Hi [Alum Name],

Hope you're doing well! I'm ${candidate.name}, currently in my pre-final/final year at ${candidate.college} (${candidate.batch}, Minor in CS).

I'm aiming for full-time Graduate Software Engineer / SDE-1 roles starting 2027 at ${comp}. Previously, I was an SDE Intern at Expedia Group where I engineered Go backend microservices and distributed queues (SNS/SQS, Trino). I'm also an Expert on Codeforces (1619) and built a 30k ops/sec distributed KV store with custom Raft consensus in Go.

I noticed the ${role} opening (${url}). Would you be open to referring me, or reviewing my profile? I'd really appreciate your guidance!

Resume & Projects: ${candidate.github} | ${candidate.linkedin}
Thanks a lot!
${candidate.name}`;

  const recruiterEmail = 
`Subject: Application: ${candidate.name} - ${role} (${candidate.college} '27, Ex-Expedia SDE Intern)

Dear ${comp} University Recruiting Team,

I am writing to express my strong interest in the full-time ${role} position at ${comp} for the graduating Class of 2027.

Brief background on my technical qualifications:
• Academic: B.Tech at ${candidate.college} (${candidate.degree}, CGPA 7.91).
• Production Experience: SDE Intern at Expedia Group — fixed high-throughput scraper pipelines, built internal brand monitoring in Go, and resolved distributed queue/Trino data bottlenecks.
• Systems Engineering: Architected a distributed KV store in Go with Raft consensus, write-ahead logging (WAL), and gRPC handling ~30k ops/sec.
• Problem Solving: Codeforces Expert (Rating 1619, Top 5%) and CodeChef 4-star (Rating 1805) with 600+ algorithmic problems solved.

I would love the opportunity to interview for your 2027 full-time cohort. My resume is attached, and my portfolio is available at ${candidate.github}.

Warm regards,
${candidate.name}
${candidate.email} | +91-7994552002
${candidate.linkedin}`;

  drafts.push({
    company: comp,
    role: role,
    url: url,
    alumni_msg: linkedinAlumniMessage,
    recruiter_msg: recruiterEmail
  });

  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📌 [${i + 1}/${targets.length}] ${comp} — ${role}`);
  console.log(`   🔗 Job Link: ${url}`);
  console.log(`\n💬 LinkedIn Alumni / Employee Referral Message:`);
  console.log(`────────────────────────────────────────────────────────────────────`);
  console.log(linkedinAlumniMessage);
  console.log(`\n📧 Cold Email / University Recruiter Message:`);
  console.log(`────────────────────────────────────────────────────────────────────`);
  console.log(recruiterEmail);
  console.log(`\n`);
});

// Save to markdown artifact in output
fs.mkdirSync(path.join(ROOT, "output"), { recursive: true });
const outputMd = `# Class of 2027 Full-Time Referral & Outreach Templates
Generated: ${new Date().toISOString()}
Candidate: ${candidate.name} (${candidate.college}, Class of 2027)

${drafts.map((d, idx) => `
## ${idx + 1}. ${d.company} — ${d.role}
- **Job URL:** [Portal Link](${d.url})

### LinkedIn Referral Message (Alumni / Engineers)
\`\`\`text
${d.alumni_msg}
\`\`\`

### Direct Recruiter Outreach
\`\`\`text
${d.recruiter_msg}
\`\`\`
---
`).join("\n")}
`;

fs.writeFileSync(path.join(ROOT, "output/referral_drafts_2027.md"), outputMd);
console.log(`💾 All outreach drafts exported to: output/referral_drafts_2027.md\n`);
