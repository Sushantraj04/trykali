// Production Cloud Terminal Bridge Server (Node.js + WebSockets + Docker)
// This server dynamically spawns isolated Kali Linux containers for each user session

const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const Docker = require('dockerode');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const docker = new Docker(); // connects to local /var/run/docker.sock or TCP

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Kali Terminal Orchestrator' });
});

// WebSocket Connection handler
wss.on('connection', async (ws, req) => {
  console.log('[+] Client connected for live Kali session');

  try {
    // 1. Create an isolated Kali container with resource limits
    const container = await docker.createContainer({
      Image: 'kalilinux/kali-rolling:slim', // or custom image
      Cmd: ['/bin/bash'],
      Tty: true,
      OpenStdin: true,
      StdinOnce: false,
      HostConfig: {
        Memory: 512 * 1024 * 1024,      // 512MB RAM cap
        NanoCpus: 1000000000,            // Max 1 CPU core
        NetworkMode: 'cyberlab_internal', // Isolated internal network
        AutoRemove: true                 // Destroy container on exit
      }
    });

    await container.start();
    console.log(`[+] Started container: ${container.id.slice(0, 12)}`);

    // 2. Attach interactive stream
    const stream = await container.attach({
      stream: true,
      stdin: true,
      stdout: true,
      stderr: true
    });

    // 3. Pipe container output to WebSocket
    stream.on('data', (chunk) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(chunk.toString('utf-8'));
      }
    });

    // 4. Pipe WebSocket user input to container
    ws.on('message', (msg) => {
      stream.write(msg);
    });

    // 5. Cleanup on disconnect
    ws.on('close', async () => {
      console.log(`[-] Client disconnected. Stopping container ${container.id.slice(0, 12)}`);
      try {
        await container.stop();
      } catch (err) {
        console.error('Container stop error:', err.message);
      }
    });

  } catch (error) {
    console.error('Failed to spawn lab container:', error);
    ws.send(`\r\n\x1b[31m[Error]: Cloud container allocation failed: ${error.message}\x1b[0m\r\n`);
    ws.close();
  }
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`[+] CyberLab WebSocket Gateway listening on port ${PORT}`);
});
