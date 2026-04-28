import React, { useState } from 'react';

export default function Goals({ goals, onAdd, onDelete }) {
  const [form, setForm] = useState({ name: '', target: '', months: '' });
  const [open, setOpen] = useState(false);

  function handleAdd() {
    if (!form.name || !form.target || !form.months) return;
    onAdd({ name: form.name, target: parseFloat(form.target), months: parseInt(form.months) });
    setForm({ name: '', target: '', months: '' });
    setOpen(false);
  }

  return (
    <div>
      <div className="page-header">
        <div className="logo-text">GOALS</div>
        <button
          onClick={() => setOpen(o => !o)}
          style={{ background: 'var(--primary)', border: 'none', borderRadius: 12, padding: '8px 16px', color: '#fff', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 13, boxShadow: '0 4px 12px rgba(255,107,53,0.3)' }}
        >
          {open ? 'Cancel' : '+ Goal'}
        </button>
      </div>

      {/* Add Goal Form */}
      {open && (
        <div className="add-goal-form scale-in">
          <div className="agf-title">NEW FINANCIAL GOAL</div>
          <input className="agf-input" placeholder="Goal name (e.g. MacBook Pro)" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          <div className="agf-row">
            <input className="agf-input" placeholder="Target ₹" type="number" value={form.target} onChange={e => setForm(p => ({ ...p, target: e.target.value }))} style={{ marginBottom: 0 }} />
            <input className="agf-input" placeholder="Months" type="number" value={form.months} onChange={e => setForm(p => ({ ...p, months: e.target.value }))} style={{ marginBottom: 0 }} />
          </div>
          <div style={{ height: 10 }} />
          <button className="agf-btn" onClick={handleAdd}>CREATE GOAL</button>
        </div>
      )}

      {goals.length === 0 && !open ? (
        <div className="empty-state">
          <div className="empty-emoji">🎯</div>
          <div className="empty-title">NO GOALS YET</div>
          <div className="empty-sub">Set a financial goal and track your progress towards it.</div>
        </div>
      ) : (
        goals.map((g, i) => {
          const pct = Math.min(100, (g.saved / g.target) * 100);
          const monthly = Math.ceil((g.target - g.saved) / g.months);
          return (
            <div key={g.id} className="goal-card fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="goal-top">
                <div>
                  <div className="goal-name">{g.name.toUpperCase()}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3, fontFamily: 'var(--font-b)', fontStyle: 'italic' }}>{g.months} months timeline</div>
                </div>
                <button className="goal-del" onClick={() => onDelete(g.id)}>✕</button>
              </div>

              <div className="goal-nums">
                <div className="goal-saved">₹{g.saved.toLocaleString('en-IN')}</div>
                <div className="goal-target">of ₹{g.target.toLocaleString('en-IN')}</div>
              </div>

              <div className="goal-bar-wrap">
                <div className="goal-bar-fill progress-stripe" style={{ width: `${pct}%` }} />
              </div>

              <div className="goal-footer">
                <span>{Math.round(pct)}% complete</span>
                <span>Save <span className="goal-monthly">₹{monthly.toLocaleString('en-IN')}/mo</span> needed</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
