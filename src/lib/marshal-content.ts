// Content for the Marshal (Stellar GRC) marketing page.
// Ported verbatim from the design handoff — see design_handoff_marshal_site/README.md.
// All copy here is placeholder marketing copy per the handoff's "Content accuracy
// warning": legal/marketing must confirm or replace every number and quote before launch.

export type Automation = {
  name: string;
  cadence: string;
  what: string;
  maps: string;
};

export type AutomationGroup = {
  name: string;
  note: string;
  count: string;
  items: Automation[];
};

const A = (name: string, cadence: string, what: string, maps: string): Automation => ({
  name,
  cadence,
  what,
  maps,
});

export const automationGroups: AutomationGroup[] = [
  {
    name: "Cloud & infrastructure",
    note: "Read-only roles in each account; nothing is written back to production.",
    count: "84 automations",
    items: [
      A(
        "Public storage sweep",
        "Hourly",
        "Enumerates every S3, Blob and GCS bucket and flags any object or bucket readable by anonymous principals.",
        "ECC 2-3-3 · CC6.1 · ISO A.8.20"
      ),
      A(
        "Encryption at rest",
        "Daily",
        "Confirms KMS/CMK encryption on volumes, snapshots, databases and backups; records the key rotation age.",
        "ECC 2-8-2 · PCI 3.5 · ISO A.8.24"
      ),
      A(
        "Backup completion",
        "Daily",
        "Checks that every tagged production resource completed a backup inside its RPO and files the job log.",
        "SAMA BCM 3.3 · ISO 22301 8.4"
      ),
      A(
        "Restore proof",
        "Quarterly",
        "Opens a restore job in an isolated account, records the elapsed time, attaches the result as test evidence.",
        "ISO 22301 8.5 · CC A1.2"
      ),
      A(
        "Network exposure diff",
        "Hourly",
        "Diffs security groups and NSGs against the approved baseline and opens a change ticket on drift.",
        "ECC 2-5-3 · PCI 1.2"
      ),
      A(
        "Patch currency",
        "Daily",
        "Reads patch state from SSM, Intune and the Linux fleet; ages each critical CVE against your SLA.",
        "ECC 2-10-3 · CC7.1"
      ),
      A(
        "Log retention check",
        "Weekly",
        "Verifies CloudTrail, Activity Log and audit sinks are on, immutable and retained for the policy window.",
        "ECC 2-12-1 · PCI 10.5"
      ),
      A(
        "Certificate expiry",
        "Daily",
        "Watches every TLS certificate and DNS record and raises a task 30 days before expiry.",
        "ISO A.8.24 · CC6.7"
      ),
    ],
  },
  {
    name: "Identity & access",
    note: "Entra ID, Okta, Google Workspace and the cloud IAM planes, reconciled against HR.",
    count: "62 automations",
    items: [
      A(
        "Joiner provisioning proof",
        "On event",
        "Captures the approval, the role granted and the timestamp for every new account created.",
        "ECC 2-2-3 · CC6.2"
      ),
      A(
        "Leaver revocation",
        "On event",
        "Watches the HRIS termination feed and proves every session, token and account was killed inside 24 hours.",
        "ECC 2-2-3 · ISO A.5.11"
      ),
      A(
        "Quarterly access review",
        "Quarterly",
        "Builds the entitlement pack per system, routes it to the owner, and files the signed decision set.",
        "SAMA 3.3.5 · CC6.3"
      ),
      A(
        "MFA coverage",
        "Daily",
        "Counts accounts without phishing-resistant MFA, broken out by privilege tier.",
        "ECC 2-2-3 · PCI 8.4"
      ),
      A(
        "Privileged account inventory",
        "Daily",
        "Reconciles admin, break-glass and service accounts against the approved register.",
        "SAMA 3.3.6 · ISO A.8.2"
      ),
      A(
        "Dormant account sweep",
        "Weekly",
        "Flags any account idle past the policy threshold and opens a disable task.",
        "ISO A.5.16 · CC6.2"
      ),
      A(
        "Password policy attest",
        "Monthly",
        "Reads the live directory policy and compares it to the documented standard, clause by clause.",
        "ECC 2-2-1 · PCI 8.3"
      ),
      A(
        "Shared credential detection",
        "Weekly",
        "Scans the vault for credentials used by more than one identity or checked out without a ticket.",
        "ISO A.5.17"
      ),
    ],
  },
  {
    name: "Evidence & policy",
    note: "The document machinery: drafting, approval, acknowledgement and expiry.",
    count: "48 automations",
    items: [
      A(
        "Policy review cycle",
        "Annual",
        "Reopens each policy on its anniversary, routes to the owner and approver, versions the result.",
        "ECC 1-3-1 · ISO 5.2"
      ),
      A(
        "Acknowledgement chase",
        "Weekly",
        "Tracks who has read the current version and nudges the rest through email and Slack.",
        "ECC 1-3-3 · CC1.4"
      ),
      A(
        "Evidence freshness",
        "Daily",
        "Ages every artefact against its control's window and reopens the task before it expires.",
        "CC4.1 · ISO 9.1"
      ),
      A(
        "Auto control mapping",
        "On change",
        "Maps a satisfied control to every framework clause it also satisfies, with the reference IDs intact.",
        "Unified control set"
      ),
      A(
        "Meeting minute capture",
        "Monthly",
        "Pulls the security committee pack and minutes into the governance record.",
        "ECC 1-2-1 · ISO 9.3"
      ),
      A(
        "Exception expiry",
        "Daily",
        "Watches approved exceptions and forces a re-approval decision on the expiry date.",
        "ISO 6.1.3"
      ),
      A(
        "Change approval sampling",
        "Weekly",
        "Samples merged changes and proves each carried the required review and approval.",
        "PCI 6.5 · CC8.1"
      ),
      A(
        "Audit pack export",
        "On demand",
        "Assembles the full bilingual evidence pack — controls, artefacts, sign-offs — as one export.",
        "Regulator submission"
      ),
    ],
  },
  {
    name: "Risk & monitoring",
    note: "The register does arithmetic, and the arithmetic updates itself.",
    count: "54 automations",
    items: [
      A(
        "Residual risk recalculation",
        "On change",
        "Recomputes residual score whenever a treating control's test result changes.",
        "ISO 27005 · ECC 1-5-1"
      ),
      A(
        "KRI thresholds",
        "Daily",
        "Reads the live indicator set and escalates any breach to the risk owner and the committee pack.",
        "SAMA 3.1.4"
      ),
      A(
        "Vulnerability ingest",
        "Hourly",
        "Pulls scanner findings, dedupes them onto assets, and ages each against its severity SLA.",
        "ECC 2-10-2 · PCI 11.3"
      ),
      A(
        "Threat intel matching",
        "Daily",
        "Matches published advisories against your asset inventory and raises only what applies to you.",
        "ECC 4-1-2"
      ),
      A(
        "Incident timeline build",
        "On event",
        "Builds the incident record from ticket, chat and alert timestamps — detection to closure.",
        "ECC 5-1-2 · PDPL 72h"
      ),
      A(
        "Control failure alerting",
        "Real time",
        "Routes any failed test to the owner in Slack or Teams with the evidence and the remediation note.",
        "CC4.2"
      ),
      A(
        "BIA refresh",
        "Annual",
        "Reopens business impact analysis per process with last year's answers pre-filled.",
        "SAMA BCM 2.2 · ISO 22301 8.2"
      ),
      A(
        "DR exercise evidence",
        "Semi-annual",
        "Schedules the exercise, collects timings and lessons, files the report against the control.",
        "SAMA BCM 4.1"
      ),
    ],
  },
  {
    name: "Vendors & third parties",
    note: "Questionnaires, evidence chasing and continuous monitoring of the supply chain.",
    count: "34 automations",
    items: [
      A(
        "Questionnaire dispatch",
        "On onboard",
        "Sends the tier-appropriate questionnaire and chases it to completion without a human in the loop.",
        "ECC 4-1-1 · CC9.2"
      ),
      A(
        "SOC 2 report watch",
        "Monthly",
        "Tracks each vendor's report expiry and requests the bridge letter before the gap opens.",
        "CC9.2"
      ),
      A(
        "Vendor breach monitoring",
        "Daily",
        "Watches disclosure feeds for your vendor list and opens an assessment on a hit.",
        "ECC 4-2-1"
      ),
      A(
        "Contract clause check",
        "On renewal",
        "Confirms the DPA, data-residency and notification clauses exist before renewal is approved.",
        "PDPL Art. 30 · GDPR 28"
      ),
      A(
        "Reassessment cadence",
        "Annual",
        "Re-runs the assessment on tier and criticality without anyone remembering to.",
        "ISO A.5.22"
      ),
      A(
        "Sub-processor register",
        "On change",
        "Keeps the published sub-processor list in step with what the vendors actually declare.",
        "PDPL · GDPR 28.2"
      ),
    ],
  },
  {
    name: "People & awareness",
    note: "Training, phishing and the human controls, on the same calendar as everything else.",
    count: "30 automations",
    items: [
      A(
        "Training assignment",
        "On join",
        "Assigns the role-based curriculum on day one from the HRIS event, in Arabic or English.",
        "ECC 1-6-1 · CC1.4"
      ),
      A(
        "Phishing simulation",
        "Monthly",
        "Runs the campaign, scores by department, auto-enrols repeat clickers in remediation.",
        "ECC 1-6-3"
      ),
      A(
        "Completion chasing",
        "Weekly",
        "Nudges the incomplete list, escalates to the line manager at day 14.",
        "ISO A.6.3"
      ),
      A(
        "Background check proof",
        "On join",
        "Files the screening confirmation against the joiner's control record.",
        "ISO A.6.1 · CC1.4"
      ),
      A(
        "Acceptable use attest",
        "Annual",
        "Collects the annual attestation and stores the signature with the version acknowledged.",
        "ECC 1-4-1"
      ),
      A(
        "Offboarding checklist",
        "On leave",
        "Proves asset return, access removal and exit acknowledgement in one record.",
        "ISO A.5.11"
      ),
    ],
  },
];

