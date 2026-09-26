export const TOOLS_CATEGORIES = [
  "All",
  "Information Gathering",
  "Vulnerability Analysis",
  "Web Applications",
  "Password Attacks",
  "Exploitation Tools",
  "Sniffing & Spoofing",
  "Forensics"
];

export const KALI_TOOLS = [
  {
    id: "nmap",
    name: "Nmap",
    category: "Information Gathering",
    badge: "Essential",
    description: "Network exploration tool and security / port scanner. Used for active host discovery, service fingerprinting, and OS detection.",
    defaultCommand: "nmap -sV -sC -T4 10.10.10.45",
    flags: [
      { flag: "-sV", label: "Service Version Detection", desc: "Detects running service versions on open ports", checked: true },
      { flag: "-sC", label: "Default NSE Scripts", desc: "Runs default Nmap vulnerability scripts", checked: true },
      { flag: "-T4", label: "Aggressive Timing", desc: "Speeds up scan execution", checked: true },
      { flag: "-p-", label: "All 65535 Ports", desc: "Scans all TCP ports instead of top 1000", checked: false },
      { flag: "-O", label: "OS Detection", desc: "Fingerprints target operating system", checked: false },
      { flag: "-Pn", label: "Skip Ping", desc: "Treats host as online even if ICMP is blocked", checked: false }
    ],
    examples: [
      { cmd: "nmap -sV 10.10.10.45", note: "Basic service scan" },
      { cmd: "nmap -A -p 80,443 10.10.10.45", note: "Aggressive scan on web ports" },
      { cmd: "nmap --script vuln 10.10.10.45", note: "Run vulnerability detection scripts" }
    ]
  },
  {
    id: "gobuster",
    name: "Gobuster",
    category: "Web Applications",
    badge: "Web Pentest",
    description: "High-speed directory, DNS, and vhost brute-forcing tool written in Go. Used to discover hidden files and administration panels.",
    defaultCommand: "gobuster dir -u http://10.10.10.45 -w /usr/share/wordlists/common-dirs.txt",
    flags: [
      { flag: "dir", label: "Directory Mode", desc: "Directory brute-forcing mode", checked: true },
      { flag: "-u http://10.10.10.45", label: "Target URL", desc: "The URL of the target web server", checked: true },
      { flag: "-w /usr/share/wordlists/common-dirs.txt", label: "Wordlist", desc: "Dictionary file to fuzz", checked: true },
      { flag: "-x php,html,txt", label: "Extensions", desc: "Search for specific file extensions", checked: false },
      { flag: "-t 50", label: "Threads", desc: "Run 50 concurrent threads", checked: false }
    ],
    examples: [
      { cmd: "gobuster dir -u http://10.10.10.45 -w /usr/share/wordlists/common-dirs.txt", note: "Scan website for hidden endpoints" }
    ]
  },
  {
    id: "sqlmap",
    name: "SQLmap",
    category: "Vulnerability Analysis",
    badge: "Database",
    description: "Automatic SQL injection and database takeover tool. Detects and exploits SQLi vulnerabilities in web applications.",
    defaultCommand: "sqlmap -u \"http://10.10.10.45/login?user=admin\" --batch",
    flags: [
      { flag: "--batch", label: "Non-Interactive", desc: "Automatically selects default options", checked: true },
      { flag: "--dbs", label: "Enumerate Databases", desc: "Lists all database schemas on target", checked: false },
      { flag: "--risk=3 --level=5", label: "High Risk Tests", desc: "Performs extensive payload injections", checked: false },
      { flag: "--os-shell", label: "OS Shell", desc: "Attempts to gain interactive shell if privileged", checked: false }
    ],
    examples: [
      { cmd: "sqlmap -u \"http://10.10.10.45/login?user=admin\" --batch", note: "Test GET parameter for SQL injection" }
    ]
  },
  {
    id: "john",
    name: "John the Ripper",
    category: "Password Attacks",
    badge: "Cracker",
    description: "Fast password cracker available for Unix, Windows, and macOS. Supports hundreds of hash and cipher types.",
    defaultCommand: "john --wordlist=/usr/share/wordlists/rockyou-sample.txt hash.txt",
    flags: [
      { flag: "--wordlist=/usr/share/wordlists/rockyou-sample.txt", label: "Wordlist", desc: "Dictionary based attack", checked: true },
      { flag: "--format=raw-md5", label: "MD5 Format", desc: "Specifies MD5 hash format", checked: false },
      { flag: "--show", label: "Show Cracked", desc: "Displays previously cracked passwords", checked: false }
    ],
    examples: [
      { cmd: "john --wordlist=/usr/share/wordlists/rockyou-sample.txt hash.txt", note: "Crack password hashes using wordlist" }
    ]
  },
  {
    id: "whois",
    name: "Whois",
    category: "Information Gathering",
    badge: "Recon",
    description: "Command line client for the WHOIS protocol to query databases storing registered assignees of Internet resources and domains.",
    defaultCommand: "whois google.com",
    flags: [],
    examples: [
      { cmd: "whois google.com", note: "Query domain registration details" }
    ]
  },
  {
    id: "curl",
    name: "cURL",
    category: "Web Applications",
    badge: "Network",
    description: "Command line tool for transferring data with URLs. Essential for inspecting HTTP response headers, cookies, and API endpoints.",
    defaultCommand: "curl -I http://10.10.10.45",
    flags: [
      { flag: "-I", label: "Headers Only", desc: "Fetch only HTTP response headers", checked: true },
      { flag: "-v", label: "Verbose", desc: "Print full handshake & TLS information", checked: false },
      { flag: "-L", label: "Follow Redirects", desc: "Follow HTTP 301/302 redirects", checked: false }
    ],
    examples: [
      { cmd: "curl -I http://10.10.10.45", note: "Inspect server security headers" }
    ]
  }
];
