export const site = {
  name: 'Adly Fahreza',
  handle: 'adly-fahreza',
  role: 'Linux Systems Administrator',
  hostname: 'adly-fahreza@homelab',
  email: 'adeli@synchronizeteams.com',
  location: 'Jakarta, ID · UTC+7',
  tagline: 'I keep servers boring so your day never has to be.',
  intro:
    'Three years bridging bare-metal hardware and scalable cloud architectures in Linux environments.',
  about:
    'I specialize in the full infrastructure lifecycle—from setting up and maintaining physical servers to orchestrating over 100 nodes. Certified in MikroTik (MTCNA & MTCRE), I focus on building robust, well-routed systems that scale quietly and efficiently.',
  pgp: '4F2A 91C3 7B0D 88E1 55A0  6C74 0D9F 3B21 7E4C',
  socials: [
    { label: 'GitHub', url: 'https://github.com/adeleeeeyyyy', icon: 'github' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/adly-fahreza', icon: 'linkedin' },
    { label: 'Email', url: 'mailto:adeli@synchronizeteams.com', icon: 'mail' },
  ],
};

export const experience = [
  {
    period: '2026 — present',
    role: 'System Administrator',
    org: 'ID-Networkers',
    summary: [
      'Installing, setting up, and managing Dell R620 servers.',
      'Maintenance & management of Dell R670, R640, and R630 servers.',
      'Maintenance & management of HP ProLiant DL360p Gen8 and Fujitsu PRIMERGY RX4770 M1.',
    ],
  },
  {
    period: '2026 — present',
    role: 'Trainer · Linux & Windows Server Administration',
    org: 'ID-Networkers',
    summary: [
      'Training and mentoring staff on Linux system administration.',
      'Training and mentoring staff on Windows Server administration.',
    ],
  },
  {
    period: '2023 — present',
    role: 'System Administrator',
    org: 'SynchronizeTeams',
    summary: [
      'Assembled and set up Dell R630 servers from bare metal.',
      'Managing VPS bare-metal deployments.',
      'Building and maintaining cloud infrastructure.',
    ],
  },
  {
    period: '2023 — 2026',
    role: 'System Administrator',
    org: 'Devaccto RPL',
    summary: [
      'Setup & management of Dell R610 e01s servers.',
      'Setup & management of VPS bare-metal deployments.',
    ],
  },
  {
    period: '2023 — 2026',
    role: 'Trainer · Web Development & CyberSecurity',
    org: 'Devaccto RPL',
    summary: [
      'Training students in web development.',
      'Training students in cybersecurity fundamentals.',
    ],
  },
];

export const stack = [
  {
    group: 'Linux & core',
    items: ['Debian', 'RHEL family', 'systemd', 'bash / POSIX sh', 'LVM & ZFS'],
  },
  {
    group: 'Automation',
    items: ['Puppet', 'Ansible', 'Terraform', 'Packer', 'GitLab CI'],
  },
  {
    group: 'Observability',
    items: ['Prometheus', 'Zabbix', 'Grafana', 'Alertmanager', 'Loki'],
  },
  {
    group: 'Networking & security',
    items: ['iptables / nftables', 'WireGuard', 'BGP basics', 'SELinux', 'Vault'],
  },
];

export const projects = [
  {
    name: 'Dell R620',
    desc: experience[0].summary[0],
    tech: ['ID-Networkers'],
  },
  {
    name: 'Dell R630',
    desc: experience[2].summary.join(' '),
    tech: ['SynchronizeTeams'],
  },
  {
    name: 'Dell R640',
    desc: 'Maintenance & management of Dell R640 servers.',
    tech: ['ID-Networkers'],
  },
  {
    name: 'Dell R670',
    desc: 'Maintenance & management of Dell R670 servers.',
    tech: ['ID-Networkers'],
  },
  {
    name: 'HP ProLiant DL360p Gen8',
    desc: 'Maintenance & management of HP ProLiant DL360p Gen8 servers.',
    tech: ['ID-Networkers'],
  },
  {
    name: 'Fujitsu PRIMERGY RX4770 M1',
    desc: 'Maintenance & management of Fujitsu PRIMERGY RX4770 M1 servers.',
    tech: ['ID-Networkers'],
  },
  {
    name: 'Dell R610 e01s',
    desc: experience[3].summary.join(' '),
    tech: ['Devaccto RPL'],
  },
];
