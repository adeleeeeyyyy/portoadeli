import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';

// Initialize SQLite database
const db = new DatabaseSync('visits.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS visits (
    date TEXT PRIMARY KEY,
    count INTEGER DEFAULT 0
  );
  
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Prepared Statements
const insertOrIncrement = db.prepare(`
  INSERT INTO visits (date, count) VALUES (?, 1)
  ON CONFLICT(date) DO UPDATE SET count = count + 1
`);

const getVisitsForDate = db.prepare(`
  SELECT count FROM visits WHERE date = ?
`);

const getGrandTotal = db.prepare(`
  SELECT SUM(count) as total FROM visits
`);

const insertContact = db.prepare(`
  INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)
`);

const getContacts = db.prepare(`
  SELECT id, name, email, subject, message, timestamp FROM contacts ORDER BY id DESC
`);

// Helper to get local date string YYYY-MM-DD
function getLocalDateString(offsetDays = 0) {
  const date = new Date();
  if (offsetDays !== 0) {
    date.setDate(date.getDate() + offsetDays);
  }
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime( ) - tzOffset).toISOString().slice(0, 10);
}

// Helper to get last 7 days visits data
function getLast7DaysData() {
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const dateStr = getLocalDateString(-i);
    const row = getVisitsForDate.get(dateStr);
    const count = row ? row.count : 0;
    
    // Format label as "Mon", "Tue", etc.
    const dateObj = new Date(dateStr);
    const dayLabel = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    
    result.push({
      date: dateStr,
      label: dayLabel,
      count: count
    });
  }
  return result;
}

const server = createServer((req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || '', `http://${req.headers.host}`);

  if (url.pathname === '/api/visit' && req.method === 'POST') {
    try {
      const todayStr = getLocalDateString();
      insertOrIncrement.run(todayStr);
      
      const data = getLast7DaysData();
      const totalRow = getGrandTotal.get();
      const totalVisits = totalRow ? (totalRow.total || 0) : 0;
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, totalVisits, data }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  } else if (url.pathname === '/api/visits' && req.method === 'GET') {
    try {
      const data = getLast7DaysData();
      const totalRow = getGrandTotal.get();
      const totalVisits = totalRow ? (totalRow.total || 0) : 0;
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, totalVisits, data }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  } else if (url.pathname === '/api/contact' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { name, email, subject, message } = payload;
        
        if (!name || !email || !message) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Name, email, and message are required' }));
          return;
        }

        insertContact.run(name, email, subject || '', message);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Message sent successfully!' }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else if (url.pathname === '/api/contacts' && req.method === 'GET') {
    const secret = url.searchParams.get('secret');
    const EXPECTED_SECRET = 'adlyadmin2026';

    if (secret !== EXPECTED_SECRET) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }

    try {
      const rows = getContacts.all();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, contacts: rows }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

const PORT = 3005;
server.listen(PORT, () => {
  console.log(`🚀 Visited SQLite Server running on http://localhost:${PORT}`);
});
