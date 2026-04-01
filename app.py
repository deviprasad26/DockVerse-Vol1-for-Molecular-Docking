from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Allow requests from your GitHub Pages site

DB = 'dockverse.db'

# ── Admin password (change this to something only you know) ──
ADMIN_PASSWORD = "dockverse2024"

# ── Initialize database ──
def init_db():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS visits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            drug_searched TEXT,
            protein_searched TEXT,
            device TEXT,
            browser TEXT,
            os TEXT,
            ip TEXT,
            country TEXT,
            page_section TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# ── Track visit endpoint ──
@app.route('/track', methods=['POST'])
def track():
    data = request.get_json()
    ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    if ip and ',' in ip:
        ip = ip.split(',')[0].strip()

    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute('''
        INSERT INTO visits (timestamp, drug_searched, protein_searched, device, browser, os, ip, country, page_section)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        data.get('drug', '—'),
        data.get('protein', '—'),
        data.get('device', '—'),
        data.get('browser', '—'),
        data.get('os', '—'),
        ip,
        data.get('country', '—'),
        data.get('section', '—')
    ))
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok'})

# ── Admin dashboard ──
ADMIN_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DockVerse Admin</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a1a; color: #e0e0e0; font-family: 'Segoe UI', sans-serif; min-height: 100vh; }
  .header { background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 24px 32px; border-bottom: 1px solid #00e5ff33; display: flex; align-items: center; justify-content: space-between; }
  .header h1 { font-size: 1.6rem; color: #00e5ff; letter-spacing: 2px; }
  .header span { color: #7c3aed; font-size: 0.85rem; }
  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; padding: 24px 32px; }
  .stat { background: #1a1a2e; border: 1px solid #00e5ff22; border-radius: 12px; padding: 20px; text-align: center; }
  .stat .num { font-size: 2.2rem; font-weight: 700; color: #00e5ff; }
  .stat .label { font-size: 0.8rem; color: #888; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }
  .section { padding: 0 32px 32px; }
  .section h2 { font-size: 1rem; color: #7c3aed; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; }
  table { width: 100%; border-collapse: collapse; background: #1a1a2e; border-radius: 12px; overflow: hidden; font-size: 0.82rem; }
  th { background: #16213e; padding: 10px 14px; text-align: left; color: #00e5ff; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  td { padding: 10px 14px; border-bottom: 1px solid #ffffff08; }
  tr:hover td { background: #ffffff05; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 0.75rem; }
  .badge-drug { background: #7c3aed22; color: #a78bfa; border: 1px solid #7c3aed44; }
  .badge-protein { background: #10b98122; color: #34d399; border: 1px solid #10b98144; }
  .login { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
  .login-box { background: #1a1a2e; border: 1px solid #00e5ff33; border-radius: 16px; padding: 40px; width: 320px; text-align: center; }
  .login-box h2 { color: #00e5ff; margin-bottom: 24px; }
  .login-box input { width: 100%; padding: 12px 16px; background: #0a0a1a; border: 1px solid #00e5ff33; border-radius: 8px; color: #e0e0e0; font-size: 1rem; margin-bottom: 16px; outline: none; }
  .login-box button { width: 100%; padding: 12px; background: linear-gradient(135deg, #00e5ff, #7c3aed); border: none; border-radius: 8px; color: #fff; font-size: 1rem; font-weight: 600; cursor: pointer; }
  .err { color: #f87171; font-size: 0.85rem; margin-top: 8px; }
  .empty { text-align: center; padding: 40px; color: #555; }
</style>
</head>
<body>
{% if not authed %}
<div class="login">
  <div class="login-box">
    <h2>🔬 DockVerse Admin</h2>
    <form method="POST">
      <input type="password" name="pwd" placeholder="Enter admin password" autofocus>
      <button type="submit">Login</button>
      {% if error %}<p class="err">Wrong password</p>{% endif %}
    </form>
  </div>
</div>
{% else %}
<div class="header">
  <h1>🔬 DockVerse Analytics</h1>
  <span>Private Admin Dashboard</span>
</div>

<div class="stats">
  <div class="stat"><div class="num">{{ total }}</div><div class="label">Total Visits</div></div>
  <div class="stat"><div class="num">{{ unique_drugs }}</div><div class="label">Drugs Searched</div></div>
  <div class="stat"><div class="num">{{ unique_proteins }}</div><div class="label">Proteins Searched</div></div>
  <div class="stat"><div class="num">{{ today }}</div><div class="label">Today</div></div>
</div>

<div class="section">
  <h2>Recent Activity (Last 100)</h2>
  {% if rows %}
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Time</th>
        <th>Drug Searched</th>
        <th>Protein Searched</th>
        <th>Device</th>
        <th>Browser</th>
        <th>OS</th>
        <th>IP</th>
        <th>Section</th>
      </tr>
    </thead>
    <tbody>
      {% for r in rows %}
      <tr>
        <td>{{ r[0] }}</td>
        <td>{{ r[1] }}</td>
        <td><span class="badge badge-drug">{{ r[2] }}</span></td>
        <td><span class="badge badge-protein">{{ r[3] }}</span></td>
        <td>{{ r[4] }}</td>
        <td>{{ r[5] }}</td>
        <td>{{ r[6] }}</td>
        <td>{{ r[7] }}</td>
        <td>{{ r[8] }}</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
  {% else %}
  <div class="empty">No visits recorded yet. Share your DockVerse link to start tracking!</div>
  {% endif %}
</div>
{% endif %}
</body>
</html>
"""

@app.route('/admin', methods=['GET', 'POST'])
def admin():
    authed = False
    error = False
    rows = []
    total = unique_drugs = unique_proteins = today = 0

    if request.method == 'POST':
        if request.form.get('pwd') == ADMIN_PASSWORD:
            authed = True
        else:
            error = True

    # Check session via query param as simple workaround for Render free tier
    if request.args.get('key') == ADMIN_PASSWORD:
        authed = True

    if authed:
        conn = sqlite3.connect(DB)
        c = conn.cursor()
        c.execute("SELECT COUNT(*) FROM visits")
        total = c.fetchone()[0]
        c.execute("SELECT COUNT(DISTINCT drug_searched) FROM visits WHERE drug_searched != '—'")
        unique_drugs = c.fetchone()[0]
        c.execute("SELECT COUNT(DISTINCT protein_searched) FROM visits WHERE protein_searched != '—'")
        unique_proteins = c.fetchone()[0]
        today_date = datetime.now().strftime('%Y-%m-%d')
        c.execute("SELECT COUNT(*) FROM visits WHERE timestamp LIKE ?", (today_date + '%',))
        today = c.fetchone()[0]
        c.execute("SELECT id, timestamp, drug_searched, protein_searched, device, browser, os, ip, page_section FROM visits ORDER BY id DESC LIMIT 100")
        rows = c.fetchall()
        conn.close()

    return render_template_string(ADMIN_HTML, authed=authed, error=error,
                                   rows=rows, total=total,
                                   unique_drugs=unique_drugs,
                                   unique_proteins=unique_proteins,
                                   today=today)

@app.route('/')
def index():
    return jsonify({'status': 'DockVerse backend running ✅'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
