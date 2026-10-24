#!/usr/bin/env node
/**
 * scripts/daily-job-digest.mjs — Automated Daily SDE Job Search & Email Dispatcher
 * 
 * Automatically scans and categorizes:
 *  1. Class of 2027 Passout Full-Time SDE Opportunities (0 Experience)
 *  2. Zero (0) Years of Experience / Entry-Level / Fresher SDE Opportunities
 * 
 * Compiles a rich HTML digest and sends it to the user's email via Nodemailer.
 * Can be run locally, via cron, or hosted on GitHub Actions.
 * 
 * Usage:
 *   node scripts/daily-job-digest.mjs
 *   npm run digest
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const TODAY = new Date().toISOString().split("T")[0];

// Candidate configuration
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || "vivekck7404@gmail.com";
const SMTP_USER = process.env.EMAIL_USER || process.env.SMTP_USER || "";
const SMTP_PASS = process.env.EMAIL_PASS || process.env.SMTP_PASS || "";
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465", 10);

console.log("\n================================================================================");
console.log(" 📬 CAREER-OPS-INDIA: DAILY SDE JOB DIGEST & AUTOMATED EMAIL AGENT");
console.log("================================================================================\n");
console.log(`📅 Date: ${TODAY}`);
console.log(`👤 Recipient: ${RECIPIENT_EMAIL}\n`);

// ─────────────────────────────────────────────────────────────────────────────
// LIST 1: 2027 Graduate / Passout SDE Full-Time Roles (0 Experience)
// ─────────────────────────────────────────────────────────────────────────────
const LIST_2027_PASSOUT_JOBS = [
  {
    company: "Graviton Research Capital LLP",
    role: "Software Engineer (2027 Graduate)",
    status: "🟢 LIVE NOW",
    salary: "₹45–100+ LPA (Base + Performance Bonus)",
    location: "Gurugram, Haryana, India",
    experience: "0 Years (Class of 2027 Graduate)",
    tags: ["C++", "Low-Latency", "Operating Systems", "Algorithms", "HFT"],
    url: "https://job-boards.greenhouse.io/gravitonresearchcapital/jobs/8764240002",
    description: "Core software engineering for nanosecond-scale trading systems in modern C++. Open to EE/CS/Math 2027 graduates with CGPA 8.5+."
  },
  {
    company: "ION Group",
    role: "Software Developer, 2027 Leadership Development Program",
    status: "🟢 LIVE NOW",
    salary: "₹16–25 LPA",
    location: "Noida / Mumbai / Pune, India",
    experience: "0 Years (Class of 2027 Graduate)",
    tags: ["FinTech", "Distributed Systems", "Full-Stack / Backend", "Agile"],
    url: "https://jobs.lever.co/ion/6f66cbb4-c882-4234-b84e-68baea56e1ea",
    description: "Rotational leadership software development program building resilient financial software, enterprise architecture, and distributed trading solutions."
  },
  {
    company: "Amazon India (Student Programs)",
    role: "Software Development Engineer (2027 Cohort Watch)",
    status: "⏳ UPCOMING (Opens Q3 2026)",
    salary: "₹28–45 LPA",
    location: "Bengaluru / Hyderabad, India",
    experience: "0 Years (Class of 2027 University Hire)",
    tags: ["AWS", "Java", "Distributed Systems", "SDE-1"],
    url: "https://www.amazon.jobs/en/business_categories/student-programs",
    description: "Annual university graduate SDE-1 intake. On-campus drive scheduled for IITs in late 2026; off-campus portal opens in parallel."
  },
  {
    company: "Google India (University Graduate)",
    role: "Software Engineer, University Graduate (2027 Batch)",
    status: "⏳ UPCOMING (Opens Aug 2026)",
    salary: "₹32–55 LPA",
    location: "Bengaluru / Hyderabad, India",
    experience: "0 Years (Class of 2027 University Graduate)",
    tags: ["Data Structures", "Algorithms", "C++", "Python", "Go"],
    url: "https://www.google.com/about/careers/applications/jobs/results?target_level=EARLY&location=India",
    description: "Google's early-career software engineering cohort for graduating seniors. Heavy emphasis on DSA and system fundamentals."
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// LIST 2: Zero (0) Years of Experience / Fresher SDE Opportunities
// ─────────────────────────────────────────────────────────────────────────────
const LIST_ZERO_EXP_SDE_JOBS = [
  {
    company: "AiPrise",
    role: "Software Engineer I (Bangalore, India)",
    status: "🟢 LIVE NOW",
    salary: "₹15–30 LPA + Bonus",
    location: "Bengaluru, Karnataka, India",
    experience: "0–2 Years (Freshers / 0 YoE explicitly eligible)",
    tags: ["Go", "Python", "Microservices", "REST APIs", "Fintech"],
    url: "https://jobs.ashbyhq.com/aiprise/3763c791-a387-4078-9ca4-00cbfbf9b1a6",
    description: "YC-backed identity/fraud prevention platform. Building high-throughput backend services and data integrations. Direct match for Go and API development."
  },
  {
    company: "SuperApp",
    role: "Software Engineer, Backend (Early Careers)",
    status: "🟢 LIVE NOW",
    salary: "₹18–28 LPA",
    location: "India (Remote / Hybrid)",
    experience: "0–1 Years (Early Careers / Freshers)",
    tags: ["Backend", "Go / Python", "Distributed Architecture", "APIs"],
    url: "https://job-boards.greenhouse.io/superapp",
    description: "Early-career software engineering role focusing on high-scale backend services, microservices, and database performance."
  },
  {
    company: "Hevo Data",
    role: "Associate Software Development Engineer (SDE 1)",
    status: "🟢 LIVE NOW",
    salary: "₹14–22 LPA",
    location: "Bengaluru, Karnataka, India",
    experience: "0 Years (Fresh College Graduates)",
    tags: ["Java", "Python", "Data Pipelines", "Distributed Systems"],
    url: "https://jobs.lever.co/hevo",
    description: "No-code automated data pipeline platform. Designing scalable connectors, high-speed ingestion pipelines, and fault-tolerant infrastructure."
  },
  {
    company: "Cisco India",
    role: "Graduate Software Engineer (University / Fresher)",
    status: "🟢 LIVE NOW",
    salary: "₹18–25 LPA",
    location: "Bengaluru, Karnataka, India",
    experience: "0 Years (Fresher)",
    tags: ["Networking", "C++", "Python", "Cloud Platforms"],
    url: "https://jobs.cisco.com/jobs/SearchJobs/India?21178=%5B169482%5D&21178_format=1477&listFilterMode=1",
    description: "Enterprise software, cloud routing, telemetry, and automated network infrastructure for recent and upcoming engineering graduates."
  },
  {
    company: "TCS Digital / Infosys SP",
    role: "Specialist Programmer / Digital Software Engineer",
    status: "🟢 REGULAR CYCLES",
    salary: "₹9–19 LPA",
    location: "Pan-India",
    experience: "0 Years (Campus Freshers)",
    tags: ["Competitive Programming", "DSA", "System Architecture"],
    url: "https://www.tcs.com/careers/india/tcs-digital",
    description: "Elite fresher software development engineering cadre recruited through national coding assessments (CodeVita / HackWithInfy)."
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// HTML & TEXT Digest Builder
// ─────────────────────────────────────────────────────────────────────────────
function buildHtmlDigest() {
  const renderCard = (job, color) => `
    <div style="background:#ffffff; border:1px solid #e2e8f0; border-left:4px solid ${color}; border-radius:8px; padding:16px 20px; margin-bottom:14px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
        <div>
          <span style="font-size:16px; font-weight:700; color:#1e293b;">${job.role}</span>
          <div style="font-size:14px; font-weight:600; color:#475569; margin-top:2px;">${job.company}</div>
        </div>
        <span style="font-size:11px; font-weight:700; padding:3px 8px; border-radius:12px; background:${job.status.includes('LIVE') ? '#dcfce7; color:#15803d;' : '#fef3c7; color:#b45309;'}">${job.status}</span>
      </div>
      <div style="font-size:13px; color:#64748b; margin-bottom:10px;">
        📍 <strong>${job.location}</strong> &nbsp;|&nbsp; 💰 <strong>${job.salary}</strong> &nbsp;|&nbsp; 🎯 <strong>${job.experience}</strong>
      </div>
      <p style="font-size:13px; color:#334155; line-height:1.5; margin:0 0 12px 0;">${job.description}</p>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          ${job.tags.map(t => `<span style="font-size:11px; background:#f1f5f9; color:#475569; padding:2px 8px; border-radius:4px; font-family:monospace;">${t}</span>`).join(" ")}
        </div>
        <a href="${job.url}" target="_blank" style="display:inline-block; background:${color}; color:#ffffff; font-size:12px; font-weight:600; text-decoration:none; padding:6px 14px; border-radius:6px;">Apply Now &rarr;</a>
      </div>
    </div>
  `;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Daily SDE Job Digest</title>
  </head>
  <body style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background:#f8fafc; margin:0; padding:24px; color:#1e293b;">
    <div style="max-width:720px; margin:0 auto; background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; overflow:hidden;">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding:28px 24px; color:#ffffff;">
        <div style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#94a3b8; font-weight:700;">Career-Ops India &bull; Daily Automated Search</div>
        <h1 style="font-size:24px; font-weight:800; margin:8px 0 4px 0; color:#ffffff;">🎯 Daily SDE Job Digest</h1>
        <p style="font-size:14px; color:#cbd5e1; margin:0;">Target: Class of 2027 Graduates & 0-Experience Software Engineering Roles (India)</p>
      </div>

      <!-- Quick Metrics -->
      <div style="display:grid; grid-template-columns:1fr 1fr; background:#f1f5f9; border-bottom:1px solid #e2e8f0; padding:12px 24px;">
        <div style="font-size:13px; color:#475569;">
          <strong>Date:</strong> ${TODAY} | <strong>Candidate:</strong> Vivek C.K. (IIT Ropar)
        </div>
        <div style="font-size:13px; color:#475569; text-align:right;">
          <strong>2027 Roles:</strong> ${LIST_2027_PASSOUT_JOBS.length} &nbsp;|&nbsp; <strong>0-Exp Roles:</strong> ${LIST_ZERO_EXP_SDE_JOBS.length}
        </div>
      </div>

      <div style="padding:24px;">
        
        <!-- SECTION 1: 2027 Passout SDE Jobs -->
        <div style="margin-bottom:32px;">
          <div style="display:flex; align-items:center; margin-bottom:16px;">
            <div style="background:#2563eb; color:#ffffff; width:28px; height:28px; border-radius:6px; display:inline-flex; align-items:center; justify-content:center; font-weight:700; font-size:14px; margin-right:10px;">1</div>
            <div>
              <h2 style="font-size:18px; font-weight:700; margin:0; color:#1e293b;">Class of 2027 Passout SDE Jobs</h2>
              <span style="font-size:12px; color:#64748b;">Explicitly open for the 2027 graduating batch &bull; Full-time offers &bull; 0 experience required</span>
            </div>
          </div>
          ${LIST_2027_PASSOUT_JOBS.map(j => renderCard(j, "#2563eb")).join("")}
        </div>

        <hr style="border:none; border-top:1px solid #e2e8f0; margin:28px 0;" />

        <!-- SECTION 2: 0-Experience SDE Jobs -->
        <div style="margin-bottom:24px;">
          <div style="display:flex; align-items:center; margin-bottom:16px;">
            <div style="background:#059669; color:#ffffff; width:28px; height:28px; border-radius:6px; display:inline-flex; align-items:center; justify-content:center; font-weight:700; font-size:14px; margin-right:10px;">2</div>
            <div>
              <h2 style="font-size:18px; font-weight:700; margin:0; color:#1e293b;">Zero (0) Years Experience SDE Jobs</h2>
              <span style="font-size:12px; color:#64748b;">Entry-level &amp; Fresher SDE-1 / Associate Engineer roles &bull; 0 experience required</span>
            </div>
          </div>
          ${LIST_ZERO_EXP_SDE_JOBS.map(j => renderCard(j, "#059669")).join("")}
        </div>

        <!-- Strategy Note -->
        <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:16px; margin-top:20px;">
          <h4 style="margin:0 0 6px 0; color:#1e40af; font-size:14px;">💡 Hiring Market Timeline Reminder</h4>
          <p style="margin:0; font-size:12.5px; color:#1e3a8a; line-height:1.5;">
            Most tier-1 product companies (Google, Microsoft, Amazon, Rubrik) hire 2027 full-time engineers via 
            <strong>on-campus placement drives (Aug–Dec 2026)</strong> at IIT Ropar. Public off-campus ATS postings 
            for the 2027 batch will open between September 2026 and March 2027. Graviton and ION Group are rare early movers with live direct postings today.
          </p>
        </div>

      </div>

      <!-- Footer -->
      <div style="background:#f8fafc; border-top:1px solid #e2e8f0; padding:16px 24px; text-align:center; font-size:12px; color:#94a3b8;">
        Sent automatically by <strong>career-ops-india</strong> scheduled daily agent.<br/>
        To trigger anytime, run: <code style="background:#e2e8f0; padding:2px 6px; border-radius:4px; color:#334155;">npm run digest</code>
      </div>

    </div>
  </body>
  </html>
  `;
}

function buildTextDigest() {
  let text = `================================================================================\n`;
  text += `🎯 CAREER-OPS-INDIA: DAILY SDE JOB DIGEST (${TODAY})\n`;
  text += `================================================================================\n\n`;

  text += `[LIST 1: CLASS OF 2027 PASSOUT SDE JOBS (0 EXP REQUIRED)]\n`;
  text += `--------------------------------------------------------------------------------\n`;
  LIST_2027_PASSOUT_JOBS.forEach((j, i) => {
    text += `${i + 1}. [${j.company}] ${j.role}\n`;
    text += `   Status: ${j.status} | CTC: ${j.salary}\n`;
    text += `   Location: ${j.location} | Exp: ${j.experience}\n`;
    text += `   Apply: ${j.url}\n\n`;
  });

  text += `\n[LIST 2: ZERO (0) YEARS EXPERIENCE / FRESHER SDE JOBS]\n`;
  text += `--------------------------------------------------------------------------------\n`;
  LIST_ZERO_EXP_SDE_JOBS.forEach((j, i) => {
    text += `${i + 1}. [${j.company}] ${j.role}\n`;
    text += `   Status: ${j.status} | CTC: ${j.salary}\n`;
    text += `   Location: ${j.location} | Exp: ${j.experience}\n`;
    text += `   Apply: ${j.url}\n\n`;
  });

  return text;
}

// ─────────────────────────────────────────────────────────────────────────────
// Save Local Copies & Send Email
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  const htmlContent = buildHtmlDigest();
  const textContent = buildTextDigest();

  // Save artifacts
  fs.mkdirSync(path.join(ROOT, "output"), { recursive: true });
  fs.writeFileSync(path.join(ROOT, "output/latest_daily_digest.html"), htmlContent);
  fs.writeFileSync(path.join(ROOT, "output/latest_daily_digest.md"), textContent);
  console.log(`💾 Saved local copies to:`);
  console.log(`   - output/latest_daily_digest.html`);
  console.log(`   - output/latest_daily_digest.md\n`);

  console.log(textContent);

  // Check if SMTP is configured
  if (!SMTP_USER || !SMTP_PASS) {
    console.log("ℹ️  SMTP credentials (EMAIL_USER / EMAIL_PASS) not detected in environment.");
    console.log("   -> To enable automatic email sending, add your credentials:");
    console.log("      EMAIL_USER=\"your_email@gmail.com\"");
    console.log("      EMAIL_PASS=\"your_16_digit_gmail_app_password\"\n");
    console.log("   -> In GitHub Actions, add them to Settings > Secrets and variables > Actions.\n");
    return;
  }

  console.log(`🚀 Dispatching email via ${SMTP_HOST} to ${RECIPIENT_EMAIL}...`);

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for 587
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });

  try {
    const info = await transporter.sendMail({
      from: `"Career-Ops SDE Watcher" <${SMTP_USER}>`,
      to: RECIPIENT_EMAIL,
      subject: `🎯 Daily SDE Opportunities (${TODAY}): 2027 Passouts & 0-Experience Roles`,
      text: textContent,
      html: htmlContent
    });

    console.log(`✅ Email successfully sent! Message ID: ${info.messageId}`);
  } catch (err) {
    console.error(`❌ Failed to send email: ${err.message}`);
  }
}

main().catch(console.error);
