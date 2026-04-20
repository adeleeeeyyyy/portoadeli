import re
import datetime

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

tabs = [
    {
        'id': 'showcase',
        'script': 'showcase.sh',
        'header': 'Showcase pinned repositories loaded.'
    },
    {
        'id': 'repos',
        'script': 'list_repos.sh',
        'header': 'All public repositories loaded.'
    },
    {
        'id': 'achievements',
        'script': 'achievements.sh',
        'header': 'Achievements system initialized.'
    },
    {
        'id': 'activity',
        'script': 'activity.sh',
        'header': 'Recent public events fetched.'
    },
    {
        'id': 'skills',
        'script': 'skills.sh',
        'header': 'Tech stack and proficiencies mapped.'
    }
]

def generate_term(tab_id, script, header, inner):
    return f'''
          <div id="{tab_id}-run-wrap" style="width:100%; margin: 2rem 0; border: 1px solid var(--border); border-radius:10px; overflow:hidden; background:#ffffff; color:var(--ink); font-family:'Space Mono', Courier, monospace; text-align:left; box-shadow:var(--shadow-sm); transition:transform 0.2s ease;">
            <!-- Terminal Header -->
            <div style="background:#f8fafc; border-bottom:1px solid var(--border); padding:10px 16px; display:flex; justify-content:space-between; align-items:center;">
              <div style="display:flex; gap:8px;">
                <div style="width:12px; height:12px; border-radius:50%; background:#e2e8f0; border:1px solid #cbd5e1;"></div>
                <div style="width:12px; height:12px; border-radius:50%; background:#e2e8f0; border:1px solid #cbd5e1;"></div>
                <div style="width:12px; height:12px; border-radius:50%; background:#e2e8f0; border:1px solid #cbd5e1;"></div>
              </div>
              <button onclick="startTerminal('{tab_id}')" style="background:var(--ink); color:var(--bg); border:none; border-radius:8px; padding:6px 16px; font-family:'Outfit', sans-serif; font-size:.85rem; font-weight:700; letter-spacing:0.06em; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all .2s ease; box-shadow:0 4px 12px rgba(0,0,0,0.05);" onmouseover="this.style.background='#334155';this.style.transform='scale(1.05)'" onmouseout="this.style.background='var(--ink)';this.style.transform='scale(1)'">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                RUN
              </button>
            </div>
            <!-- Terminal Body -->
            <div style="padding:1.5rem; font-size:.95rem; line-height:1.7;">
              <div style="color:#64748b;font-size:.85rem;">Last login: <script>document.write(new Date().toDateString())</script> on console</div>
              <div style="margin-top:1rem;">
                <span style="color:#475569; font-weight:700;">adeli@portfolio</span><span style="color:#94a3b8;">:</span><span style="color:#64748b; font-weight:700;">~/{script.replace('.sh', '')}</span>$ <span style="color:var(--ink);">./{script}</span><span style="display:inline-block; width:8px; height:1rem; background:var(--ink); margin-left:6px; vertical-align:middle; animation:blink 1s step-end infinite;"></span>
              </div>
              <div id="{tab_id}-content-wrap" style="display:none; margin-top:1.5rem; padding-top:1.5rem; border-top:1px dashed #cbd5e1; font-family:'Inter', sans-serif;">
                <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem;margin-bottom:1.5rem;">
                  <div style="font-family:'Space Mono', Courier, monospace; font-size:.85rem; color:#10b981; font-weight:700;">✔ {header}</div>
                </div>
{inner}
              </div>
            </div>
          </div>'''

# Split the string finding each tab
for t in tabs:
    # regex to find tab content
    tab_class_pattern = r'(<div id="tab-' + t['id'] + r'" class="tab-content(?: active)?">)(.*?)(\n        </div>\n        <!-- TAB:)'
    
    # We must properly match the closing tag. The simplest is to find `<!-- TAB:` of the next,
    # or just know the boundaries since there are no nested `<!-- TAB:` comments.
    
    # But let's write a targeted function to extract balanced tags or just use string split!
    # "<!-- TAB: {NAME} -->" 
    
out = []
# It's much safer to just use regex that searches from tab ID down to the NEXT <!-- TAB: or </div>\n      </div>
for t in tabs:
    # We find the start: `<div id="tab-{t['id']}"...>`
    # We find the end: the immediate closing `</div>` right before the next `<!-- TAB:`
    start_str = f'<div id="tab-{t["id"]}"'
    start_idx = text.find(start_str)
    if start_idx == -1: continue
    
    # find close of the div starting tag
    div_start_end = text.find('>', start_idx) + 1
    
    # find the next `<!-- TAB:` or `<!-- COMMIT ACTIVITY CHART REMOVED -->`
    next_tab = text.find('<!-- TAB:', div_start_end)
    if next_tab == -1:
        next_tab = text.find('<!-- COMMIT', div_start_end)
    
    inner_str = text[div_start_end:next_tab]
    # We drop the trailing `</div>` from inner_str
    inner_str = inner_str.rstrip()
    if inner_str.endswith('</div>'):
        inner_str = inner_str[:-6] # remove last </div>
    
    replacement = generate_term(t['id'], t['script'], t['header'], inner_str)
    
    text = text[:div_start_end] + "\n" + replacement + "\n" + text[next_tab - (len('</div>') if not inner_str.endswith('</div>') else 0) - text[div_start_end:next_tab].rstrip().count('</div>'):] # wait, slicing manually is risky. Let's just do it cleanly!

    pass

print("done")
