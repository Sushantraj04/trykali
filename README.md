# 🛡️ TryKali — Interactive Cybersecurity Labs & Terminal Platform

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-00ff88?style=for-the-badge)](#)

> **TryKali (CyberKali Pro Labs)** is a next-generation cybersecurity sandbox and interactive penetration testing training platform. Practice real Kali Linux terminal commands, solve guided CTF rooms, audit systems, run OSINT recon, and level up your hacking skills in-browser.

---

## ✨ Features & Architecture

### 💻 1. Interactive Cyber Lab Terminal
- **In-Browser Sandbox & Cloud Docker:** Execute real commands (`nmap`, `gobuster`, `hydra`, `sqlmap`, `john`, `nikto`, `curl`, `cat /etc/passwd`).
- **macOS / Linux Window Controls:**
  - 🟢 **Maximize / Fullscreen Mode:** Expand the terminal to fullscreen for distraction-free hacking (with `ESC` restore support).
  - 🟡 **Minimize:** Collapse the terminal into a compact background dock strip.
  - 🔴 **Close / Restart:** Safely disconnect or reset to a fresh clean shell session.
- **Smart Auto-Resume:** Running commands from the tool catalog automatically un-minimizes and executes.

### 🌐 2. 600+ Kali Tools Catalog
- Comprehensive security arsenal organized across Information Gathering, Vulnerability Analysis, Web Exploitation, Password Attacks, and Reverse Engineering.
- **1-Click Execution:** Inject commands directly into the terminal with automatic syntax hints.

### 🕵️ 3. Social Attacks & OSINT Intelligence
- Dedicated OSINT module featuring simulated Instagram profile inspection (**AnonyIG**), tracking link generation, and social phishing awareness training.

### 📂 4. Wordlist Vault
- Integrated dictionary and payload library containing RockYou samples, common directory lists, and credential fuzzing datasets.

### 🏆 5. Gamified XP & Progression System
- Earn +50 XP per solved objective.
- Dynamic rank tiers: **Novice Hacker** → **Junior Pentester** → **Security Specialist** → **Red Team Elite**.
- Operator badge showcase (Port Sweeper, Endpoint Ghost, Flag Hunter, Privilege Auditor).

### 🤖 6. AI Cyber Mentor
- Context-aware cyber mentor that analyzes live terminal output and provides instant explanations, remediation advice, and exploitation methodology.

### 📊 7. Admin CRM Panel
- Secret administrative route (`/admin`) for tracking student registrations, active sessions, and multi-month dormancy cohorts with CSV export.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Sushantraj04/trykali.git

# 2. Navigate to project directory
cd trykali

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or the port displayed in your terminal).

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite
- **Styling:** Tailwind CSS, Space Grotesk, JetBrains Mono, Plus Jakarta Sans
- **Icons:** Lucide React
- **Terminal Engine:** Custom Virtual Shell Simulator with ANSI color parsing and Command History
- **Auth / Database:** Supabase Client & Local Mock Auth Engine

---

## 🔒 Security & Educational Use Notice
This platform is built exclusively for authorized ethical hacking education, CTF competitions, and defensive security training. All simulated targets (`10.10.10.45`) are virtualized safe environments.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
