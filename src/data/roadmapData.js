export const ROADMAP_STEPS = [
  {
    step: 1,
    title: "Computer Networking Foundations",
    duration: "1 - 2 Weeks",
    description: "Master the OSI 7-layer model, TCP/IP stack, IP subnetting (CIDR), DNS, DHCP, and standard network service ports (21, 22, 25, 53, 80, 443, 445, 3389).",
    skills: ["OSI 7 Layers", "TCP 3-Way Handshake", "Wireshark Packet Analysis", "Subnetting (CIDR)", "Port Scanning Concepts"],
    labRecommendation: "Lab 01: Network Recon & Port Scanning"
  },
  {
    step: 2,
    title: "Linux Command Line & System Mastery",
    duration: "2 Weeks",
    description: "Navigate Linux filesystems without a GUI. Master file permissions (chmod, chown, SUID), process auditing, cron jobs, and bash scripting.",
    skills: ["File Navigation (ls, cd, cat)", "Permissions (rwx, SUID)", "Cron Jobs & Processes", "Bash Scripting", "SSH Keys"],
    labRecommendation: "Lab 03: Linux Permissions & Security Auditing"
  },
  {
    step: 3,
    title: "Reconnaissance & OSINT",
    duration: "2 Weeks",
    description: "Conduct passive reconnaissance using WHOIS, Shodan, and Google Dorking, followed by active port scanning and service fingerprinting with Nmap.",
    skills: ["Google Dorking", "Shodan / Censys", "Whois & DNS Enumeration", "Nmap Advanced NSE", "Subdomain Enumeration"],
    labRecommendation: "Lab 01: Network Recon & Port Scanning"
  },
  {
    step: 4,
    title: "Web Application Penetration Testing",
    duration: "3 - 4 Weeks",
    description: "Intercept HTTP/HTTPS traffic with Burp Suite, uncover OWASP Top 10 vulnerabilities including SQL Injection, XSS, CSRF, and IDOR.",
    skills: ["OWASP Top 10", "SQL Injection (SQLi)", "Cross-Site Scripting (XSS)", "Burp Suite Proxy", "Directory Fuzzing (Gobuster)"],
    labRecommendation: "Lab 02: Web Directory Fuzzing & Header Inspection"
  },
  {
    step: 5,
    title: "System Exploitation & Privilege Escalation",
    duration: "3 Weeks",
    description: "Gain initial foothold using Metasploit, exploit known CVEs, establish reverse shells, and escalate privileges from unprivileged user to root.",
    skills: ["Metasploit Framework", "Reverse & Bind Shells", "Linux SUID Exploitation", "Kernel Exploits", "Windows Active Directory Basics"],
    labRecommendation: "TryHackMe / HackTheBox Labs"
  },
  {
    step: 6,
    title: "Reporting, Bug Bounty & Career Certifications",
    duration: "Ongoing",
    description: "Document technical findings with CVSS severity scoring in professional pentest reports. Prepare for industry certifications such as eJPT, CEH, and OSCP.",
    skills: ["CVSS Scoring", "Vulnerability Remediation", "Professional Pentest Reporting", "Bug Bounty Hunting"],
    labRecommendation: "Real-world CTF Competitions"
  }
];
