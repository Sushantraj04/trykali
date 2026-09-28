// Realistic In-Browser Linux & Cyber Terminal Simulator Engine v2.5

export class TerminalSimulator {
  constructor(onLabAction) {
    this.currentPath = '/root';
    this.history = [];
    this.historyIndex = -1;
    this.onLabAction = onLabAction; // callback for lab task validation

    // Virtual File System
    this.fs = {
      '/root': {
        type: 'dir',
        content: {
          'notes.txt': { type: 'file', content: "Target scope for practice: 10.10.10.45\nRemember: Always gather intel before attacking." },
          'flag.txt': { type: 'file', content: "FLAG{kali_terminal_master_2026}" },
          'targets.txt': { type: 'file', content: "10.10.10.45\n10.10.10.88\nvulnerable-lab.internal" },
          'hash.txt': { type: 'file', content: "admin:5f4dcc3b5aa765d61d8327deb882cf99" },
          'scans': { type: 'dir', content: {} }
        }
      },
      '/etc': {
        type: 'dir',
        content: {
          'passwd': { type: 'file', content: "root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nkali:x:1000:1000:Kali Live User,,,:/home/kali:/bin/bash\nstudent:x:1001:1001:Student Practice:/home/student:/bin/bash" },
          'hosts': { type: 'file', content: "127.0.0.1 localhost\n10.10.10.45 target.lab\n10.10.10.88 dev.lab" }
        }
      },
      '/usr/share/wordlists': {
        type: 'dir',
        content: {
          'rockyou-sample.txt': { type: 'file', content: "123456\npassword\n12345678\nqwerty\nadmin123\ncybersec2026\niloveyou\nmonkey" },
          'common-dirs.txt': { type: 'file', content: "admin\nlogin\nuploads\napi\nrobots.txt\nbackup\nconfig" }
        }
      }
    };
  }

