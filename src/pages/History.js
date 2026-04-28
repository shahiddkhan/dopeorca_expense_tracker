import React, { useState } from 'react';

const CAT_META = {
  food:          { icon: '🍜', color: '#FF6B35', bg: 'rgba(255,107,53,0.1)'  },
  transport:     { icon: '🚗', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)'  },
  shopping:      { icon: '🛍️', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)'  },
  bills:         { icon: '⚡', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)'  },
  entertainment: { icon: '🎬', color: '#EC4899', bg: 'rgba(236,72,153,0.1)'  },
  other:         { icon: '📦', color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
};

export default function History({ expenses, onDelete }) {
  const [query, setQuery] = useState('');

  const filtered = expenses.filter(e =>
    e.label.toLowerCase().includes(query.toLowerCase()) ||
    e.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div className="logo-text">HISTORY</div>
        <div style={{ fontSize: 13, color: 'var(--text3)', fontFamily: 'var(--font-b)', fontStyle: 'italic' }}>{expenses.length} records</div>
      </div>

      {/* Search */}
      <div className="history-search fade-up">
        <input
          className="search-input"
          placeholder="Search transactions…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className="filter-btn">⌕</button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-emoji">📋</div>
          <div className="empty-title">NO RECORDS</div>
          <div className="empty-sub">{query ? 'Nothing matches your search.' : 'Log an expense to see history.'}</div>
        </div>
      ) : (
        <div className="tx-card-wrap fade-up">
          {filtered.map((exp, i) => {
            const m = CAT_META[exp.category] || CAT_META.other;
            return (
              <div key={exp.id} className="tx-row" style={{ animationDelay: `${i * 0.04}s` }}>
                <div className="tx-icon-box" style={{ background: m.bg }}>{m.icon}</div>
                <div className="tx-info">
                  <div className="tx-name">{exp.label}</div>
                  <div className="tx-meta">
                    <span className="cat-tag" style={{ background: m.bg, color: m.color }}>{exp.category}</span>
                    {' · '}{exp.time}
                  </div>
                </div>
                <div className="tx-right">
                  <div className="tx-amount">₹{exp.amount.toLocaleString('en-IN')}</div>
                  <div className="tx-date">{exp.date}</div>
                </div>
                <button className="tx-del-btn" onClick={() => onDelete(exp.id)}>✕</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
