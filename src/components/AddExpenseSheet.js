import React, { useState } from 'react';

const CATS = [
  { id: 'food',          label: 'Food',       icon: '🍜' },
  { id: 'transport',     label: 'Travel',     icon: '🚗' },
  { id: 'shopping',      label: 'Shopping',   icon: '🛍️' },
  { id: 'bills',         label: 'Bills',      icon: '⚡' },
  { id: 'entertainment', label: 'Fun',        icon: '🎬' },
  { id: 'other',         label: 'Other',      icon: '📦' },
];

export default function AddExpenseSheet({ onClose, onSave, busy }) {
  const [amt, setAmt]   = useState('');
  const [desc, setDesc] = useState('');
  const [cat, setCat]   = useState('food');

  function numPress(k) {
    if (k === 'del') { setAmt(p => p.slice(0, -1)); return; }
    if (k === '.' && amt.includes('.')) return;
    if (amt.replace('.', '').length >= 7) return;
    setAmt(p => p + k);
  }

  function handleSave() {
    if (!parseFloat(amt) || !desc.trim()) return;
    onSave({ amount: parseFloat(amt), label: desc, category: cat });
  }

  const display = amt ? `₹${parseFloat(amt).toLocaleString('en-IN')}` : null;

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="bottom-sheet">
        <div className="sheet-handle" />
        <div className="sheet-title">LOG EXPENSE</div>
        <div className="sheet-sub">Track where your money goes</div>

        {/* Amount display */}
        <div className="amount-disp">
          <div className="amount-disp-label">Amount</div>
          <div className={`amount-disp-val${amt ? ' has-val' : ''}`}>
            {display || <span style={{ color: '#D1D5DB' }}>₹0</span>}
          </div>
        </div>

        {/* Description */}
        <input
          className="sheet-input"
          placeholder="What was this for?"
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />

        {/* Categories */}
        <div className="cat-chips-wrap">
          {CATS.map(c => (
            <button
              key={c.id}
              className={`cat-chip${cat === c.id ? ' active' : ''}`}
              onClick={() => setCat(c.id)}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Numpad */}
        <div className="numpad-grid">
          {['1','2','3','4','5','6','7','8','9','.','0','del'].map(k => (
            <button key={k} className={`num-btn${k==='del'?' del':''}`} onClick={() => numPress(k)}>
              {k === 'del' ? '⌫' : k}
            </button>
          ))}
        </div>

        {/* Confirm */}
        <button className="confirm-btn" onClick={handleSave} disabled={!amt || !desc.trim() || busy}>
          {busy ? 'SAVING...' : 'CONFIRM'}
        </button>
      </div>
    </>
  );
}