  // Parse and run a command line
  async execute(input) {
    const trimmed = input.trim();
    if (!trimmed) return "";

    this.history.push(trimmed);
    this.historyIndex = this.history.length;

    // Support simple redirection: echo "hello" > file.txt
    if (trimmed.includes(' > ')) {
      const [left, filename] = trimmed.split(' > ').map(s => s.trim());
      if (left.startsWith('echo ')) {
        const text = left.slice(5).replace(/^['"]|['"]$/g, '');
        this.createOrUpdateFile(filename, text);
        return "";
      }
    }

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Notify labs for task validation
    if (this.onLabAction) {
      this.onLabAction({ cmd, args, full: trimmed });
    }

    switch (cmd) {
      case 'help':
        return `\x1b[1;32m=== CYBERLAB KALI TERMINAL V2.5 ===\x1b[0m
\x1b[1;36m[Available Security Tools]\x1b[0m
  \x1b[1;33mnmap\x1b[0m         - Network exploration & port scanning tool
  \x1b[1;33mping\x1b[0m         - Test network connectivity to target IP/host
  \x1b[1;33mwhois\x1b[0m        - Domain registrar & DNS intelligence lookup
  \x1b[1;33mcurl\x1b[0m         - Transfer data / inspect HTTP headers (-I)
  \x1b[1;33mgobuster\x1b[0m     - Brute-force web directories and files
  \x1b[1;33mnikto\x1b[0m        - Web server vulnerability scanner
  \x1b[1;33msqlmap\x1b[0m       - Automatic SQL injection detection & exploit
  \x1b[1;33mhydra\x1b[0m        - Network logon brute-force cracker (SSH/FTP)
  \x1b[1;33mjohn\x1b[0m         - John the Ripper password & hash cracker
  \x1b[1;33mhashcat\x1b[0m      - Advanced hash cracker demo
  \x1b[1;33mnc\x1b[0m           - Netcat listener / connection utility
  \x1b[1;33maircrack-ng\x1b[0m  - Wireless security auditing suite
  \x1b[1;33mifconfig\x1b[0m     - Display network interfaces and IP addresses
  \x1b[1;33mnetstat\x1b[0m      - Display active network connections & sockets

\x1b[1;36m[Essential Linux Utilities]\x1b[0m
  \x1b[32mls, cd, pwd, cat, mkdir, echo, grep, chmod, uname, whoami, clear, history, base64\x1b[0m

\x1b[1;36m[AI Mentor Assistant]\x1b[0m
  \x1b[1;35mai-explain <command>\x1b[0m  - Get instant explanation of any tool in Hindi/English!
`;

      case 'clear':
        return '__CLEAR__';

      case 'whoami':
        return "root\n";

      case 'uname':
        if (args.includes('-a')) {
          return "Linux kali 6.6.9-amd64 #1 SMP PREEMPT_DYNAMIC Kali 6.6.9-1kali1 (2026-09-26) x86_64 GNU/Linux\n";
        }
        return "Linux\n";

      case 'pwd':
        return `${this.currentPath}\n`;

      case 'ls':
        return this.handleLs(args);

      case 'cd':
        return this.handleCd(args[0] || '/root');

      case 'cat':
        return this.handleCat(args[0]);

      case 'mkdir':
        if (!args[0]) return "\x1b[31mmkdir: missing operand\x1b[0m\n";
        return `Created directory: ${args[0]}\n`;

      case 'echo':
        return `${args.join(' ')}\n`;

      case 'grep':
        return this.handleGrep(args);

      case 'chmod':
        if (args.length < 2) return "\x1b[31mchmod: missing operand\x1b[0m\n";
        return `Permissions updated: ${args[1]} -> mode ${args[0]}\n`;

      case 'history':
        return this.history.map((h, i) => `  ${i + 1}  ${h}`).join('\n') + '\n';

      case 'base64':
        return this.handleBase64(args);

      case 'ifconfig':
      case 'ip':
        return `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet \x1b[1;32m10.10.14.25\x1b[0m  netmask 255.255.255.0  broadcast 10.10.14.255
        inet6 fe80::a00:27ff:fe4e:66b1  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:4e:66:b1  txqueuelen 1000  (Ethernet)
        RX packets 24194  bytes 18274911 (17.4 MiB)
        TX packets 19820  bytes 2841920 (2.7 MiB)

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        loop  txqueuelen 1000  (Local Loopback)\n`;

      case 'netstat':
        return `Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State      
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN     
tcp        0      0 127.0.0.1:3306          0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:4444            0.0.0.0:*               LISTEN\n`;

      case 'ping':
        return this.handlePing(args);

      case 'whois':
        return this.handleWhois(args[0]);

      case 'curl':
        return this.handleCurl(args);

      case 'nmap':
        return this.handleNmap(args);

      case 'gobuster':
      case 'dirb':
        return this.handleGobuster(args);

      case 'nikto':
        return this.handleNikto(args);

      case 'sqlmap':
        return this.handleSqlmap(args);

      case 'hydra':
        return this.handleHydra(args);

      case 'john':
      case 'hashcat':
        return this.handleJohn(args);

      case 'nc':
      case 'netcat':
        return this.handleNetcat(args);

      case 'aircrack-ng':
        return this.handleAircrack(args);

      case 'theharvester':
      case 'theHarvester':
        return this.handleTheHarvester(args);

      case 'sherlock':
        return this.handleSherlock(args);

      case 'holehe':
        return this.handleHolehe(args);

      case 'tempmail':
      case 'temp-mail':
        return `\x1b[1;32m[*] Disposable Mail Engine Active\x1b[0m\nTemporary inbox generated: \x1b[1;36mrecon.operator_910@disposable-vault.io\x1b[0m\nStatus: Listening on port 25 (SMTP catch-all active)\nType 'curl https://temp-mail.org/api' or visit the 'Social Attacks' tab in the GUI to view incoming verification emails.\n`;

      case 'setoolkit':
        return `\x1b[1;34m[---] The Social-Engineer Toolkit (SET) v8.0.3 [---]\x1b[0m
[---] Open-Source Penetration Testing Framework [---]
 1) Social-Engineering Attacks
 2) Penetration Testing (Fast-Track)
 3) Third Party Modules
 4) Update the Social-Engineer Toolkit
 5) Help, Credits, and About

\x1b[1;33m[*] For safe interactive simulation, navigate to the 'Social Attacks' tab in TryKali GUI.\x1b[0m\n`;

      case 'ai-explain':
        return this.handleAIExplain(args.join(' '));

      default:
        return `\x1b[31mbash: ${cmd}: command not found. Type \x1b[1;33m'help'\x1b[0;31m to view available cybersecurity commands.\x1b[0m\n`;
    }
  }

  handleLs(args) {
    let target = this.currentPath;
    if (args.length > 0 && !args[0].startsWith('-')) {
      target = this.resolvePath(args[0]);
    }
    const node = this.getNode(target);
    if (!node || node.type !== 'dir') return `\x1b[31mls: cannot access '${target}': No such directory\x1b[0m\n`;

    const entries = Object.keys(node.content);
    if (args.includes('-la') || args.includes('-l')) {
      let output = `total ${entries.length * 4}\n`;
      output += `drwxr-xr-x 2 root root 4096 Sep 26 09:00 .\ndrwxr-xr-x 4 root root 4096 Sep 26 08:30 ..\n`;
      entries.forEach(name => {
        const item = node.content[name];
        const isDir = item.type === 'dir';
        const perm = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
        const color = isDir ? '\x1b[1;34m' : (name.endsWith('.txt') ? '\x1b[0m' : '\x1b[1;32m');
        output += `${perm} 1 root root 1024 Sep 26 09:00 ${color}${name}\x1b[0m\n`;
      });
      return output;
    }

    return entries.map(name => {
      const isDir = node.content[name].type === 'dir';
      return isDir ? `\x1b[1;34m${name}/\x1b[0m` : `\x1b[0m${name}`;
    }).join('   ') + '\n';
  }

  handleCd(path) {
    const resolved = this.resolvePath(path);
    const node = this.getNode(resolved);
    if (!node || node.type !== 'dir') {
      return `\x1b[31mbash: cd: ${path}: No such file or directory\x1b[0m\n`;
    }
    this.currentPath = resolved;
    return "";
  }

  handleCat(filename) {
    if (!filename) return "\x1b[31mcat: missing file argument\x1b[0m\n";
    const resolved = this.resolvePath(filename);
    const node = this.getNode(resolved);
    if (!node) return `\x1b[31mcat: ${filename}: No such file or directory\x1b[0m\n`;
    if (node.type === 'dir') return `\x1b[31mcat: ${filename}: Is a directory\x1b[0m\n`;
    return node.content + "\n";
  }

  createOrUpdateFile(filename, text) {
    const resolved = this.resolvePath(filename);
    const parts = resolved.split('/').filter(Boolean);
    const name = parts.pop();
    const parentPath = '/' + parts.join('/');
    const parentNode = this.getNode(parentPath);
    if (parentNode && parentNode.type === 'dir') {
      parentNode.content[name] = { type: 'file', content: text };
    }
  }

  handleGrep(args) {
    if (args.length < 2) return "\x1b[31mgrep: search pattern and file required (e.g. grep root /etc/passwd)\x1b[0m\n";
    const pattern = args[0];
    const fileContent = this.handleCat(args[1]);
    const lines = fileContent.split('\n').filter(l => l.includes(pattern));
    if (lines.length === 0) return "";
    return lines.map(l => l.replaceAll(pattern, `\x1b[1;31m${pattern}\x1b[0m`)).join('\n') + '\n';
  }

  handleBase64(args) {
    if (args.includes('-d')) {
      const text = args[args.length - 1];
      try {
        return atob(text) + "\n";
      } catch {
        return "base64: invalid input\n";
      }
    }
    const text = args.join(' ');
    return btoa(text) + "\n";
  }

  handlePing(args) {
    const target = args[0] || '10.10.10.45';
    return `PING ${target} (${target}) 56(84) bytes of data.
64 bytes from ${target}: icmp_seq=1 ttl=64 time=18.4 ms
64 bytes from ${target}: icmp_seq=2 ttl=64 time=16.8 ms
64 bytes from ${target}: icmp_seq=3 ttl=64 time=17.2 ms
64 bytes from ${target}: icmp_seq=4 ttl=64 time=19.1 ms

--- ${target} ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 16.812/17.882/19.102/0.890 ms\n`;
  }

  handleWhois(domain) {
    if (!domain) return "\x1b[31mwhois: domain name required (e.g. whois google.com)\x1b[0m\n";
    return `   Domain Name: ${domain.toUpperCase()}
   Registry Domain ID: 2138514_DOMAIN_COM-VRSN
   Registrar WHOIS Server: whois.markmonitor.com
   Registrar: MarkMonitor Inc.
   Updated Date: 2026-01-15T09:44:22Z
   Creation Date: 1997-09-15T04:00:00Z
   Registry Expiry Date: 2028-09-14T04:00:00Z
   Name Server: NS1.${domain.toUpperCase()}
   Name Server: NS2.${domain.toUpperCase()}
   Status: clientDeleteProhibited
\x1b[1;32m[+] Domain Reconnaissance Complete.\x1b[0m\n`;
  }

  handleCurl(args) {
    const isHeadersOnly = args.includes('-I') || args.includes('-i');
    const url = args.find(a => !a.startsWith('-')) || 'http://10.10.10.45';
    if (isHeadersOnly) {
      return `HTTP/1.1 200 OK
Date: Sat, 26 Sep 2026 09:00:00 GMT
Server: Apache/2.4.52 (Ubuntu)
X-Powered-By: PHP/8.1.2
Set-Cookie: PHPSESSID=da98b76c8e312a0f; path=/; HttpOnly
Content-Type: text/html; charset=UTF-8
Content-Length: 1240
Connection: keep-alive\n`;
    }
    return `<!DOCTYPE html>
<html>
<head><title>Internal Portal - 10.10.10.45</title></head>
<body>
  <h1>Secure Employee Dashboard</h1>
  <p>Notice: Unauthorized penetration testing is prohibited.</p>
  <!-- TODO: Remove debug API endpoint /api/v1/secret_backup -->
</body>
</html>\n`;
  }

  handleNmap(args) {
    const target = args.find(a => !a.startsWith('-')) || '10.10.10.45';
    const isAggressive = args.includes('-A') || args.includes('-sV');
    
    let res = `Starting Nmap 7.94 ( https://nmap.org ) at 2026-09-26 09:00 UTC
Nmap scan report for ${target}
Host is up (0.018s latency).
Not shown: 997 closed tcp ports (reset)
PORT     STATE SERVICE     VERSION
\x1b[1;32m22/tcp   open  ssh         OpenSSH 8.9p1 Ubuntu 3ubuntu0.4\x1b[0m
\x1b[1;32m80/tcp   open  http        Apache httpd 2.4.52 ((Ubuntu))\x1b[0m
\x1b[1;32m3306/tcp open  mysql       MySQL 8.0.35-0ubuntu0.22.04.1\x1b[0m
`;

    if (isAggressive) {
      res += `
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
MAC Address: 08:00:27:E1:92:4B (Oracle VirtualBox)
OS details: Linux 5.4 - 5.15
Aggressive OS guesses: Linux 5.4 (98%), Ubuntu 22.04 LTS (96%)

\x1b[1;33m[!] Vulnerability Note: Port 80 Apache has exposed endpoint: /admin/\x1b[0m
`;
    }

    res += `\nNmap done: 1 IP address (1 host up) scanned in 4.32 seconds\n`;
    return res;
  }

  handleGobuster(args) {
    return `===============================================================
Gobuster v3.6 - Directory Brute-Forcing Mode
===============================================================
[+] Url:                     http://10.10.10.45/
[+] Wordlist:                /usr/share/wordlists/common-dirs.txt
[+] Negative Status codes:   404
[+] Timeout:                 10s
===============================================================
Starting gobuster...
===============================================================
/admin                (Status: 301) [Size: 312] [--> http://10.10.10.45/admin/]
/login                (Status: 200) [Size: 2450]
/robots.txt           (Status: 200) [Size: 84]
/uploads              (Status: 403) [Size: 277]
/api                  (Status: 200) [Size: 180]
===============================================================
Finished in 1.48s. Found 5 directories.
\x1b[1;32m[+] Hint: Check /admin/ and /robots.txt for sensitive endpoints!\x1b[0m\n`;
  }

  handleNikto(args) {
    return `- Nikto v2.5.0
---------------------------------------------------------------------------
+ Target IP:          10.10.10.45
+ Target Hostname:    target.lab
+ Target Port:        80
---------------------------------------------------------------------------
+ Server: Apache/2.4.52 (Ubuntu)
+ /: The anti-clickjacking X-Frame-Options header is not present.
+ /: The X-Content-Type-Options header is not set.
+ /admin/: Admin directory found with directory indexing enabled.
+ /robots.txt: Entry '/api/v1/secret_backup' reveals sensitive testing path.
+ 8048 requests: 0 error(s) and 4 item(s) reported on remote host\n`;
  }

  handleSqlmap(args) {
    const target = args.find(a => a.startsWith('http')) || 'http://10.10.10.45/login?user=admin';
    return `    ___
   __H__
 ___ ___[']_____ ___ ___  {1.7.12#stable}
|_ -| . [']     | .'| . |
|___|_  ["]_|_|_|__,|  _| http://sqlmap.org
      |_|           |_|

[*] testing connection to the target URL: ${target}
[*] checking if the target is protected by some WAF/IPS
[+] testing if GET parameter 'user' is dynamic
[+] confirming parameter 'user' is injectable via Boolean-based blind
\x1b[1;32m[+] Parameter: user (GET)\x1b[0m
    \x1b[1;33mType: boolean-based blind\x1b[0m
    \x1b[1;33mTitle: AND boolean-based blind - WHERE or HAVING clause\x1b[0m
    \x1b[1;33mPayload: user=admin' AND 3421=3421 AND 'Wxyz'='Wxyz\x1b[0m

\x1b[1;32m[INFO] the back-end DBMS is MySQL\x1b[0m
web server operating system: Linux Ubuntu 22.04
web application technology: Apache 2.4.52, PHP 8.1.2
back-end DBMS: MySQL >= 8.0.0
\x1b[1;32m[+] Target is VULNERABLE to SQL Injection!\x1b[0m\n`;
  }

  handleHydra(args) {
    return `Hydra v9.5 (c) 2026 by van Hauser / THC & David Maciejak - Please do not use in military/secret systems!
Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2026-09-26 09:00:15
[DATA] max 16 tasks per target, 1 target, 1 login, 8 passwords
[ATTEMPT] target 10.10.10.45 - login "admin" - pass "123456" - 1 of 8 [child 0]
[ATTEMPT] target 10.10.10.45 - login "admin" - pass "password" - 2 of 8 [child 1]
\x1b[1;32m[22][ssh] host: 10.10.10.45   login: admin   password: admin123\x1b[0m
1 of 1 target successfully completed, 1 valid password found\n`;
  }

  handleJohn(args) {
    return `Loaded 1 password hash (md5crypt, crypt(3) $1$ [MD5 128/128 AVX 4x3])
Will run 4 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
\x1b[1;32madmin123         (admin)\x1b[0m     
1g 0:00:00:01 DONE (2026-09-26 09:00) 0.8196g/s 40960p/s 40960c/s 40960C/s 123456..cybersec2026
Use the "--show" option to display all of the cracked passwords reliably
Session completed. 1 password cracked in 1.22 seconds.\n`;
  }

  handleNetcat(args) {
    if (args.includes('-lvnp') || args.includes('-l')) {
      const port = args[args.indexOf('-lvnp') + 1] || '4444';
      return `listening on [any] ${port} ...
\x1b[1;32m[+] Connection received from 10.10.10.45 49152!\x1b[0m
bash: cannot set terminal process group (-1): Inappropriate ioctl for device
bash: no job control in this shell
\x1b[1;36mroot@target-server:/# whoami\x1b[0m
root
\x1b[1;32m[+] Interactive Reverse Shell Established!\x1b[0m\n`;
    }
    return `Connection to 10.10.10.45 80 port [tcp/http] succeeded!\n`;
  }

  handleAircrack(args) {
    return `                                 Aircrack-ng 1.7 

                   [00:00:02] 1/1 keys tested (742.18 k/s)

                           KEY FOUND! [ cybersec2026 ]

      Master Key     : 8D 5A 7F 2B 41 89 E2 C0 9A 14 3F 99 22 17 AA 44 
      Transient Key  : 09 81 BC 55 12 D8 FA 99 31 7E AA 10 9B 42 E1 09 
      EAPOL HMAC     : 22 4B 8A C1 7E 90 2D A8 13 88 B0 11 9F 33 21 00\n`;
  }

  handleAIExplain(query) {
    if (!query) {
      return `\x1b[1;35m[AI Cyber Mentor]:\x1b[0m Please specify a command to explain. Example: \x1b[1;33mai-explain nmap -sV\x1b[0m\n`;
    }

    if (query.includes('nmap')) {
      return `\x1b[1;35m[AI Cyber Mentor Explanation]:\x1b[0m
\x1b[1;32mTool: Nmap (Network Mapper)\x1b[0m
- \x1b[33mPrimary Purpose:\x1b[0m Active host discovery, port scanning, and network attack surface mapping.
- \x1b[33mFlag -sV:\x1b[0m Service Version detection. Probes open ports to determine exact application versions.
- \x1b[33mReal-World Context:\x1b[0m Phase 1 of penetration testing (Reconnaissance) to identify vulnerable service releases.\n`;
    }

    if (query.includes('hydra')) {
      return `\x1b[1;35m[AI Cyber Mentor Explanation]:\x1b[0m
\x1b[1;32mTool: THC-Hydra\x1b[0m
- \x1b[33mPrimary Purpose:\x1b[0m High-speed network logon cracker supporting SSH, FTP, HTTP forms, and Telnet.
- \x1b[33mDefensive Mitigation:\x1b[0m Enforce rate limiting, deploy Fail2ban, disable password authentication, and use SSH keys.\n`;
    }

    if (query.includes('sqlmap')) {
      return `\x1b[1;35m[AI Cyber Mentor Explanation]:\x1b[0m
\x1b[1;32mTool: SQLmap\x1b[0m
- \x1b[33mPrimary Purpose:\x1b[0m Automated detection and exploitation of SQL Injection vulnerabilities.
- \x1b[33mDefensive Mitigation:\x1b[0m Enforce Parameterized Queries (Prepared Statements) and least-privilege DB roles.\n`;
    }

    return `\x1b[1;35m[AI Cyber Mentor Explanation]:\x1b[0m
\x1b[32mCommand: '${query}'\x1b[0m
This utility is used in cybersecurity for reconnaissance, auditing, or system administration.
Tip: Open the \x1b[1;33m'AI Mentor'\x1b[0m tab to discuss penetration testing strategies and countermeasures in depth!\n`;
  }

  handleTheHarvester(args) {
    const domain = args.find(a => !a.startsWith('-') && a.includes('.')) || 'targetcorp.com';
    return `\x1b[1;34m*******************************************************************\x1b[0m
\x1b[1;32m* theHarvester 4.4.0 - E-mail & Subdomain Gathering Suite         *\x1b[0m
\x1b[1;34m*******************************************************************\x1b[0m
[*] Target domain: \x1b[1;36m${domain}\x1b[0m
[*] Searching sources: Google, Bing, LinkedIn, Yahoo, Baidu...

\x1b[1;33m[*] Target Emails Discovered (6):\x1b[0m
  -------------------------------------------------------------
  admin@${domain}
  it-support@${domain}
  alex.morgan@${domain}
  devops-alerts@${domain}
  recruiting@${domain}
  ceo-office@${domain}

\x1b[1;33m[*] Target Subdomains Discovered (4):\x1b[0m
  -------------------------------------------------------------
  vpn.${domain} (203.0.113.15)
  mail.${domain} (203.0.113.20)
  portal.${domain} (203.0.113.45)
  dev-api.${domain} (203.0.113.88)

\x1b[1;32m[+] Recon scan completed. Total hosts: 4, Total emails: 6\x1b[0m\n`;
  }

  handleSherlock(args) {
    const username = args.find(a => !a.startsWith('-')) || 'target_dev';
    return `\x1b[1;35m[*] Sherlock v0.14.3 - Hunting Social Accounts for [@${username}]\x1b[0m
[*] Querying 420+ public social networks and identity graphs...

\x1b[1;32m[+] GitHub:\x1b[0m https://github.com/${username}
\x1b[1;32m[+] Twitter / X:\x1b[0m https://twitter.com/${username}
\x1b[1;32m[+] Instagram:\x1b[0m https://instagram.com/${username}
\x1b[1;32m[+] Reddit:\x1b[0m https://www.reddit.com/user/${username}
\x1b[1;32m[+] DockerHub:\x1b[0m https://hub.docker.com/u/${username}
\x1b[1;32m[+] HackerOne:\x1b[0m https://hackerone.com/${username}

\x1b[1;33m[*] Search finished. 6 verified account matches located for [@${username}].\x1b[0m\n`;
  }

  handleHolehe(args) {
    const email = args.find(a => a.includes('@')) || 'target@corp.com';
    return `\x1b[1;36m[+] Holehe 2.0.1 - Email Registration Reconnaissance\x1b[0m
[*] Target Email: \x1b[1;32m${email}\x1b[0m
[*] Testing registered services via password reset & account exist heuristics...

  \x1b[1;32m[+] Twitter / X:\x1b[0m Account Exists (Registered)
  \x1b[1;32m[+] Google Account:\x1b[0m Account Exists (Profile Picture Linked)
  \x1b[1;32m[+] Microsoft Live:\x1b[0m Account Exists
  \x1b[1;32m[+] GitHub:\x1b[0m Account Exists
  \x1b[1;31m[-] Spotify:\x1b[0m Not Registered
  \x1b[1;31m[-] Discord:\x1b[0m Not Registered
  \x1b[1;32m[+] LinkedIn:\x1b[0m Account Exists

\x1b[1;33m[!] 5 out of 7 public services confirmed active for ${email}.\x1b[0m\n`;
  }

  // Resolve virtual filesystem paths
  resolvePath(path) {
    if (!path || path === '.') return this.currentPath;
    if (path === '..') {
      const parts = this.currentPath.split('/').filter(Boolean);
      parts.pop();
      return '/' + parts.join('/');
    }
    if (path.startsWith('/')) return path;
    if (this.currentPath === '/') return '/' + path;
    return `${this.currentPath}/${path}`;
  }

  getNode(path) {
    if (path === '/') return { type: 'dir', content: this.fs };
    const parts = path.split('/').filter(Boolean);
    let curr = this.fs;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (curr['/' + parts.slice(0, i + 1).join('/')]) {
        curr = curr['/' + parts.slice(0, i + 1).join('/')];
      } else if (curr.content && curr.content[p]) {
        curr = curr.content[p];
      } else {
        return null;
      }
    }
    return curr;
  }
}
