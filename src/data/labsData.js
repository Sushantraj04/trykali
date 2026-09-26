export const LABS_DATA = [
  {
    id: "lab-recon",
    title: "Lab 01: Network Recon & Port Scanning",
    level: "Beginner",
    xp: 250,
    target: "10.10.10.45",
    description: "Learn how ethical hackers and penetration testers discover open attack surfaces using ICMP ping and active Nmap scans.",
    tasks: [
      {
        id: "task-1",
        title: "Test Host Reachability",
        instruction: "Run 'ping 10.10.10.45' in the terminal to verify network connectivity to the target.",
        commandHint: "ping 10.10.10.45",
        validate: (action) => action.cmd === 'ping' && action.full.includes('10.10.10.45'),
        completed: false
      },
      {
        id: "task-2",
        title: "Discover Open TCP Ports",
        instruction: "Execute an Nmap scan to identify all listening TCP ports on the target host.",
        commandHint: "nmap 10.10.10.45",
        validate: (action) => action.cmd === 'nmap',
        completed: false
      },
      {
        id: "task-3",
        title: "Service Version Fingerprinting",
        instruction: "Use the '-sV' flag in Nmap to determine the exact software versions of running services.",
        commandHint: "nmap -sV 10.10.10.45",
        validate: (action) => action.cmd === 'nmap' && action.args.includes('-sV'),
        completed: false
      }
    ]
  },
  {
    id: "lab-web-fuzz",
    title: "Lab 02: Web Directory Fuzzing & Header Inspection",
    level: "Intermediate",
    xp: 350,
    target: "http://10.10.10.45",
    description: "Discover hidden web endpoints, administration directories, and inspect HTTP response headers for security misconfigurations.",
    tasks: [
      {
        id: "task-w1",
        title: "Inspect HTTP Response Headers",
        instruction: "Run 'curl -I http://10.10.10.45' to examine server security headers and cookie flags.",
        commandHint: "curl -I http://10.10.10.45",
        validate: (action) => action.cmd === 'curl' && (action.args.includes('-I') || action.args.includes('-i')),
        completed: false
      },
      {
        id: "task-w2",
        title: "Brute-force Hidden Directories",
        instruction: "Run 'gobuster dir -u http://10.10.10.45 -w /usr/share/wordlists/common-dirs.txt' to discover hidden paths.",
        commandHint: "gobuster dir -u http://10.10.10.45 -w /usr/share/wordlists/common-dirs.txt",
        validate: (action) => action.cmd === 'gobuster' || action.cmd === 'dirb',
        completed: false
      },
      {
        id: "task-w3",
        title: "Capture the Flag (CTF)",
        instruction: "Read the secret verification flag located inside '/root/flag.txt' using the cat command.",
        commandHint: "cat flag.txt",
        validate: (action) => action.cmd === 'cat' && action.full.includes('flag.txt'),
        completed: false
      }
    ]
  },
  {
    id: "lab-linux-perm",
    title: "Lab 03: Linux Permissions & Security Auditing",
    level: "Beginner",
    xp: 200,
    target: "Local Kali Terminal",
    description: "Master Linux terminal file permissions, inspect system accounts in /etc/passwd, and secure confidential files.",
    tasks: [
      {
        id: "task-l1",
        title: "Verify Active User Identity",
        instruction: "Execute 'whoami' and 'pwd' in the terminal to confirm current user privileges and working directory.",
        commandHint: "whoami",
        validate: (action) => action.cmd === 'whoami',
        completed: false
      },
      {
        id: "task-l2",
        title: "Audit System Users in /etc/passwd",
        instruction: "Inspect system user accounts by running 'cat /etc/passwd'.",
        commandHint: "cat /etc/passwd",
        validate: (action) => action.cmd === 'cat' && action.full.includes('passwd'),
        completed: false
      },
      {
        id: "task-l3",
        title: "Harden File Permissions",
        instruction: "Restrict notes.txt to owner-only read and write permissions using 'chmod 600 notes.txt'.",
        commandHint: "chmod 600 notes.txt",
        validate: (action) => action.cmd === 'chmod' && action.args.includes('600'),
        completed: false
      }
    ]
  }
];