export const products = [
  { name: "Compliance", note: "Controls, evidence and multi-framework mapping.", href: "#platform" },
  { name: "Risk", note: "ISO 27005 / NIST SP 800-30 register, KRIs, treatment plans.", href: "#platform" },
  { name: "Business Continuity", note: "BIA, DRP, exercises and resilience reporting.", href: "#platform" },
  { name: "Audit Management", note: "Audit universe, working papers, findings, QAIP.", href: "#platform" },
  { name: "Professional Services", note: "Implementation and inspection readiness, delivered by us.", href: "#platform" },
];

export const frameworksMenu = [
  { name: "NCA ECC", meta: "108 controls" },
  { name: "NCA CSCC", meta: "85 controls" },
  { name: "SAMA CSF", meta: "250 controls" },
  { name: "SAMA BCM", meta: "75 controls" },
  { name: "ISO/IEC 27001", meta: "93 controls" },
  { name: "PDPL", meta: "Lifecycle" },
  { name: "SOC 2", meta: "5 criteria" },
  { name: "Free readiness assessment", meta: "No signup" },
];

export const compareMenu = [
  "Marshal vs Sahl",
  "Marshal vs GRC Vantage",
  "Marshal vs Cyber Arrow",
  "Marshal vs Vanta",
  "Marshal vs Drata",
  "Marshal vs Sprinto",
  "Marshal vs Secureframe",
  "Marshal vs OneTrust",
  "NCA ECC vs SAMA CSF",
];

