import React, { useState } from 'react';
import { 
  Users, Mail, Eye, Search, ExternalLink, ShieldAlert, Sparkles, 
  Terminal, CheckCircle2, AlertTriangle, RefreshCw, Copy, Check, 
  ArrowRight, Globe, Lock, UserCheck, ShieldCheck, Database, FileText
} from 'lucide-react';

export function SocialEngineeringSuite({ onSendToTerminal }) {
  const [activeSubTab, setActiveSubTab] = useState('tempmail');

  // --- Tool 1: Temp-Mail State ---
  const [tempEmail, setTempEmail] = useState('recon.agent_892@disposable-vault.io');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isRefreshingMail, setIsRefreshingMail] = useState(false);
  const [tempInbox, setTempInbox] = useState([
    {
      id: 1,
      sender: 'verify@target-portal.com',
      subject: 'Security Code: 849-210',
      time: '1 min ago',
      body: 'Your single-use verification code for Target Portal registration is 849-210. Valid for 10 minutes.'
    },
    {
      id: 2,
      sender: 'no-reply@enterprise-auth.org',
      subject: 'Welcome to Cloud Pentest Sandbox',
      time: '5 mins ago',
      body: 'Account provisioned successfully. Please confirm your disposable testing mailbox.'
    }
  ]);
  const [selectedMail, setSelectedMail] = useState(null);

  const generateNewTempEmail = () => {
    setIsRefreshingMail(true);
    setTimeout(() => {
      const randomId = Math.floor(100 + Math.random() * 900);
      const domains = ['disposable-vault.io', 'mail-ghost.net', 'anon-sec.org', 'temp-inbox.cloud'];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      setTempEmail(`recon.operator_${randomId}@${domain}`);
      setIsRefreshingMail(false);
      setTempInbox([
        {
          id: Date.now(),
          sender: 'system@auth-verify.com',
          subject: 'Fresh Inbox Initialized',
          time: 'Just now',
          body: `New temporary mailbox activated: recon.operator_${randomId}@${domain}. Zero personal telemetry linked.`
        }
      ]);
      setSelectedMail(null);
    }, 400);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(tempEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // --- Tool 2: Social Media OSINT (AnonyIG) State ---
  const [socialUsername, setSocialUsername] = useState('cyber_target_corp');
  const [isScanningSocial, setIsScanningSocial] = useState(false);
  const [socialResult, setSocialResult] = useState({
    username: 'cyber_target_corp',
    displayName: 'Cyber Target Dev & Security',
    bio: 'Securing cloud infrastructures 🚀 | Powered by AWS & Terraform | Contact: devsec@cytarget.io | San Francisco, CA',
    followers: '14.2K',
    following: '382',
    posts: '128',
    isPrivate: false,
    leaksDetected: [
      { type: 'High Risk', desc: 'Direct corporate email (devsec@cytarget.io) exposed in public bio.' },
      { type: 'Medium Risk', desc: 'Internal cloud stack tags identified (AWS, Terraform) providing tech footprint.' },
      { type: 'Low Risk', desc: 'Office location geotagged: San Francisco HQ building visible in story highlights.' }
    ],
    riskScore: 78
  });

  const handleScanSocial = (e) => {
    e.preventDefault();
    if (!socialUsername.trim()) return;
    setIsScanningSocial(true);
    setTimeout(() => {
      setSocialResult({
        username: socialUsername.replace('@', ''),
        displayName: `${socialUsername.replace('@', '')} • Public Account`,
        bio: `Software Engineer & Tech Lead @ Enterprise | DevSecOps enthusiast | Meetups & coffee | Ping: ${socialUsername.replace('@', '')}@external.org`,
        followers: `${(Math.random() * 20 + 2).toFixed(1)}K`,
        following: `${Math.floor(Math.random() * 500 + 100)}`,
        posts: `${Math.floor(Math.random() * 150 + 20)}`,
        isPrivate: false,
        leaksDetected: [
          { type: 'High Risk', desc: `Public direct email leaked: ${socialUsername.replace('@', '')}@external.org` },
          { type: 'Medium Risk', desc: 'Employee role & team hierarchy publicly revealed in bio.' },
          { type: 'Medium Risk', desc: 'High-resolution badge photo detected in recent post (potential barcode/RFID clone risk).' }
        ],
        riskScore: Math.floor(65 + Math.random() * 30)
      });
      setIsScanningSocial(false);
    }, 600);
  };

  // --- Tool 3: Behind The Email OSINT State ---
  const [targetEmail, setTargetEmail] = useState('alex.morgan@techcorp-demo.com');
  const [isEnrichingEmail, setIsEnrichingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState({
    email: 'alex.morgan@techcorp-demo.com',
    fullName: 'Alex Morgan',
    jobTitle: 'Senior Infrastructure & Security Architect',
    organization: 'TechCorp Cloud Systems Inc.',
    location: 'Seattle, WA, United States',
    mxProvider: 'Google Workspace (AS15169 - Google LLC)',
    deliverable: true,
    socialProfiles: [
      { network: 'LinkedIn', handle: 'alex-morgan-sec', status: 'Verified Match' },
      { network: 'GitHub', handle: 'alexm-cloud', status: 'Public Repos Found' },
      { network: 'Gravatar', handle: 'Avatar Linked', status: 'MD5 Hash Resolved' }
    ],
    dataBreachRecords: [
      { breach: 'CloudLeak Aggregator (2024)', compromised: 'Email, Scrypt Hash, Full Name' },
      { breach: 'Developer Forum Dump (2022)', compromised: 'Plaintext IP, Username' }
    ],
    pretextingVectors: [
      'Phishing simulation pretext: Internal IT ticket claiming critical AWS infrastructure maintenance.',
      'Alumni/Conference spear-phishing pretext referencing attended security summit.'
    ]
  });

  const handleEnrichEmail = (e) => {
    e.preventDefault();
    if (!targetEmail.trim()) return;
    setIsEnrichingEmail(true);
    setTimeout(() => {
      const namePart = targetEmail.split('@')[0].replace('.', ' ').toUpperCase();
      const domainPart = targetEmail.split('@')[1] || 'domain.com';
      setEmailResult({
        email: targetEmail,
        fullName: namePart,
        jobTitle: 'Corporate Engineering / Operations Lead',
        organization: domainPart.replace('.com', '').toUpperCase() + ' Corp',
        location: 'North America / Remote',
        mxProvider: domainPart.includes('tech') ? 'Microsoft 365 (Exchange Online Protection)' : 'Google Workspace MX',
        deliverable: true,
        socialProfiles: [
          { network: 'LinkedIn', handle: `${targetEmail.split('@')[0]}-prof`, status: 'Identity Correlated' },
          { network: 'GitHub', handle: targetEmail.split('@')[0], status: 'Activity Detected' },
          { network: 'Corporate Directory', handle: domainPart, status: 'Active MX SPF Pass' }
        ],
        dataBreachRecords: [
          { breach: 'Global Credential Leak (2023)', compromised: 'Email, SHA-1 Hash' }
        ],
        pretextingVectors: [
          `Spear-phishing awareness scenario: Impersonating ${domainPart} HR / IT Benefits Portal.`,
          'Targeted spoofed notification regarding urgent password compliance.'
        ]
      });
      setIsEnrichingEmail(false);
    }, 700);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl relative overflow-hidden shadow-2xl border border-[#1e293b]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-md">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-display flex items-center space-x-2">
                  <span>Social Attacks & OSINT Recon Suite</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30">
                    SOCMINT & Footprinting
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Practical intelligence gathering, disposable mail simulation, social media profiling, and email identity enrichment.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Terminal Command Trigger */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSendToTerminal('theHarvester -d target.com -b all')}
              className="px-3 py-1.5 rounded-lg bg-[#0a0f1d] hover:bg-[#121a2f] border border-purple-500/30 text-xs font-mono text-purple-300 flex items-center space-x-2 transition-all"
              title="Run OSINT scan in Terminal"
            >
              <Terminal className="w-3.5 h-3.5 text-cyber-green" />
              <span>Launch theHarvester</span>
            </button>
          </div>
        </div>

        {/* 3 Main Tool Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800">
          <button
            onClick={() => setActiveSubTab('tempmail')}
            className={`flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
              activeSubTab === 'tempmail'
                ? 'bg-purple-950/30 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                : 'bg-[#0a0d16] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-cyber-green">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold font-display">Temp-Mail Engine</div>
                <div className="text-[10px] text-slate-400 font-mono">temp-mail.org</div>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-cyber-green border border-emerald-500/20">
              Disposable
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('anonyig')}
            className={`flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
              activeSubTab === 'anonyig'
                ? 'bg-purple-950/30 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                : 'bg-[#0a0d16] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold font-display">Social OSINT (AnonyIG)</div>
                <div className="text-[10px] text-slate-400 font-mono">anonyig.com</div>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20">
              SOCMINT
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('behindemail')}
            className={`flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
              activeSubTab === 'behindemail'
                ? 'bg-purple-950/30 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                : 'bg-[#0a0d16] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold font-display">Behind The Email</div>
                <div className="text-[10px] text-slate-400 font-mono">behindtheemail.com</div>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Identity OSINT
            </span>
          </button>
        </div>
      </div>

      {/* --- SUBTAB 1: TEMP-MAIL SUITE --- */}
      {activeSubTab === 'tempmail' && (
        <div className="space-y-6">
          {/* Architecture & How It Works Analysis Card */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <Mail className="w-5 h-5 text-cyber-green" />
                <h2 className="text-sm sm:text-base font-bold text-white font-display">
                  Temp-Mail Architecture & Security Analysis
                </h2>
              </div>
              <a
                href="https://temp-mail.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-cyber-green/40 text-cyber-green text-xs font-mono font-medium transition-all"
              >
                <span>Visit Official temp-mail.org</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#080c14] border border-slate-800/80 space-y-1.5">
                <div className="font-bold text-white flex items-center space-x-1.5">
                  <Database className="w-3.5 h-3.5 text-cyber-green" />
                  <span>How It Works Under The Hood</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Disposable mail providers configure catch-all SMTP servers that accept incoming TCP port 25 email traffic for dynamically rotated domain names. Incoming messages are routed into volatile in-memory stores and exposed via auto-refreshing WebSocket/REST endpoints, auto-purging after expiry.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080c14] border border-slate-800/80 space-y-1.5">
                <div className="font-bold text-white flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Red Team / Pentesting Utility</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Pentesters utilize disposable mailboxes to test authorization bypasses, rate-limiting on registration endpoints, password reset logic, and verification token longevity without burning real corporate domains or exposing analyst personal accounts.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080c14] border border-slate-800/80 space-y-1.5">
                <div className="font-bold text-white flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Blue Team & SOC Defense</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Defenders prevent fake account creation by querying real-time disposable email blocklists (e.g., DNSBL/disposable domain registries) during registration and verifying that the domain’s MX record does not belong to known public temporary mailbox providers.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive In-App Disposable Mailbox Simulator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Email Generator & Controls */}
            <div className="lg:col-span-5 glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyber-green" />
                  <span>Active Disposable Mailbox</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Ready to Receive
                </span>
              </div>

              <div className="p-3 bg-[#080b12] rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="font-mono text-xs sm:text-sm text-cyber-green font-semibold truncate pr-2">
                  {tempEmail}
                </span>
                <button
                  onClick={handleCopyEmail}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors shrink-0"
                  title="Copy Disposable Address"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-cyber-green" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={generateNewTempEmail}
                  disabled={isRefreshingMail}
                  className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingMail ? 'animate-spin' : ''}`} />
                  <span>Generate New Address</span>
                </button>

                <a
                  href="https://temp-mail.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center space-x-1.5 transition-all"
                  title="Open in Temp-Mail.org"
                >
                  <span>Live App</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-3 bg-[#0c121e] rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1.5 font-mono">
                <div className="text-white font-semibold flex items-center space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>OPSEC Advisory:</span>
                </div>
                <p>Never use disposable emails for permanent credentials. Messages are accessible to whoever controls the domain and are automatically deleted after session closure.</p>
              </div>
            </div>

            {/* Right: Simulated Live Inbox */}
            <div className="lg:col-span-7 glass-card p-5 rounded-2xl border border-slate-800 flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                    Virtual Inbox ({tempInbox.length})
                  </span>
                  <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Auto-refreshes in real-time</span>
              </div>

              {/* Message List */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {tempInbox.map(mail => (
                  <div
                    key={mail.id}
                    onClick={() => setSelectedMail(mail)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedMail?.id === mail.id
                        ? 'bg-purple-950/40 border-purple-500 text-white'
                        : 'bg-[#080c14] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-cyber-green font-semibold truncate max-w-[200px]">{mail.sender}</span>
                      <span className="text-slate-500">{mail.time}</span>
                    </div>
                    <div className="text-xs font-bold mt-1 text-slate-100">{mail.subject}</div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">{mail.body}</div>
                  </div>
                ))}
              </div>

              {/* Message Preview Detail */}
              {selectedMail ? (
                <div className="mt-2 p-3.5 rounded-xl bg-[#060910] border border-purple-500/40 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <strong className="text-white font-mono">{selectedMail.subject}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">{selectedMail.time}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">From: {selectedMail.sender}</div>
                  <p className="text-xs text-slate-200 bg-[#0a0f1d] p-3 rounded-lg border border-slate-800 leading-relaxed font-sans">
                    {selectedMail.body}
                  </p>
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-slate-500 font-mono">
                  Select a message above to inspect full message body and verification tokens.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 2: ANONYIG / SOCIAL MEDIA OSINT SUITE --- */}
      {activeSubTab === 'anonyig' && (
        <div className="space-y-6">
          {/* Architecture & How It Works Analysis Card */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <Eye className="w-5 h-5 text-pink-400" />
                <h2 className="text-sm sm:text-base font-bold text-white font-display">
                  AnonyIG & Social Media OSINT (SOCMINT) Analysis
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href="https://anonyig.com/en1/instagram-profile-viewer/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/40 text-pink-400 text-xs font-mono font-medium transition-all"
                >
                  <span>AnonyIG Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Critical Technical Explanation: Why AnonyIG Fails On Real IDs */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
              <div className="flex items-center space-x-2 text-amber-400 font-bold font-mono">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Why Does AnonyIG Often Fail To Find Real Instagram IDs?</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-sans">
                Third-party tools like <strong>AnonyIG, Dumpor, or StoriesIG</strong> frequently break, show <em>"User Not Found"</em>, or fail to load for three core technical reasons:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400 font-mono text-[11px] pl-1">
                <li><strong className="text-slate-200">Meta IP Blacklisting:</strong> Instagram actively monitors incoming traffic from proxy and datacenter IP pools used by scraper sites, automatically banning or throttling them.</li>
                <li><strong className="text-slate-200">Enforced Login Wall:</strong> Meta redirects unauthenticated web endpoints (<code className="text-pink-400">/?__a=1</code> and GraphQL queries) to <code className="text-pink-400">/accounts/login/</code>, requiring valid session cookies (<code className="text-pink-400">sessionid</code>).</li>
                <li><strong className="text-slate-200">Anti-Bot & CAPTCHA:</strong> Heavy traffic triggers Cloudflare/Akamai bot challenges that third-party scraping scripts cannot solve programmatically.</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#080c14] border border-slate-800/80 space-y-1.5">
                <div className="font-bold text-white flex items-center space-x-1.5">
                  <Database className="w-3.5 h-3.5 text-pink-400" />
                  <span>How AnonyIG Tries To Work</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  AnonyIG acts as a reverse-proxy scraper. Instead of the user accessing Instagram directly, AnonyIG's servers query public CDN endpoints and cached story distributions using rotating residential proxies. When proxies get burned by Meta, the service goes down.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080c14] border border-slate-800/80 space-y-1.5">
                <div className="font-bold text-white flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Legitimate OSINT Methods</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Real security investigators do not rely on fragile web scrapers. They use <strong>Google Dorking</strong> (cached public profiles), direct URL inspection, cross-platform username enumeration (<code className="text-pink-400">sherlock</code>), and password-reset recovery hints.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080c14] border border-slate-800/80 space-y-1.5">
                <div className="font-bold text-white flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyber-green" />
                  <span>Mitigation & Digital Hygiene</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Security teams enforce clean desk policies: blur or remove workplace photos containing access badges, do not disclose corporate email addresses on personal profiles, and audit public follower lists for sockpuppet accounts.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive In-App Social Profile OSINT Scanner & Real Tools Hub */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5">
            <form onSubmit={handleScanSocial} className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[240px] relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 font-mono text-sm">@</span>
                <input
                  type="text"
                  value={socialUsername}
                  onChange={(e) => setSocialUsername(e.target.value)}
                  placeholder="Enter target Instagram handle (e.g. cristiano, target_dev)..."
                  className="w-full bg-[#080b12] border border-slate-800 focus:border-pink-500 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isScanningSocial}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold text-xs transition-all flex items-center space-x-2 shadow-lg shadow-pink-600/20 cursor-pointer"
              >
                {isScanningSocial ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Target...</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Target OSINT</span>
                  </>
                )}
              </button>
            </form>

            {/* Real-World Live Verification Toolbar for the Entered Handle */}
            <div className="p-4 rounded-xl bg-[#080c14] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center space-x-2">
                  <Globe className="w-3.5 h-3.5 text-pink-400" />
                  <span>Real-World Public Verification Actions for: <strong className="text-white">@{socialUsername.replace('@', '') || 'target'}</strong></span>
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Reliable Methods
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {/* 1. Direct Instagram Link */}
                <a
                  href={`https://www.instagram.com/${socialUsername.replace('@', '')}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-[#0e1422] hover:bg-[#162035] border border-slate-700/80 text-left transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-white font-mono flex items-center space-x-1">
                      <span>Instagram Direct</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">Verify if ID exists live</div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-pink-400 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* 2. Google OSINT Dork (Bypasses scraper block) */}
                <a
                  href={`https://www.google.com/search?q=site:instagram.com+"${socialUsername.replace('@', '')}"`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-[#0e1422] hover:bg-[#162035] border border-slate-700/80 text-left transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-amber-400 font-mono flex items-center space-x-1">
                      <span>Google Cache Dork</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">Indexed bios & posts</div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* 3. Alternative Mirror: Picuki */}
                <a
                  href={`https://www.picuki.com/profile/${socialUsername.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-[#0e1422] hover:bg-[#162035] border border-slate-700/80 text-left transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-cyan-400 font-mono flex items-center space-x-1">
                      <span>Picuki Web Mirror</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">Alternate viewer</div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* 4. Terminal Sherlock Multi-Platform Scan */}
                <button
                  type="button"
                  onClick={() => onSendToTerminal(`sherlock ${socialUsername.replace('@', '')}`)}
                  className="p-2.5 rounded-lg bg-[#0e1422] hover:bg-[#162035] border border-slate-700/80 text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-cyber-green font-mono flex items-center space-x-1">
                      <span>Sherlock Terminal</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">Search 400+ platforms</div>
                  </div>
                  <Terminal className="w-3.5 h-3.5 text-cyber-green group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            {/* Profile Dossier Result */}
            {socialResult && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-slate-800">
                {/* Left: Extracted Profile Metadata */}
                <div className="lg:col-span-5 p-4 rounded-xl bg-[#080c14] border border-slate-800 space-y-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 p-0.5">
                      <div className="w-full h-full bg-[#0a0d14] rounded-full flex items-center justify-center font-bold text-pink-400 font-display text-lg">
                        {socialResult.username[0]?.toUpperCase() || 'U'}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{socialResult.displayName}</h3>
                      <p className="text-xs text-pink-400 font-mono">@{socialResult.username}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center font-mono py-2 bg-[#05080f] rounded-lg border border-slate-800/80">
                    <div>
                      <div className="text-white font-bold text-xs">{socialResult.posts}</div>
                      <div className="text-[10px] text-slate-500">Posts</div>
                    </div>
                    <div>
                      <div className="text-white font-bold text-xs">{socialResult.followers}</div>
                      <div className="text-[10px] text-slate-500">Followers</div>
                    </div>
                    <div>
                      <div className="text-white font-bold text-xs">{socialResult.following}</div>
                      <div className="text-[10px] text-slate-500">Following</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Simulated OSINT Bio Extraction</label>
                    <p className="text-xs text-slate-200 mt-1 p-2.5 rounded-lg bg-[#05080f] border border-slate-800 leading-relaxed font-sans">
                      {socialResult.bio}
                    </p>
                  </div>
                </div>

                {/* Right: Social Engineering Attack Surface & Vulnerabilities */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Social Engineering Vulnerability Assessment</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Risk Score: {socialResult.riskScore}/100
                    </span>
                  </div>

                  <div className="space-y-2">
                    {socialResult.leaksDetected.map((leak, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#080c14] border border-slate-800 flex items-start space-x-3 text-xs">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold shrink-0 ${
                          leak.type === 'High Risk' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          leak.type === 'Medium Risk' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        }`}>
                          {leak.type}
                        </span>
                        <p className="text-slate-300 font-sans">{leak.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-300 space-y-1 font-mono">
                    <span className="font-bold flex items-center space-x-1.5 text-white">
                      <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                      <span>Defensive Action Plan:</span>
                    </span>
                    <p className="font-sans text-[11px] text-slate-300">
                      Educate staff to omit work emails, badge IDs, and proprietary project roadmaps from social media profiles. Implement strict privacy controls on employee social footprints.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- SUBTAB 3: BEHIND THE EMAIL OSINT SUITE --- */}
      {activeSubTab === 'behindemail' && (
        <div className="space-y-6">
          {/* Architecture & How It Works Analysis Card */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <Search className="w-5 h-5 text-cyan-400" />
                <h2 className="text-sm sm:text-base font-bold text-white font-display">
                  Behind The Email OSINT & Identity Correlation Analysis
                </h2>
              </div>
              <a
                href="https://behindtheemail.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-medium transition-all"
              >
                <span>Visit Official behindtheemail.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#080c14] border border-slate-800/80 space-y-1.5">
                <div className="font-bold text-white flex items-center space-x-1.5">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  <span>How Behind The Email Works</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Behind the Email parses email structures and performs multi-vector lookup: SMTP VRFY/RCPT handshakes to verify inbox deliverability, Gravatar MD5 avatar mapping, Google Account public signals, professional social identity APIs (LinkedIn, GitHub), and public breach compilations.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080c14] border border-slate-800/80 space-y-1.5">
                <div className="font-bold text-white flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-purple-400" />
                  <span>Spear-Phishing Reconnaissance</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  In red teaming, an email address is an anchor point. By discovering the target's role, company hierarchy, and historical breach passwords, an ethical pentester crafts highly targeted pretexting scenarios (e.g. simulated vendor invoice or IT security notice) to evaluate corporate resilience.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080c14] border border-slate-800/80 space-y-1.5">
                <div className="font-bold text-white flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyber-green" />
                  <span>Enterprise Hardening</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Organizations defend against email OSINT through email gateway DMARC policies, enforcing FIDO2 hardware keys (resistant to credential harvesting), removing public employee email directories, and conducting continuous dark web breach exposure audits.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive In-App Email Intelligence Search */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5">
            <form onSubmit={handleEnrichEmail} className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[240px] relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 font-mono text-sm">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  placeholder="Enter target corporate email address..."
                  className="w-full bg-[#080b12] border border-slate-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isEnrichingEmail}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs transition-all flex items-center space-x-2 shadow-lg shadow-cyan-600/20 cursor-pointer"
              >
                {isEnrichingEmail ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Correlating Identity Graph...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Run Identity Enrichment</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onSendToTerminal(`holehe ${targetEmail}`)}
                className="px-3.5 py-2.5 rounded-xl bg-[#0c121e] hover:bg-[#141d30] border border-slate-700 text-slate-300 text-xs font-mono flex items-center space-x-1.5 transition-all"
                title="Run Holehe email registered accounts check"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Launch Holehe CLI</span>
              </button>
            </form>

            {/* Email Intelligence Dossier */}
            {emailResult && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-slate-800">
                {/* Identity Profile Details */}
                <div className="lg:col-span-6 p-4 rounded-xl bg-[#080c14] border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-mono uppercase font-bold text-slate-300 flex items-center space-x-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Reconstructed Identity Dossier</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Deliverable Mailbox
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Full Name:</span>
                      <strong className="text-white text-xs">{emailResult.fullName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Organization:</span>
                      <strong className="text-white text-xs">{emailResult.organization}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Role:</span>
                      <strong className="text-white text-xs">{emailResult.jobTitle}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Mail Infrastructure:</span>
                      <strong className="text-cyan-400 text-xs">{emailResult.mxProvider}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                      Associated Public Accounts & Signals:
                    </span>
                    <div className="space-y-1.5">
                      {emailResult.socialProfiles.map((prof, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#05080f] border border-slate-800 font-mono text-[11px]">
                          <span className="text-white font-medium">{prof.network} ({prof.handle})</span>
                          <span className="text-cyan-400">{prof.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Breach & Spear-Phishing Threat Analysis */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="p-4 rounded-xl bg-[#080c14] border border-slate-800 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono uppercase font-bold text-slate-300 flex items-center space-x-1.5">
                        <Database className="w-3.5 h-3.5 text-rose-400" />
                        <span>Breach Exposure Records</span>
                      </span>
                      <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {emailResult.dataBreachRecords.length} Breaches Found
                      </span>
                    </div>

                    <div className="space-y-2">
                      {emailResult.dataBreachRecords.map((b, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-[#05080f] border border-rose-500/20 text-[11px] font-mono">
                          <div className="text-rose-400 font-bold">{b.breach}</div>
                          <div className="text-slate-400 mt-0.5">Leaked: {b.compromised}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs space-y-2">
                    <span className="font-mono uppercase font-bold text-cyan-300 flex items-center space-x-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Simulated Spear-Phishing Pretexting Vectors:</span>
                    </span>
                    <div className="space-y-1.5 font-sans text-slate-300 text-[11px]">
                      {emailResult.pretextingVectors.map((v, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <span className="text-cyan-400 font-bold">•</span>
                          <p>{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Common Educational CTF / Practice Section for Social Attacks */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800">
        <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-cyber-green" />
          <span>Interactive Linux CLI Tools for OSINT & Social Footprinting</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => onSendToTerminal('theHarvester -d targetcorp.com -b google,linkedin')}
            className="p-3 rounded-xl bg-[#080c14] hover:bg-[#0f172a] border border-slate-800 text-left transition-all group"
          >
            <div className="flex items-center justify-between text-xs font-mono font-bold text-cyber-green">
              <span>theHarvester</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Gathers emails, subdomains, employee names from search engines.</p>
          </button>

          <button
            onClick={() => onSendToTerminal('sherlock target_dev')}
            className="p-3 rounded-xl bg-[#080c14] hover:bg-[#0f172a] border border-slate-800 text-left transition-all group"
          >
            <div className="flex items-center justify-between text-xs font-mono font-bold text-pink-400">
              <span>Sherlock</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Hunts down social media accounts by username across 400+ platforms.</p>
          </button>

          <button
            onClick={() => onSendToTerminal('holehe target@corp.com')}
            className="p-3 rounded-xl bg-[#080c14] hover:bg-[#0f172a] border border-slate-800 text-left transition-all group"
          >
            <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400">
              <span>Holehe</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Checks if an email is attached to Twitter, Instagram, GitHub, etc.</p>
          </button>

          <button
            onClick={() => onSendToTerminal('whois targetcorp.com')}
            className="p-3 rounded-xl bg-[#080c14] hover:bg-[#0f172a] border border-slate-800 text-left transition-all group"
          >
            <div className="flex items-center justify-between text-xs font-mono font-bold text-purple-400">
              <span>Whois & DNS</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Extracts registrar contacts, nameservers, and organization records.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
