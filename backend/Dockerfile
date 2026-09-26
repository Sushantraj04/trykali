FROM kalilinux/kali-rolling:slim

# Update and install essential student pentesting tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    nmap \
    iputils-ping \
    curl \
    whois \
    dnsutils \
    net-tools \
    nano \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Setup student workspace and sample lab files
WORKDIR /root
RUN echo "Target scope: 10.10.10.45" > /root/notes.txt
RUN echo "FLAG{kali_cloud_docker_master_2026}" > /root/flag.txt

CMD ["/bin/bash"]