export const integrations = [
  "AWS",
  "Microsoft Azure",
  "Google Cloud",
  "Entra ID",
  "Okta",
  "Google Workspace",
  "Jira",
  "GitHub",
  "GitLab",
  "Slack",
  "Microsoft 365",
  "CrowdStrike",
  "Jamf",
  "Intune",
  "Workday",
  "Snowflake",
  "Cloudflare",
  "Datadog",
];

export const statBand = [
  { value: "312", label: "Automations shipped in the library" },
  { value: "91%", label: "Of evidence collected without a human" },
  { value: "40+", label: "Frameworks mapped to one control set" },
  { value: "6 wks", label: "Median time to first certification" },
];

export const pipeline = [
  {
    n: "01",
    title: "Connect",
    body: "Read-only OAuth or a scoped role per system. No agents in production, no write scopes, no exceptions.",
  },
  {
    n: "02",
    title: "Test",
    body: "The automation runs its check on its own cadence — hourly, daily, on an HR event, on a merge.",
  },
  {
    n: "03",
    title: "File",
    body: "The result lands in the control record with a timestamp, the raw response and the framework clauses it clears.",
  },
  {
    n: "04",
    title: "Escalate",
    body: "A failure opens a task on the named owner, posts to their channel, and ages against the remediation SLA.",
  },
];

