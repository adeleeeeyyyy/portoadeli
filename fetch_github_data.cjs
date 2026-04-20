const fs = require('fs');
const https = require('https');
const path = require('path');

const USERNAME = 'adeleeeeyyyy';
const OUT_FILE = path.join(__dirname, 'github_data.json');

const fetchJSON = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'NodeJS-Static-Generator' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(data));
          } else {
            console.error(`Status ${res.statusCode} from ${url}`);
            resolve(null);
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
};

(async () => {
  console.log(`Fetching data for ${USERNAME}...`);
  try {
    const profileUrl = `https://api.github.com/users/${USERNAME}`;
    const reposUrl = `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=pushed`;
    const eventsUrl = `https://api.github.com/users/${USERNAME}/events/public?per_page=15`;

    const [profile, repos, events] = await Promise.all([
      fetchJSON(profileUrl),
      fetchJSON(reposUrl),
      fetchJSON(eventsUrl)
    ]);

    if (!profile) {
      console.error('Failed to fetch profile details.');
      process.exit(1);
    }

    let organization = null;
    if (profile.company) {
      const orgName = profile.company.replace('@', '').trim();
      console.log(`Fetching organization data for ${orgName}...`);
      organization = await fetchJSON(`https://api.github.com/orgs/${orgName}`);
    }

    const outputData = {
      timestamp: new Date().toISOString(),
      profile: profile,
      repos: repos || [],
      events: events || [],
      organization: organization
    };

    fs.writeFileSync(OUT_FILE, JSON.stringify(outputData, null, 2));
    console.log(`✅ Successfully saved GitHub data to ${OUT_FILE}`);
  } catch (err) {
    console.error('Error fetching data:', err);
    process.exit(1);
  }
})();
