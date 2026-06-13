import React, { useState, useEffect } from 'react';
import { Clock, Eye } from 'lucide-react-motion';

export default function AnimatedWidgets({ show }) {
  const [time, setTime] = useState('--:--:--');
  const [date, setDate] = useState('');
  const [timezone, setTimezone] = useState('');
  const [visits, setVisits] = useState(0);

  // Clock tick
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
      setDate(now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Visitor Counter
  useEffect(() => {
    const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3005';
    fetch(`${API_URL}/api/visit`, { method: 'POST' })
      .then(res => res.json())
      .then(json => {
        if (json.success && typeof json.totalVisits === 'number') {
          animateCounter(json.totalVisits);
        } else {
          fallbackLocal();
        }
      })
      .catch(err => {
        console.warn("SQLite visits server offline, using localStorage fallback:", err);
        fallbackLocal();
      });

    function animateCounter(target) {
      let cur = 0;
      const step = Math.max(1, Math.floor(target / 30));
      const t = setInterval(() => {
        cur = Math.min(cur + step, target);
        setVisits(cur);
        if (cur >= target) clearInterval(t);
      }, 40);
    }

    function fallbackLocal() {
      let count = parseInt(localStorage.getItem('profile_visits') || '0') + 1;
      localStorage.setItem('profile_visits', count.toString());
      animateCounter(count);
    }
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* LOCAL TIME WIDGET */}
      {(!show || show === 'time') && (
        <div className="border border-[#cacacb] p-5 bg-white text-[#111111] flex flex-col gap-2 rounded-[8px]">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#707072]">
            <Clock className="w-4 h-4 text-[#111111]" strokeWidth={2} mode="signature" />
            <span>Local Time</span>
          </div>
          <div id="clock-display" className="text-3xl font-extrabold tracking-tight font-sans mt-1">
            {time}
          </div>
          <div className="text-xs text-[#707072] font-semibold mt-0.5 tracking-wide">
            {date}
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            <span className="border border-[#cacacb] rounded-full px-3 py-1 bg-[#f5f5f5] text-[10px] font-bold text-[#111111]">
              {timezone}
            </span>
          </div>
        </div>
      )}

      {/* VISITOR COUNTER WIDGET */}
      {(!show || show === 'visits') && (
        <div className="border border-[#cacacb] p-5 bg-white text-[#111111] flex flex-col gap-2 rounded-[8px]">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#707072]">
            <Eye className="w-4 h-4 text-[#111111]" strokeWidth={2} mode="signature" />
            <span>Total Visits</span>
          </div>
          <div className="text-3xl font-extrabold tracking-tight font-sans mt-1">
            {visits.toLocaleString()}
          </div>
          <div className="text-xs text-[#707072] font-semibold mt-0.5 tracking-wide">
            Thanks for visiting
          </div>
        </div>
      )}
    </div>
  );
}