export const disciplines = [
  {
    kicker: "Compliance",
    title: "Controls & evidence",
    body: "One control set mapped across every framework you carry, with the canonical reference IDs regulators expect.",
    autos: "180 automations",
  },
  {
    kicker: "Risk",
    title: "Register & treatment",
    body: "ISO 27005-aligned scoring, inherent and residual, with treatment plans that carry owners and dates.",
    autos: "54 automations",
  },
  {
    kicker: "Continuity",
    title: "BCM & resilience",
    body: "SAMA BCM and ISO 22301 lifecycle — policy, BIA, DRP, exercises and the lessons that follow.",
    autos: "38 automations",
  },
  {
    kicker: "Audit",
    title: "Internal audit",
    body: "IIA-aligned audit universe, working papers, findings and follow-up, with a read-only auditor workspace.",
    autos: "40 automations",
  },
];

export const frameworks = [
  { name: "NCA ECC", status: "Live", note: "Essential Cybersecurity Controls, the Saudi baseline.", controls: "108 controls automated" },
  { name: "SAMA CSF", status: "Live", note: "Financial sector framework on the 5-level maturity model.", controls: "250 controls automated" },
  { name: "PDPL", status: "Live", note: "Lawful basis, RoPA, DPO duties, 72-hour breach notice to SDAIA.", controls: "Full lifecycle" },
  { name: "ISO/IEC 27001", status: "Live", note: "Annex A 2022 plus the management system clauses.", controls: "93 controls automated" },
  { name: "SOC 2", status: "Live", note: "Type I and Type II across all five trust services criteria.", controls: "Continuous monitoring" },
  { name: "PCI DSS v4.0", status: "Live", note: "Twelve requirements across the cardholder data environment.", controls: "Scoped CDE testing" },
  { name: "NCA CSCC", status: "Live", note: "Critical systems controls layered on top of ECC.", controls: "85 controls automated" },
  { name: "SAMA BCM", status: "Live", note: "Business continuity for SAMA-supervised entities.", controls: "75 controls automated" },
  { name: "ISO 22301", status: "Live", note: "Business continuity management systems.", controls: "Lifecycle automated" },
  { name: "GDPR", status: "Live", note: "Records, DPIAs, subject requests and transfers.", controls: "Full lifecycle" },
  { name: "NIST CSF 2.0", status: "Live", note: "Govern through recover, mapped to your control set.", controls: "6 functions mapped" },
  { name: "Custom", status: "Any", note: "Bring your own control set — internal standards, client contracts.", controls: "Mapped on import" },
];

export const quotes = [
  {
    text: "Eleven weeks a year went into assembling evidence. Marshal assembles it continuously, so the eleven weeks now go into fixing what it finds.",
    who: "Head of Information Security, payments company",
  },
  {
    text: "We turned on the identity automations on a Tuesday and had a leaver-revocation gap on screen by Wednesday. That gap had survived two audits.",
    who: "IT Director, logistics group",
  },
  {
    text: "The ECC reference IDs are the ones the regulator uses. We stopped maintaining a translation sheet between our platform and our submission.",
    who: "GRC Manager, SAMA-supervised entity",
  },
];

export const faqs = [
  {
    q: "How long until the automations produce usable evidence?",
    a: "Most tenants connect their first five systems in an afternoon and have a populated control set within 48 hours. The scheduled tests backfill immediately, so the first evidence is dated the day you connect — not the day you started the project.",
  },
  {
    q: "What access does Marshal need in our production estate?",
    a: "Read-only, scoped per system. Cloud connectors use a role limited to configuration and log metadata; identity connectors read directory state, never credentials. Nothing is written back and no agent runs on your workloads.",
  },
  {
    q: "Can we write our own automations?",
    a: "Yes. Any automation in the library can be cloned and edited — trigger, schedule, test logic and the clauses it maps to — and you can author new ones against any connected system or a webhook from a system we don't ship a connector for.",
  },
  {
    q: "What happens when a control fails at 3am?",
    a: "The failure opens a task on the named owner, posts to their Slack or Teams channel, and starts ageing against the remediation SLA. Repeat failures escalate to the risk register rather than sitting in a queue.",
  },
  {
    q: "Do you replace our auditor?",
    a: "No. Marshal gives your auditor a read-only workspace with every control, its evidence history and its sign-offs, plus request and sample tracking. The fieldwork stops being a file-transfer project; the opinion is still theirs.",
  },
];

export const migration = [
  "Import your control set, policies and evidence history with dates preserved.",
  "Automated re-mapping onto Marshal's unified control library — no re-answering.",
  "Parallel run for one cycle so nothing lapses during the switch.",
  "Migration delivered by the Stellar GRC team, not a support article.",
];
